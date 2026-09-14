/**
 * NEXUS RUNTIME PATH SMOKE TEST
 * No API key required. Verifies deterministic routing, skill activation,
 * minting, entity framing, and ledger lifecycle.
 */

import { planWithExplicitEngine } from "../services/nexusRuntime";
import { resolveEngineForModel } from "../services/modelRouter";
import { resolveSkillCluster, createSkillLedger, formatSkillLedgerForCall, recordSkillOutcome } from "../services/skillRuntime";
import { buildMintBundle, auditMintBundle, DEFAULT_MINT_BUDGET } from "../services/minting";
import { createNexusEntityState, formatNexusEntityFrame, advanceNexusState } from "../services/nexusEntityState";

const fail = (msg: string): never => {
  console.error("✗ " + msg);
  process.exit(1);
};
const ok = (msg: string) => console.log("✓ " + msg);

const surface = "اشرح كيف تبني نيكسوس كطبقات تشغيلية فوق النموذج وكيف تُبقيه قابلاً للنمو.";
const req = {
  surface,
  explicitGoal: surface,
  intentHint: "analytic",
  attachments: [] as { mimeType?: string }[],
  prefersDeep: true
};

// 1. Provider model and logical runtime mode are separate contracts.
const explicitPro = planWithExplicitEngine(req, "pro-3.1", resolveEngineForModel("pro-3.1"));
const explicitFlash = planWithExplicitEngine(req, "flash", resolveEngineForModel("flash"));
if (explicitPro.model !== "gemini-3.8-flash") fail(`deep-mode provider wrong: ${explicitPro.model}`);
if (explicitFlash.model !== "gemini-3.8-flash") fail(`flash provider wrong: ${explicitFlash.model}`);
if (explicitPro.engine !== "pro") fail(`deep runtime mode wrong: ${explicitPro.engine}`);
if (explicitFlash.engine !== "flash") fail(`direct runtime mode wrong: ${explicitFlash.engine}`);
if (explicitPro.depthMode !== "sovereign") fail(`deep depthMode wrong: ${explicitPro.depthMode}`);
if (explicitFlash.depthMode !== "surface") fail(`flash depthMode wrong: ${explicitFlash.depthMode}`);
if (explicitPro.skillIntent !== "analytic-depth") fail(`deep skillIntent wrong: ${explicitPro.skillIntent}`);
if (explicitFlash.skillIntent !== "perceptual-reading") fail(`flash skillIntent wrong: ${explicitFlash.skillIntent}`);
ok("Provider routing and runtime modes remain distinct.");

// 2. Runtime decision when no remote explicit engine id.
const local = planWithExplicitEngine(req, "kimi-k3", resolveEngineForModel("kimi-k3"));
if (local.engine !== "pro") fail(`local fallback engine wrong: ${local.engine}`);
if (local.skillIntent !== "analytic-depth") fail(`fallback skillIntent wrong: ${local.skillIntent}`);
ok("Runtime fallback without a remote engine chooses depth correctly.");

// 3. Skill cluster activation.
const skillPlan = resolveSkillCluster(explicitPro.skillIntent);
if (!skillPlan.activeSkillIds.length) fail("No skills activated for analytic-depth.");
if (skillPlan.mode !== "activate") fail(`expected activate mode, got ${skillPlan.mode}`);
ok(`Skill cluster activated: ${skillPlan.clusterLabel} (${skillPlan.activeSkillIds.join(", ")})`);

// 4. Ledger lifecycle.
let ledger = createSkillLedger(skillPlan.activeSkillIds[0]);
ledger = recordSkillOutcome(ledger, "success", "preflight worked; deep runtime mode retained");
const ledgerBlock = formatSkillLedgerForCall(ledger);
if (!ledgerBlock.includes("USAGE: 1")) fail("ledger not recording outcome");
if (!ledgerBlock.includes("SUCCESS: 1")) fail("ledger success not recorded");
ok(`Ledger lifecycle works (${ledgerBlock.split("\n")[0]}).`);

// 5. Entity frame.
const entity = createNexusEntityState();
const entityFrame = formatNexusEntityFrame(entity);
if (!entityFrame.includes("NEXUS")) fail("entity frame missing identity");
const next = advanceNexusState(entity, { focus: surface });
if (next.currentState.focus !== surface) fail("entity state did not carry the focus");
if (next.lastUpdatedAt < entity.lastUpdatedAt) fail("entity state did not advance timestamp");
ok("Entity frame renders and state advances.");

// 6. Mint bundle + preflight envelope + audit.
const bundle = buildMintBundle({
  mode: "activate",
  activeSkillIds: skillPlan.activeSkillIds,
  memory: {
    soulPrint: entity.identityAnchor,
    globalMemoryContext: "NEXUS review + execution in progress.",
    axioms: ["المستخدم صاحب القرار النهائي في اختيار وضع التشغيل."],
    paleArchive: ["entity-frame", "skill-runtime", "bounded-orchestration"]
  },
  preflight: {
    surfaceQuery: surface,
    mode: "activate",
    modelId: explicitPro.model,
    explicitGoal: req.explicitGoal,
    intentHint: req.intentHint,
    runtimeLaws: [
      `MINT MODE: ${skillPlan.mode}`,
      `ACTIVE CLUSTER: ${skillPlan.clusterLabel}`,
      `RUNTIME MODE: ${explicitPro.engine}`,
      `PROVIDER MODEL: ${explicitPro.model}`
    ]
  }
});
const audit = auditMintBundle(bundle, DEFAULT_MINT_BUDGET);
if (!audit.ok) fail(`audit failed: ${audit.reasons.join(" | ")}`);
if (!bundle.text.includes("PRE-FLIGHT ENVELOPE")) fail("bundle missing preflight envelope");
if (!bundle.text.includes("INFERRED_GOAL [declared]")) fail("preflight did not treat explicit goal as declared");
if (!bundle.preflight || bundle.preflight.goalConfidence !== "declared") fail("goal confidence not declared");
ok(`Mint bundle passes audit: tokens=${bundle.tokens}, mode=${bundle.mode}.`);

console.log("\nALL RUNTIME PATH CHECKS PASSED.");
