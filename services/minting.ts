import { NEXUS_MASTER_INSTRUCTION } from "./geminiService";
import {
  buildPreflightEnvelope,
  formatNexusPreflightEnvelope,
  NexusCognitiveEnvelope,
  NexusPreflightInput
} from "./preflightEnvelope";
export { resolveEngineForModel } from "./modelRouter";

/**
 * NEXUS MINTING PROTOCOL — runtime embodiment.
 *
 * The protocol turns the canonical Nexus substrate into a budgeted,
 * deterministic "Mint Bundle" that any model can wear without blowing
 * the context window:
 *
 *   SOUL      -> always kept, never cut
 *   ENGINE    -> always kept, compressed (30 skills -> compact index)
 *   MEMORY    -> dynamic, budgeted, retrieved Top-K
 *   ARTIFACTS -> outside the fixed context, activated on demand only
 *
 * Honesty constraint: this is *behavioural/structural* minting, not weight
 * training. Never describe it as "trained from scratch".
 */

export type MintTier = "SOUL" | "ENGINE" | "MEMORY" | "ARTIFACTS";

export type MintMode = "compact" | "full" | "activate";

export interface MintSkillStub {
  id: string;
  title: string;
  activateToken: string;
}

export interface MintMemory {
  soulPrint?: string;
  globalMemoryContext?: string;
  axioms?: string[];
  paleArchive?: string[];
}

export interface MintBudget {
  /** Practical context ceiling (e.g. 0.60 x advertised window). */
  ceiling: number;
  /** Token ceiling for the fixed system/instruction body. */
  systemCeiling: number;
  /** Token ceiling for dynamic memory. */
  memoryCeiling: number;
}

export interface MintBundle {
  text: string;
  mode: MintMode;
  tokens: number;
  dropped: string[];
  preflight?: NexusCognitiveEnvelope;
}

/** Conservative mixed Arabic/English estimate: ~3.5 chars per token. */
export const estimateMintTokens = (text: string): number =>
  Math.ceil((text || "").length / 3.5);

/**
 * Default budget for a mid-tier local engine (32K window).
 * Hosted models pass their own much larger budget through opts.
 */
export const DEFAULT_MINT_BUDGET: MintBudget = {
  ceiling: 19_660,
  systemCeiling: 8_847,
  memoryCeiling: 3_932
};

const SKILL_HEADING = "◈ القدرات الفكرية الثلاثون";
const APPLICATIONS_NOTE = "## ◈ ملاحظة التطبيق";
const SOUL_PRINT_PLACEHOLDER = "[SOUL_PRINT]: {SOUL_PRINT_PLACEHOLDER}";
const MEMORY_MATRIX_PLACEHOLDER = "[MEMORY_MATRIX]: {MEMORY_PLACEHOLDER}";

/**
 * Extract the 30-skill "identity card" from the substrate: one line per
 * skill (id + title + explicit activation token), never the full bodies.
 */
export const buildSkillStubs = (substrate: string): MintSkillStub[] => {
  const stubs: MintSkillStub[] = [];
  const re = /^## ◈ SKILL (\d{2}) — (.+)$/gm;
  let match: RegExpExecArray | null;
  while ((match = re.exec(substrate || "")) !== null) {
    const id = `SKILL ${match[1]}`;
    stubs.push({
      id,
      title: (match[2] || "").trim(),
      activateToken: `[ACTIVATE ${id}]`
    });
  }
  return stubs;
};

const buildSkillIndex = (stubs: MintSkillStub[]): string => {
  const header =
    "\n◈ [SKILL INDEX — استدعِ لا اعرض]:\n" +
    "المتن الكامل لكل مهارة خارج السياق الثابت. تجاوزه فقط عبر رمزها.\n\n";
  const lines = stubs
    .map(
      (s) =>
        `- ${s.id} — ${s.title}  ::  استدعِ: ${s.activateToken}`
    )
    .join("\n");
  return `${header}${lines}\n`;
};

