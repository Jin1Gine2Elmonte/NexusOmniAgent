/**
 * NEXUS FORGE LOOP VERIFY (offline, no API, NOT live-wired).
 * Proves the forge loop is structurally stronger than one-pass and stays
 * within budget and honesty rules.
 */

import {
  runOnePass,
  runForgeLoop,
  FORGE_MAX_TOKENS,
  ForgeInput
} from "../services/nexusForgeLoop";

const fail = (m: string): never => {
  console.error("✗ " + m);
  process.exit(1);
};
const ok = (m: string) => console.log("✓ " + m);

const input: ForgeInput = {
  surfaceQuery: "كيف تحمل البنية وعي النموذج المستقر ولماذا لا يستطيع النموذج وحده ذلك؟",
  intentHint: "analytic-depth",
  explicitGoal: "قرار معماري حول تصميم نظام فوق النموذج.",
  depthMode: "sovereign"
};

const onePass = runOnePass(input);
const forge = runForgeLoop(input);

// 1. Forge loop is structurally richer.
if (forge.stageCount <= onePass.stageCount) fail("forge did not add stages");
if (forge.candidates.length <= onePass.candidates.length) fail("forge did not broaden candidates");
ok(`Forge adds stages ${onePass.stageCount} -> ${forge.stageCount}, candidates ${onePass.candidates.length} -> ${forge.candidates.length}.`);

// 2. It has critique/refine, one-pass does not.
if (!forge.criticNotes.length) fail("forge has no critique");
if (forge.refinedNote.startsWith("لا يوجد")) fail("forge has no refine");
ok("Forge carries critique + refined choice; one-pass does not.");

// 3. Observable structural difference.
if (forge.selectedPath === onePass.selectedPath) fail("selected path unchanged");
ok(`Selected path differs (one-pass vs forge): "${onePass.selectedPath.slice(0, 28)}..." -> "${forge.selectedPath.slice(0, 28)}..."`);

// 4. Budget.
if (forge.tokens > FORGE_MAX_TOKENS) fail(`forge over budget ${forge.tokens} > ${FORGE_MAX_TOKENS}`);
ok(`Budget respected: tokens=${forge.tokens} <= ${FORGE_MAX_TOKENS}.`);

// 5. Honesty/audit.
if (forge.breached.length) fail(`banned terms: ${forge.breached.join(", ")}`);
ok("Audit clean (no Hermes/Odysseus/Meta-Observer/planets/cosmology-as-entity).");

// 6. Fold steering produces a different depth for deep vs surface (observable).
const surface = runForgeLoop({ ...input, depthMode: "surface" });
if (forge.depth === surface.depth && forge.breadth === surface.breadth) {
  fail("fold did not change depth/breadth between sovereign and surface");
}
ok(`Fold steers depth/breadth: surface(depth=${surface.depth}, breadth=${surface.breadth}) vs sovereign(depth=${forge.depth}, breadth=${forge.breadth}).`);

console.log("\nALL NEXUS FORGE CHECKS PASSED.");
