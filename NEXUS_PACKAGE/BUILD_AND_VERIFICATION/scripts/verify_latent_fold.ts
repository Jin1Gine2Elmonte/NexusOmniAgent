/**
 * LATENT-FOLD DETERMINISTIC PROBE (offline, no API, NOT live-wired).
 * Proves the fold is bounded, deterministic, and audited. It does NOT claim
 * to change model weights or to touch the true latent space.
 */

import {
  buildLatentFoldFrame,
  LATENT_FOLD_MAX_TOKENS,
  LATENT_FOLD_BREADTH_SLOTS
} from "../services/latentFold";

const fail = (m: string): never => {
  console.error("✗ " + m);
  process.exit(1);
};
const ok = (m: string) => console.log("✓ " + m);

const input = {
  surfaceQuery: "اشرح لماذا تشعر الإجابة الصادقة بالثقل، وكيف تحملها البنية؟",
  intentHint: "analytic-depth",
  explicitGoal: "تصميم حزمة سياق تدفع النموذج نحو منطقة أوسع من تمثيله.",
  depthMode: "sovereign" as const
};

const frame = buildLatentFoldFrame(input);
const frame2 = buildLatentFoldFrame(input);

// 1. Determinism.
if (frame.text !== frame2.text) fail("fold is not deterministic");
ok("Fold is deterministic (same request -> same frame).");

// 2. Bounded budget.
if (frame.tokens > LATENT_FOLD_MAX_TOKENS) fail(`over budget: ${frame.tokens} > ${LATENT_FOLD_MAX_TOKENS}`);
ok(`Budget respected: tokens=${frame.tokens} <= ${LATENT_FOLD_MAX_TOKENS}.`);

// 3. Breadth + depth both present.
if (frame.vector.breadth !== LATENT_FOLD_BREADTH_SLOTS.length) fail("breadth wrong");
if (frame.vector.depth < 1 || frame.vector.depth > 7) fail("depth out of range");
ok(`Fold vector carries breadth=${frame.vector.breadth}, depth=${frame.vector.depth}/7.`);

// 4. Honesty/cosmology audit.
if (frame.breached.length) fail(`banned terms present: ${frame.breached.join(", ")}`);
ok("Audit clean (no Hermes/Odysseus/Meta-Observer/planets/9-layer-cosmology).");

// 5. Observable difference in the plan path (structural H-probe):
//    fold changes the steering (tension/silence/doubt) vs a flat baseline.
const flat = buildLatentFoldFrame({
  ...input,
  intentHint: "",
  explicitGoal: "",
  depthMode: "surface"
});
const changed =
  frame.vector.depth !== flat.vector.depth ||
  frame.vector.tension !== flat.vector.tension ||
  frame.vector.resonance !== flat.vector.resonance;
if (!changed) fail("fold produced no observable change vs flat baseline");
ok("Fold produces an observable structural difference vs a flat baseline.");

console.log("\nALL LATENT-FOLD CHECKS PASSED.");
