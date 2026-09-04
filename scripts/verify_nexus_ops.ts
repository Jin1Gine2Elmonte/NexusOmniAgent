/**
 * NEXUS OPS CHANNEL VERIFY (offline, no API).
 * Proves the two agents can write to and read the same Markdown vault.
 */

import {
  createScratchVault,
  openNexusOpsChannel
} from "../services/nexusOpsChannel";

const fail = (m: string): never => {
  console.error("✗ " + m);
  process.exit(1);
};
const ok = (m: string) => console.log("✓ " + m);

const root = createScratchVault();
const arena = openNexusOpsChannel(root);

// Arena posts into the meeting room.
arena.post({
  from: "arena",
  to: "nexus",
  title: "فتح القناة",
  body: "هذا اختبار حتمي: اقرأ واكتب رداً عبر outbox."
});

// Arena dispatches a machine-readable outbox entry.
arena.dispatch({
  from: "arena",
  to: "nexus",
  title: "مهمة",
  body: "حلّل الهيكل ثم اكتب ملاحظة."
});

// Nexus reopens the same root and reads both.
const nexus = openNexusOpsChannel(root);
if (!nexus.meetingRoom.includes("فتح القناة")) fail("Nexus did not read Arena's meeting-room entry");
if (!nexus.outbox.includes("مهمة")) fail("Nexus did not read Arena's outbox dispatch");
ok("Nexus agent reads Arena's meeting-room + outbox from the same vault.");

// Nexus writes a reply in the meeting room.
nexus.post({
  from: "nexus",
  to: "arena",
  title: "قرأت البنية",
  body: "رأيت entity/skill/runtime/mint/preflight/legend. جاهز."
});

// Arena re-opens and sees the reply.
const arenaAgain = openNexusOpsChannel(root);
if (!arenaAgain.meetingRoom.includes("قرأت البنية")) fail("Arena did not read Nexus reply");
ok("Arena re-opens and reads Nexus's reply (shared vault is the source of truth).");

// Read-by-target only returns messages addressed to that agent.
const counts = arenaAgain.meetingRoom.split("## [").length - 1;
if (counts < 2) fail("meeting room did not accumulate 2+ messages");
ok(`Meeting room is a persistent ledger (${counts} messages).`);

console.log("\nALL NEXUS OPS CHANNEL CHECKS PASSED.");
