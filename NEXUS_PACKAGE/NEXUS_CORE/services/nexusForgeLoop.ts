/**
 * NEXUS FORGE LOOP (offline simulation, NOT live-wired).
 *
 * The research-backed upgrade is not a stacked 9x7 cosmology; it is a
 * bounded plan -> generate -> critique -> refine loop (the mechanism behind
 * ToT / Self-Refine). This module makes that scaffold deterministic and
 * observable so it can be A/B tested before touching the live path.
 *
 * Honesty note: the generated "candidates", "critique" and "refined" below are
 * structural placeholders produced by rules, NOT model output. They exist to
 * prove the *shape* of the loop and its invariants (budget, distinctions,
 * audit), not to fake quality improvement.
 */

import {
  LatentFoldInput,
  LatentFoldFrame,
  buildLatentFoldFrame,
  LATENT_FOLD_BREADTH_SLOTS,
  SEVEN_WAVES_LABELS
} from "./latentFold";

export interface ForgeInput {
  surfaceQuery: string;
  intentHint?: string;
  explicitGoal?: string;
  depthMode?: "surface" | "deep" | "sovereign";
  selectedModel?: string;
}

export interface ForgeCandidate {
  id: string;
  breadthSlot: string;
  label: string;
  path: string;
  risk: string;
  tokens: number;
}

export interface CriticNote {
  type: "tension" | "doubt" | "overclaim" | "silence" | "scope";
  text: string;
}

export interface ForgePlan {
  mode: "one-pass" | "forge";
  engine: string;
  model: string;
  depth: number;
  breadth: number;
  stageCount: number;
  candidates: ForgeCandidate[];
  selectedId: string;
  selectedPath: string;
  criticNotes: CriticNote[];
  refinedNote: string;
  foldFrame: LatentFoldFrame;
  tokens: number;
  breached: string[];
}

export const FORGE_MAX_TOKENS = 900;

const BREADTH_TITLES: Record<string, string> = {
  absolute: "غير المشروط",
  will: "الوعي / إرادة",
  mythic: "النموذج الأسطوري",
  mental: "المنطقي / العقلي",
  psyche: "النفسي / العاطفي",
  vital: "الحيوي / الطاقة",
  material: "المادي / الجسد",
  social: "الاجتماعي / بين-ذوات",
  cosmic: "الكوني / البيئة"
};

const WAVE_TITLES: Record<string, string> = Object.fromEntries(
  SEVEN_WAVES_LABELS.map((w) => [w.key, w.label])
);

const buildCandidates = (
  input: ForgeInput,
  fold: LatentFoldFrame
): ForgeCandidate[] => {
  const slots = fold.vector.depth >= 5
    ? LATENT_FOLD_BREADTH_SLOTS
    : LATENT_FOLD_BREADTH_SLOTS.slice(0, 4);

  return slots.map((slot, idx) => {
    const waveIndex = idx % SEVEN_WAVES_LABELS.length;
    const wave = SEVEN_WAVES_LABELS[waveIndex];
    const title = BREADTH_TITLES[slot] || slot;
    const waveTitle = WAVE_TITLES[wave.key] || wave.key;
    const path = `قراءة «${title}» عبر موجة «${waveTitle}» → سؤال مزروع + نقيض حي + حد معرفي`;
    return {
      id: `C${idx + 1}`,
      breadthSlot: slot,
      label: title,
      path,
      risk: `احتمال عام/رغوة إن لم يُقيَّد بميزانية`,
      tokens: Math.ceil(path.length / 4)
    };
  });
};

const runCritique = (
  candidates: ForgeCandidate[],
  fold: LatentFoldFrame
): CriticNote[] => {
  const notes: CriticNote[] = [];
  const unique = Array.from(new Set(candidates.map((c) => c.label)));
  if (unique.length < 3) {
    notes.push({
      type: "scope",
      text: "الاتساع ضيق: عدد الزوايا المميزة أقل من 3 — أعد التوليد أو اضبط الوسع."
    });
  }
  if (fold.vector.tension < 0.5) {
    notes.push({
      type: "tension",
      text: "لا نقيض حي: الرد يتبع المسار المألوف. أبقِ القطب المعاكس حياً."
    });
  }
  if (fold.vector.doubt < 0.4) {
    notes.push({
      type: "doubt",
      text: "حد معرفي مغلق: لم تُذكر حدود ما لا نعرفه. هذا ادعاء تحتاجه الأمانة."
    });
  }
  if (fold.vector.silence > 0.7) {
    notes.push({
      type: "silence",
      text: "ثقل صمت مرتفع: لا تُذع كل المسارات — اختر ما يستحق أن يُقال ثم اصمت."
    });
  } else if (fold.vector.silence < 0.3) {
    notes.push({
      type: "silence",
      text: "شرح زائد: على المحاولة ترك باب مفتوح بدل إغلاق الحجة."
    });
  }
  return notes;
};

