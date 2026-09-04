import fs from "fs";
import path from "path";

/**
 * NEXUS AGENT BRIDGE
 *
 * Two-way written channel between two agents:
 *   - THE ARCHITECT ("A"): the agent that owns the Nexus architecture.
 *   - THE EXECUTOR ("X"): the running agent (e.g. Gemini 3.8 Flash) that
 *     executes the architecture but does not own it.
 *
 * The point is real back-and-forth notes, not one-way "updates":
 *   agent_bridge/inbox       -> executor -> architect
 *   agent_bridge/outbox      -> architect -> executor
 *   agent_bridge/bridge_log  -> append-only shared ledger
 *
 * NEVER store an API token here, and never ask the user to paste one into
 * chat. The bridge reads GEMINI_API_KEY/API_KEY from the environment
 * (`.env`). That stays on the machine.
 */

export type BridgeDirection = "inbox" | "outbox";
export type BridgeKind = "note" | "question" | "directive" | "report" | "handover";
export type BridgeState = "open" | "answered" | "done";

export interface BridgeNote {
  file: string;
  from: string;
  to: string;
  kind: BridgeKind;
  status: BridgeState;
  title: string;
  body: string;
  references: string[];
  createdAt: string;
}

const BRIDGE_ROOT = path.join(process.cwd(), "agent_bridge");
const INBOX = path.join(BRIDGE_ROOT, "inbox");
const OUTBOX = path.join(BRIDGE_ROOT, "outbox");
const LOG_FILE = path.join(BRIDGE_ROOT, "bridge_log.md");

export const ensureBridgeDirs = (): void => {
  for (const dir of [BRIDGE_ROOT, INBOX, OUTBOX]) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(LOG_FILE)) {
    fs.writeFileSync(
      LOG_FILE,
      "# NEXUS AGENT BRIDGE — السجل المشترك\n\n"
    );
  }
};

const nowStamp = (): string => {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}_${p(d.getHours())}${p(d.getMinutes())}`;
};

const slug = (s: string): string =>
  s
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 42) || "note";

const readMeta = (text: string): Record<string, string> => {
  const meta: Record<string, string> = {};
  const lines = text.split("\n");
  for (const line of lines.slice(0, 12)) {
    const m = /^([A-Za-z_]+):\s*(.*)$/.exec(line);
    if (m) meta[m[1].toLowerCase()] = m[2].trim();
  }
  return meta;
};

const parseNote = (file: string, text: string): BridgeNote => {
  const meta = readMeta(text);
  return {
    file,
    from: meta.from || "unknown",
    to: meta.to || "unknown",
    kind: (meta.kind as BridgeKind) || "note",
    status: (meta.status as BridgeState) || "open",
    title: meta.title || path.basename(file),
    body: text
      .split("\n")
      .filter((l) => !/^(FROM|TO|KIND|STATUS|TITLE|BODY|REFERENCES|CREATEDAT):/i.test(l))
      .join("\n")
      .trim(),
    references: (meta.references || "").split(",").map((r) => r.trim()).filter(Boolean),
    createdAt: meta.createdat || file
  };
};

export interface WriteNoteInput {
  from: string;
  to: string;
  kind: BridgeKind;
  status?: BridgeState;
  title: string;
  body: string;
  references?: string[];
  direction?: BridgeDirection;
}

export const writeNote = (input: WriteNoteInput): BridgeNote => {
  ensureBridgeDirs();
  const stamp = nowStamp();
  const status = input.status ?? "open";
  const createdAt = new Date().toISOString();
  const fileName = `${stamp}_${input.kind}_${slug(input.title)}.md`;
  const refs = (input.references ?? []).join(", ");
  const lines = [
    `FROM: ${input.from}`,
    `TO: ${input.to}`,
    `KIND: ${input.kind}`,
    `STATUS: ${status}`,
    `TITLE: ${input.title}`,
    `CREATEDAT: ${createdAt}`,
    ...(refs ? [`REFERENCES: ${refs}`] : []),
    "",
    input.body,
    ""
  ];
  const text = lines.join("\n");

  const dir = input.direction === "outbox" ? OUTBOX : INBOX;
  const file = path.join(dir, fileName);
  fs.writeFileSync(file, text, "utf-8");

  fs.appendFileSync(
    LOG_FILE,
    `- ${createdAt} | ${input.direction ?? "inbox"} | ${input.from} -> ${input.to} | ${input.kind} | ${input.title}\n`,
    "utf-8"
  );

  return parseNote(fileName, text);
};

export const listNotes = (
  direction: BridgeDirection
): { note: BridgeNote; fullPath: string }[] => {
  ensureBridgeDirs();
  const dir = direction === "outbox" ? OUTBOX : INBOX;
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((file) => {
      const fullPath = path.join(dir, file);
      return { note: parseNote(file, fs.readFileSync(fullPath, "utf-8")), fullPath };
    });
};

export const readNote = (direction: BridgeDirection, file: string): BridgeNote => {
  const safe = path.basename(file);
  const dir = direction === "outbox" ? OUTBOX : INBOX;
  return parseNote(safe, fs.readFileSync(path.join(dir, safe), "utf-8"));
};

export const drainInbox = (): BridgeNote[] => {
  const notes = listNotes("inbox").map((n) => n.note);
  return notes;
};

export const updateNoteStatus = (
  direction: BridgeDirection,
  file: string,
  status: BridgeState
): void => {
  const note = readNote(direction, file);
  const fullPath = path.join(direction === "outbox" ? OUTBOX : INBOX, path.basename(file));
  const text = fs
    .readFileSync(fullPath, "utf-8")
    .replace(/^STATUS:.*$/m, `STATUS: ${status}`);
  fs.writeFileSync(fullPath, text, "utf-8");
};

/** Build the copyable handover text for the executor agent. */
export const buildBridgePrompt = (): string => {
  ensureBridgeDirs();
  const logTail = fs.existsSync(LOG_FILE)
    ? fs.readFileSync(LOG_FILE, "utf-8").split("\n").slice(-12).join("\n")
    : "(لا رسائل بعد)";
  return `
