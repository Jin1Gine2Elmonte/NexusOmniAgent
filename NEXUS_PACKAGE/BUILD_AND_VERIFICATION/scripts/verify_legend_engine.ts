/**
 * LEGEND ENGINE WIRING VERIFY (offline simulation, no live model call).
 * Confirms the legend layer is bounded, audited, and gated to deep/sovereign.
 */

import {
  buildLegendEngine,
  LEGEND_MAX_TOTAL_TOKENS
} from "../services/nexusLegendEngine";

const fail = (m: string): never => {
  console.error("✗ " + m);
  process.exit(1);
};
const ok = (m: string) => console.log("✓ " + m);

const base = {
  surfaceQuery: "كيف تصبح البنية التي فوق النموذج أسطورة تقنية لا شعارات؟",
  intentHint: "analytic-depth",
  explicitGoal: "بناء طبقة أسطورة فنية قابلة للقياس فوق النموذج.",
  selectedModel: "pro-3.1"
};

// 1. Deep/sovereign -> enabled, bounded, audited.
const deep = buildLegendEngine({ ...base, depthMode: "deep" });
if (!deep.enabled) fail("legend engine did not enable for deep");
if (deep.tokens > LEGEND_MAX_TOTAL_TOKENS) fail(`legend over budget: ${deep.tokens}`);
if (deep.breached.length) fail(`legend breached: ${deep.breached.join(", ")}`);
if (!deep.addendum.includes("NEXUS LEGEND ENGINE")) fail("legend addendum missing");
ok(`Deep legend enabled: tokens=${deep.tokens} <= ${LEGEND_MAX_TOTAL_TOKENS}, audit clean.`);

// 2. Surface task -> disabled by default.
const surface = buildLegendEngine({ ...base, depthMode: "surface" });
if (surface.enabled) fail("surface legend should be disabled");
ok("Surface task disables the legend engine (measured, not decorative).");

// 3. Explicit disable respected.
const off = buildLegendEngine({ ...base, depthMode: "sovereign", enabled: false });
if (off.enabled) fail("explicit disable ignored");
ok("Explicit disable is respected.");

// 4. User model choice untouched (legend returns plan with same model).
if (deep.forgePlan.model !== base.selectedModel) fail("legend changed user model");
ok(`User model choice intact: ${deep.forgePlan.model}.`);

// 5. Legend produces observable structure (stages/candidates/critique).
if (deep.forgePlan.stageCount < 2) fail("legend lacks forge stages");
if (deep.forgePlan.candidates.length < 2) fail("legend lacks breadth");
if (!deep.forgePlan.criticNotes.length) fail("legend lacks critique");
ok(`Legend observable: stages=${deep.forgePlan.stageCount}, candidates=${deep.forgePlan.candidates.length}, critique=${deep.forgePlan.criticNotes.length}.`);

console.log("\nALL LEGEND ENGINE CHECKS PASSED.");
