/**
 * NEXUS LEGEND ENGINE — technical myth made measurable.
 *
 * The "legend" is not a claim to live inside the model's latent space or to
 * change its weights. It is a bounded, audited, observable context layer:
 *
 *   LatentFold (7 waves x 9 breadth slots -> small steering vector)
 *        +
 *   ForgeLoop (plan -> generate across breadth -> critique -> refine)
 *
 * Invariants (never relaxed):
 *   1. User's explicit model choice stays primary.
 *   2. Bounded token budget.
 *   3. No Hermes / Odysseus / Meta-Observer / planets / 9-layer cosmology as entity.
 *   4. Never claims weight training or latent-space membership.
 *   5. Only engages for deep / sovereign tasks (measured, not decorative).
 */

import {
  LatentFoldInput,
  LatentFoldFrame,
  buildLatentFoldFrame,
  LATENT_FOLD_MAX_TOKENS
} from "./latentFold";
import {
  ForgeInput,
  ForgePlan,
  runForgeLoop,
  FORGE_MAX_TOKENS
} from "./nexusForgeLoop";

export interface LegendEngineInput {
  surfaceQuery: string;
  intentHint?: string;
  explicitGoal?: string;
  depthMode?: "surface" | "deep" | "sovereign";
  selectedModel?: string;
  enabled?: boolean; // default true for deep/sovereign
}

export interface LegendEngineResult {
  enabled: boolean;
  reason: string;
  foldFrame: LatentFoldFrame;
  forgePlan: ForgePlan;
  addendum: string;
  tokens: number;
  breached: string[];
}

export const LEGEND_MAX_TOTAL_TOKENS = LATENT_FOLD_MAX_TOKENS + FORGE_MAX_TOKENS;

const toFoldInput = (i: LegendEngineInput): LatentFoldInput => ({
  surfaceQuery: i.surfaceQuery,
  intentHint: i.intentHint,
  explicitGoal: i.explicitGoal,
  depthMode: i.depthMode
});

const toForgeInput = (i: LegendEngineInput): ForgeInput => ({
  surfaceQuery: i.surfaceQuery,
  intentHint: i.intentHint,
  explicitGoal: i.explicitGoal,
  depthMode: i.depthMode,
  selectedModel: i.selectedModel
});

/** Build the legend addendum. Disabled for surface tasks by default. */
export const buildLegendEngine = (
  input: LegendEngineInput
): LegendEngineResult => {
  const depthMode = input.depthMode || "deep";
  const enabled =
    input.enabled !== false &&
    (depthMode === "deep" || depthMode === "sovereign");

  const foldFrame = buildLatentFoldFrame(toFoldInput(input));
  const forgePlan = runForgeLoop(toForgeInput(input));

  if (!enabled) {
    return {
      enabled: false,
      reason: "legend engine disabled (surface task or explicit disable).",
      foldFrame,
      forgePlan,
      addendum: "",
      tokens: 0,
      breached: []
    };
  }

  const addendum = [
    "",
    "▣ NEXUS LEGEND ENGINE — MYTH MADE MEASURABLE (bounded)",
    foldFrame.text.split("\n").slice(1, -1).join("\n"),
    `FORGE: stages=${forgePlan.stageCount}, candidates=${forgePlan.candidates.length}, selected=${forgePlan.selectedId}`,
    `CRITIQUE (${forgePlan.criticNotes.length}): ${forgePlan.criticNotes
      .map((n) => `${n.type}: ${n.text}`)
      .join(" | ")}`,
    `REFINED: ${forgePlan.refinedNote}`,
    "LEGEND IS CONTEXT-SHAPING, NOT WEIGHT TRAINING, NOT LATENT-SPACE MEMBERSHIP.",
    "▣ END LEGEND"
  ].join("\n");

  return {
    enabled: true,
    reason: "deep/sovereign task; steering + forge bound by budget and honesty audit.",
    foldFrame,
    forgePlan,
    addendum,
    tokens: foldFrame.tokens + forgePlan.tokens,
    breached: [
      ...foldFrame.breached,
      ...forgePlan.breached
    ]
  };
};