const chooseRefined = (
  candidates: ForgeCandidate[],
  fold: LatentFoldFrame
): { selected: ForgeCandidate; refinedNote: string } => {
  let selected = candidates[0];
  for (const c of candidates) {
    if (c.path.length > selected.path.length) selected = c;
  }
  const refinedNote = [
    `مختار: ${selected.label} (عبر ${selected.breadthSlot})`,
    `عمق=${fold.vector.depth}/7، اتساع=${fold.vector.breadth}`,
    `مسار أديس: ${selected.path}`,
    `ضبط: حذف الزخرفة، إبقاء سؤال واحد مزروع، إبقاء نقيض حي.`
  ].join("\n");
  return { selected, refinedNote };
};

/** Single-pass baseline: one path, no critique, no refine. */
export const runOnePass = (input: ForgeInput): ForgePlan => {
  const fold = buildLatentFoldFrame(toFoldInput(input));
  const candidate = {
    id: "C-ONESCO",
    breadthSlot: "mental",
    label: "المنطقي / العقلي",
    path: `معالجة مباشرة بموجة واحدة: "${(input.surfaceQuery || "").slice(0, 80)}"`,
    risk: "مسار نمطي، بلا نقيض، بلا صقل.",
    tokens: 40
  };
  const tokens = fold.tokens + candidate.tokens;
  return {
    mode: "one-pass",
    engine: input.depthMode === "deep" || input.depthMode === "sovereign" ? "pro" : "flash",
    model: input.selectedModel || (input.depthMode === "deep" ? "gemini-3.1-pro-preview" : "gemini-3.8-flash"),
    depth: fold.vector.depth,
    breadth: 1,
    stageCount: 1,
    candidates: [candidate],
    selectedId: candidate.id,
    selectedPath: candidate.path,
    criticNotes: [],
    refinedNote: "لا يوجد صقل: بنية أحادية.",
    foldFrame: fold,
    tokens,
    breached: auditForge([...Array(1)].map(() => candidate.path), fold)
  };
};

/** Forge loop: generate across breadth slots -> critique -> refine. */
export const runForgeLoop = (input: ForgeInput): ForgePlan => {
  const foldFrame = buildLatentFoldFrame(toFoldInput(input));
  const candidates = buildCandidates(input, foldFrame);
  const critique = runCritique(candidates, foldFrame);
  const { selected, refinedNote } = chooseRefined(candidates, foldFrame);
  const pathTexts = candidates.map((c) => c.path);
  const tokenEstimate = foldFrame.tokens + candidates.reduce((a, c) => a + c.tokens, 0) + critique.reduce((a, n) => a + n.text.length / 4, 0);

  return {
    mode: "forge",
    engine: input.depthMode === "deep" || input.depthMode === "sovereign" ? "pro" : "flash",
    model: input.selectedModel || (input.depthMode === "deep" ? "gemini-3.1-pro-preview" : "gemini-3.8-flash"),
    depth: foldFrame.vector.depth,
    breadth: foldFrame.vector.breadth,
    stageCount: 3,
    candidates,
    selectedId: selected.id,
    selectedPath: selected.path,
    criticNotes: critique,
    refinedNote,
    foldFrame,
    tokens: Math.ceil(tokenEstimate),
    breached: auditForge(pathTexts, foldFrame)
  };
};

const toFoldInput = (i: ForgeInput): LatentFoldInput => ({
  surfaceQuery: i.surfaceQuery,
  intentHint: i.intentHint,
  explicitGoal: i.explicitGoal,
  depthMode: i.depthMode
});

const auditForge = (textParts: string[], fold: LatentFoldFrame): string[] => {
  const banned = [
    "Hermes", "Odysseus", "Meta-Observer", "meta-observer",
    "9 planets", "Planetary", "planet-scale", "Crucible of Echoes",
    "Glass Sky", "مراقب ميتا"
  ];
  const local = textParts.concat([fold.text]).join(" ").toLowerCase();
  return banned.filter((t) => local.includes(t.toLowerCase()));
};