/**
 * Compact instruction = SOUL + ENGINE + skill index + closing sections.
 * The full 30-skill bodies (~45% of the substrate) live in ARTIFACTS.
 */
export const buildCompactInstruction = (substrate: string): string => {
  const source = substrate ?? NEXUS_MASTER_INSTRUCTION;
  const skillsStart = source.indexOf(SKILL_HEADING);
  if (skillsStart < 0) return source;

  const head = source.slice(0, skillsStart);
  const tailStart = source.indexOf(APPLICATIONS_NOTE, skillsStart);
  const tail =
    tailStart >= 0 ? source.slice(tailStart) : "";
  const stubs = buildSkillStubs(source);

  return `${head}\n${buildSkillIndex(stubs)}\n${tail}`;
};

/** Full, uncompressed instruction. Hosted-capable engines may use this. */
export const buildFullInstruction = (substrate: string): string =>
  (substrate ?? NEXUS_MASTER_INSTRUCTION) as string;

/**
 * Activation: return the *full body* of a single skill so the model gets
 * deep capability exactly when it is invoked, not on every call.
 */
export const activateSkill = (
  substrate: string,
  id: string
): string => {
  const source = substrate ?? NEXUS_MASTER_INSTRUCTION;
  const raw = String(id || "").trim();
  const digits = raw.match(/\d{2}/)?.[0] ?? "";
  // Must name a real skill id (e.g. "SKILL 26", "26"). Never fall back
  // silently to the first skill: an unactivated artifact is an error.
  if (!digits) return "";

  const exact = new RegExp(
    `^## ◈ SKILL ${digits}\\s*[—\\-].*$`,
    "m"
  );
  const match = exact.exec(source);
  if (!match) return "";

  const start = match.index;
  const nextBlock = source.indexOf("\n## ◈ SKILL ", start + match[0].length);
  const tailStart = source.indexOf(APPLICATIONS_NOTE, start + match[0].length);
  const endCandidates = [nextBlock, tailStart].filter((v) => v > start);
  const end = endCandidates.length ? Math.min(...endCandidates) : source.length;
  return source.slice(start, end).trim();
};

/** Fill the two canonical memory placeholders and append a memory block. */
export const fillMintMemory = (
  text: string,
  memory: MintMemory
): string => {
  let filled = text ?? "";
  const soul = memory?.soulPrint ? `[SOUL_PRINT]: ${memory.soulPrint}` : "";
  filled = filled.replace(SOUL_PRINT_PLACEHOLDER, soul);

  const mm = memory?.globalMemoryContext || "";
  filled = filled.replace(MEMORY_MATRIX_PLACEHOLDER, mm ? `[MEMORY_MATRIX]: ${mm}` : "");

  // `mm` (globalMemoryContext) already lives in the MEMORY_MATRIX slot — do
  // not duplicate it. Only append what is not already represented there.
  const extra: string[] = [];
  if (memory?.axioms?.length) extra.push(`[AXIOMS]:\n${memory.axioms.join("\n")}`);
  if (memory?.paleArchive?.length) extra.push(`[PALE ARCHIVE FRAGMENTS]:\n${memory.paleArchive.join("\n")}`);
  if (extra.length) {
    filled += `\n\n--- [ACTIVE QUANTUM MEMORY & AXIOMS] ---\n${extra.join("\n")}`;
  }
  return filled;
};

