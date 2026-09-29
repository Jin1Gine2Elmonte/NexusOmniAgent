import express from "express";
import {
  ensureBridgeDirs,
  writeNote,
  listNotes,
  readNote,
  updateNoteStatus,
  buildBridgePrompt,
  runRemoteAgent,
  type BridgeDirection,
  type BridgeKind,
  type BridgeState
} from "./services/agentBridge";

const router = express.Router();

ensureBridgeDirs();

// The copyable handover text to paste into the executor agent (AI Studio).
router.get("/prompt", (_req, res) => {
  res.json({ prompt: buildBridgePrompt() });
});

router.get("/inbox", (_req, res) => {
  res.json({ notes: listNotes("inbox") });
});

router.get("/outbox", (_req, res) => {
  res.json({ notes: listNotes("outbox") });
});

router.get("/inbox/:file", (req, res) => {
  res.json({ note: readNote("inbox", req.params.file) });
});

router.post("/outbox", (req, res) => {
  const {
    kind = "directive",
    title = "",
    body = "",
    status = "open",
    references = []
  } = req.body ?? {};

  if (!title || !body) {
    return res.status(400).json({ error: "title and body are required" });
  }

  const note = writeNote({
    from: "architect",
    to: "agent-executor",
    kind: kind as BridgeKind,
    status: status as BridgeState,
    title,
    body,
    references,
    direction: "outbox"
  });

  res.json({ success: true, note });
});

// Run the executor directly and put its reply in the architect's inbox.
router.post("/run", async (req, res) => {
  const { message = "", model } = req.body ?? {};
  if (!message) return res.status(400).json({ error: "message is required" });

  try {
    const note = await runRemoteAgent({ message, model });
    res.json({ success: true, note });
  } catch (err: any) {
    const missing = !!err?.message?.includes("TOKEN_MISSING");
    res.status(missing ? 503 : 500).json({
      success: false,
      error: missing
        ? "GEMINI_API_KEY غير موجود في .env — ضع المفتاح هناك ولا تلوّنه في المحادثة."
        : err?.message || "فشل استدعاء الوكيل المنفّذ.",
      errorCode: missing ? "AGENT_BRIDGE_TOKEN_MISSING" : "AGENT_BRIDGE_RUN_FAILED"
    });
  }
});

// Mark an inbox/outbox note as answered/done.
router.post("/note/:direction/:file/status", (req, res) => {
  const direction = req.params.direction as BridgeDirection;
  const file = req.params.file;
  const status = req.body?.status as BridgeState;
  if (!["open", "answered", "done"].includes(status)) {
    return res.status(400).json({ error: "invalid status" });
  }
  updateNoteStatus(direction, file, status);
  res.json({ success: true });
});

export default router;