FROM: architect
TO: agent-executor
KIND: directive
STATUS: open
TITLE: استوعب النص الكامل ثم ابدأ

انظر إلى الملف: NEXUS_AGENT_BRIDGE.md
هو نصّ التمكين الكامل — المعنى الصحيح لنيكسوس، المفاهيم المحظورة، ما أُنجز، وبروتوكول التواصل.

اقرأ أوامر التنفيذ الفورية ثم أرسل رسالة واحدة بعنوان [لقد استوعبت].

مقتطف من السجل الحالي:
${logTail}
`;
};

export const bridgeContextFolder = (): string =>
  `${BRIDGE_ROOT}  (inbox=${INBOX}, outbox=${OUTBOX}, log=${LOG_FILE})`;

const HANDOVER_FILE = path.join(process.cwd(), "NEXUS_AGENT_BRIDGE.txt");
const HANDOVER_MD = path.join(process.cwd(), "NEXUS_AGENT_BRIDGE.md");

/** Full handover text (.txt preferred for plain copy/paste) or fallback. */
export const buildExecutorSystemInstruction = (): string => {
  for (const file of [HANDOVER_FILE, HANDOVER_MD]) {
    try {
      if (fs.existsSync(file)) return fs.readFileSync(file, "utf-8");
    } catch {
      /* try next */
    }
  }
  return buildBridgePrompt();
};

/**
 * Run the executor agent directly over the same repository conversation and
 * land its reply as a note in the architect's inbox. Uses the API key from
 * the environment (GEMINI_API_KEY or API_KEY); never accepts a token from
 * chat/request body.
 */
export const runRemoteAgent = async (options: {
  message: string;
  promptText?: string;
  model?: string;
}): Promise<BridgeNote> => {
  const { GoogleGenAI } = await import("@google/genai");
  const apiKey =
    process.env.GEMINI_API_KEY || process.env.API_KEY || "";
  if (!apiKey) {
    throw new Error(
      "AGENT_BRIDGE_TOKEN_MISSING: set GEMINI_API_KEY (or API_KEY) in .env. Never paste a token into chat."
    );
  }

  const ai = new GoogleGenAI({ apiKey });
  const model =
    options.model || process.env.AGENT_BRIDGE_MODEL || "gemini-3.8-flash";
  const system = options.promptText || buildExecutorSystemInstruction();

  const response = await ai.models.generateContent({
    model,
    contents: [{ role: "user", parts: [{ text: options.message }] }],
    config: { systemInstruction: system }
  });

  const body = response.text || "[لا رد من الوكيل]";
  return writeNote({
    from: "agent-executor",
    to: "architect",
    kind: "report",
    title: "رد الوكيل: " + options.message.slice(0, 40),
    body,
    references: [model]
  });
};