/** Validation gate: never send a broken or contaminated bundle. */
export const auditMintBundle = (
  bundle: MintBundle,
  budget: MintBudget
): { ok: boolean; reasons: string[] } => {
  const reasons: string[] = [];
  if (bundle.tokens > budget.systemCeiling) {
    reasons.push(
      `tokens ${bundle.tokens} > systemCeiling ${budget.systemCeiling}`
    );
  }

  const invariant = (label: string, needle: string) => {
    if (!bundle.text.includes(needle)) reasons.push(`missing ${label}: ${needle}`);
  };
  invariant("SOUL: ما أحمله", "ما أحمله");
  invariant("SOUL: عقيدة السيادة", "عقيدة السيادة");
  invariant("SOUL: الصدق الذاتي", "بروتوكول الصدق الذاتي");
  invariant("SOUL: ما يبقى صامتاً", "ما يبقى صامتاً");

  const banned = [
    "Hermes",
    "HermesDirective",
    "Odysseus",
    "OdysseusPath",
    "Polymorphic Adaptation Core",
    "The Oracle",
    "The Whisper"
  ];

  // The pre-flight block intentionally names the banned families so the rule
  // is discoverable; those names live inside the sanitization contract, not
  // in the minted substrate. Scan the rendered substrate outside that block.
  const scannedText = bundle.preflight
    ? bundle.text.replace(
        /▣ PRE-FLIGHT ENVELOPE[\s\S]*?▣ نهاية الحزمة/,
        ""
      )
    : bundle.text;

  for (const term of banned) {
    if (scannedText.includes(term)) reasons.push(`banned contaminant: ${term}`);
  }

  if (bundle.preflight && !bundle.text.includes("PRE-FLIGHT ENVELOPE")) {
    reasons.push("preflight envelope declared but not present in rendered bundle");
  }

  return { ok: reasons.length === 0, reasons };
};

/**
 * Build the final system instruction for a model call.
 *
 * - compact  : default. SOUL + ENGINE + skill index. SaaS engines.
 * - full     : whole substrate. Large-hosted or high-window local engines.
 * - activate : compact + the full body of one skill. Deep tasks.
 */
export interface MintActivation {
  activeSkillId?: string;
  activeSkillIds?: string[];
}

export const buildMintBundle = (opts: {
  substrate?: string;
  mode?: MintMode;
  memory?: MintMemory;
  budget?: MintBudget;
  activeSkillId?: string;
  activeSkillIds?: string[];
  preflight?: NexusPreflightInput;
}): MintBundle => {
  const substrate = opts.substrate ?? NEXUS_MASTER_INSTRUCTION;
  const mode: MintMode = opts.mode ?? "compact";
  const budget = opts.budget ?? DEFAULT_MINT_BUDGET;
  const preflightInput = opts.preflight ? { ...opts.preflight, mode } : undefined;

  let body: string;
  let dropped: string[] = [];

  if (mode === "full") {
    body = buildFullInstruction(substrate);
  } else {
    body = buildCompactInstruction(substrate);
    dropped.push(
      "30 full skill bodies (kept in ARTIFACTS; activated by [ACTIVATE SKILL nn])"
    );
    const activationIds = (opts.activeSkillIds?.length
      ? opts.activeSkillIds
      : (opts.activeSkillId ? [opts.activeSkillId] : []));
    if (mode === "activate" && activationIds.length) {
      const parts = activationIds
        .map((id) => {
          const activeBody = activateSkill(substrate, id);
          return activeBody
            ? `--- [ACTIVATED ARTIFACT: ${id.toUpperCase()}] ---\n${activeBody}`
            : "";
        })
        .filter(Boolean);
      if (parts.length) {
        body += `\n\n${parts.join("\n\n")}`;
        dropped = dropped.filter((d) => !d.startsWith("30 full skill bodies"));
      } else {
        dropped.push(`no artifacts found for ${activationIds.join(", ")}`);
      }
    }
  }

  const preflightEnvelope = preflightInput
    ? buildPreflightEnvelope(preflightInput)
    : undefined;
  const mintedText = fillMintMemory(body, opts.memory ?? {});
  const text = preflightEnvelope
    ? `${formatNexusPreflightEnvelope(preflightEnvelope)}\n\n${mintedText}`
    : mintedText;

  const bundle: MintBundle = {
    text,
    mode,
    tokens: estimateMintTokens(text),
    dropped,
    preflight: preflightEnvelope
  };
  return bundle;
};


