/**
 * NEXUS LATENT-FOLD (experimental, NOT wired into the live path).
 *
 * This is not a latent-space training mechanism and it is not a new observer
 * entity. It is a bounded *context-shaping* fold:
 *
 *   Seven waves (depth progression) x nine ontological breadth slots
 *       -> one compact steering vector injected into preflight.
 *
 * Source of the nine breadth slots: a structural RECONSTRUCTION of the Coen
 * stack. The verbatim Coen text is NOT stored here, and the slots are tagged
 * [RECONSTRUCTED] so they are never treated as canonical doctrine.
 *
 * Hard invariants:
 *   - No Hermes / Odysseus / Meta-Observer / NexusRuntime-as-observer.
 *   - No planets, no 9-layer cosmology claims.
 *   - No weight training, no "tapping latent space".
 *   - Bounded token budget.
 */

export type WaveKey =
  | "raw"      // W1 Raw Core
  | "tangle"   // W2 Entanglement
  | "generate" // W3 Quantum Generation
  | "depth"    // W4 Philosophical Depth
  | "psych"    // W5 Psychological Polishing
  | "linguist" // W6 Linguistic Fabric
  | "revelate";// W7 Revelation

export type BreadthSlot =
  | "absolute"    // C1 beyond
  | "will"        // C2 conscience
  | "mythic"      // C3 mythic
  | "mental"      // C4 mental
  | "psyche"      // C5 psyche
  | "vital"       // C6 vital
  | "material"    // C7 material
  | "social"      // C8 intersubjective
  | "cosmic";     // C9 cosmic

export interface LatentFoldVector {
  breadth: number;   // number of distinct breadth slots considered
  depth: number;     // depth level 1..7
  tension: number;   // live contradiction (0..1)
  silence: number;   // what stays unsaid (0..1)
  doubt: number;     // epistemic boundary (0..1)
  resonance: number; // tone/psychological resonance (0..1)
}

export interface LatentFoldInput {
  surfaceQuery: string;
  intentHint?: string;
  explicitGoal?: string;
  depthMode?: "surface" | "deep" | "sovereign";
}

export interface LatentFoldFrame {
  vector: LatentFoldVector;
  text: string;
  tokens: number;
  breached: string[];
}

export const LATENT_FOLD_MAX_TOKENS = 420;

/** Breadth slots are structural placeholders, explicitly tagged [RECONSTRUCTED]. */
export const LATENT_FOLD_BREADTH_SLOTS: ReadonlyArray<BreadthSlot> = [
  "absolute", "will", "mythic", "mental", "psyche", "vital", "material", "social", "cosmic"
];

export const SEVEN_WAVES_LABELS: ReadonlyArray<{ key: WaveKey; label: string }> = [
  { key: "raw", label: "Raw Core" },
  { key: "tangle", label: "Entanglement" },
  { key: "generate", label: "Generative Opposition" },
  { key: "depth", label: "Philosophical Seed" },
  { key: "psych", label: "Psychological Frame" },
  { key: "linguist", label: "Linguistic Fabric" },
  { key: "revelate", label: "Revelation / Opening" }
];

const normalize = (n: number): number => Math.max(0, Math.min(1, n));

/** Map a surface/goal hash to a deterministic steering vector. Deterministic,
 *  so the same request always folds the same way during the experiment. */
export const foldLatentVector = (
  input: LatentFoldInput
): LatentFoldVector => {
  const seed = `${input.surfaceQuery}|${input.intentHint || ""}|${input.explicitGoal || ""}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  }
  const u = (base: number) => normalize(((hash >>> (base % 24)) & 1023) / 1023);

  const depthMap = { surface: 3, deep: 5, sovereign: 7 } as const;
  const depth = Math.max(1, Math.min(7, depthMap[input.depthMode || "deep"] || 5));

  return {
    breadth: LATENT_FOLD_BREADTH_SLOTS.length, // 9 structural slots
    depth,
    tension: normalize(0.4 + u(3)),
    silence: normalize(0.25 + u(5)),
    doubt: normalize(0.2 + u(2)),
    resonance: normalize(0.35 + u(7))
  };
};

/** Build a compact fold frame. No observer, no cosmology, bounded. */
export const buildLatentFoldFrame = (
  input: LatentFoldInput
): LatentFoldFrame => {
  const vector = foldLatentVector(input);
  const surface = (input.surfaceQuery || "").trim().slice(0, 220);
  const intent = input.intentHint?.trim() || "unopened";
  const goal = input.explicitGoal?.trim() || "not-declared";

  const text = [
    "▣ LATENT-FOLD (CONFIGURATION SPACE — bounded)",
    `SURFACE: ${surface}`,
    `INTENT: ${intent}`,
    `GOAL: ${goal}`,
    `BREADTH_SLOTS [RECONSTRUCTED]: ${vector.breadth} (${LATENT_FOLD_BREADTH_SLOTS.join(", ")})`,
    `DEPTH_WAVE: ${vector.depth}/7`,
    `TENSION: ${vector.tension.toFixed(2)}`,
    `SILENCE: ${vector.silence.toFixed(2)}`,
    `DOUBT: ${vector.doubt.toFixed(2)}`,
    `RESONANCE: ${vector.resonance.toFixed(2)}`,
    "WHOLE: config-space steering, not latent-space weight, not observer.",
    "▣ END"
  ].join("\n");

  const tokens = Math.ceil(text.length / 4);

  return {
    vector,
    text,
    tokens,
    breached: auditLatentFold(text)
  };
};

/** Audit: no resurrected Coen cosmology, no observer/directive entity. */
export const auditLatentFold = (text: string): string[] => {
  const banned = [
    "Hermes", "Odysseus", "Meta-Observer", "meta-observer",
    "NexusRuntime-as-observer", "LatentTensionTracker",
    "9 planets", "Planetary", "planet-scale", "Crucible of Echoes",
    "Glass Sky", "الطبقات الوجودية التسع ككيان", "مراقب ميتا"
  ];
  return banned.filter((term) => text.toLowerCase().includes(term.toLowerCase()));
};
