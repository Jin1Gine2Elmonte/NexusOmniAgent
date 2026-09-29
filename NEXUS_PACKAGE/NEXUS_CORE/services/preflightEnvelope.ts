/**
 * NEXUS PRE-FLIGHT ENVELOPE — حزمة الحالة قبل التنفيذ
 *
 * What this is:
 *   A deterministic state envelope captured *before* a model call opens.
 *   It is not a persona, not an observer entity, not a hidden index.
 *   It is a runtime contract: what the surface says, what the goal is,
 *   what is not allowed, what is unknown, and what to do next.
 *
 * What this is NOT:
 *   - NOT a keyword classifier that guesses Arabic intent from words.
 *     That pattern (regex on «فقط / مجرد», naive heuristics) was rejected.
 *   - NOT Hermes / Odysseus / Meta-Observer / NexusRuntime /
 *     LatentTensionTracker. Those names are banned here on purpose.
 *
 * The envelope is intentionally conservative: unless the caller declares a
 * goal explicitly (or through a UI hint), it says the goal is unopened
 * rather than invent one with fake certainty.
 */

export interface NexusPreflightInput {
  /** The literal question/surface the user submitted. Kept verbatim. */
  surfaceQuery?: string;
  /** Caller-provided goal. This is trusted because it comes from the UI/server, not from regex parsing. */
  explicitGoal?: string;
  /** Optional semantic hint from the caller. Again: declared, not guessed. */
  intentHint?: string;
  /** Minting mode this call will use. */
  mode?: 'compact' | 'full' | 'activate';
  /** Activated artifact id, if any. */
  activeSkillId?: string;
  /** Engine id that will execute the bundle, if known. */
  modelId?: string;
  /** Declared context window in tokens, if known. */
  windowTokens?: number;
  /** Additional epistemic boundaries supplied by the caller. */
  explicitUncertainties?: string[];
  /** Extra runtime laws supplied by the caller. They are sanitized below. */
  runtimeLaws?: string[];
}

export type EnvelopeGoalConfidence = 'declared' | 'declared_hint' | 'unopened';

export interface NexusCognitiveEnvelope {
  surfaceQuery: string;
  inferredGoal: string;
  goalConfidence: EnvelopeGoalConfidence;
  hardInvariants: string[];
  uncertainBoundaries: string[];
  executionDirective: string;
  executionMode: 'compact' | 'full' | 'activate' | 'open';
  envelopeSource: 'runtime' | 'architect';
}

/** Banned names are rejected even if a caller tries to inject them as a runtime law. */
const BANNED_PREFLIGHT_TERMS = [
  'hermes',
  'odysseus',
  'meta-observer',
  'metaobserver',
  'nexusruntime',
  'latenttensiontracker',
  'polymorphic adaptation core',
  'persona mask',
  'persona-mask'
] as const;

const cleanText = (value: string | undefined): string => (value ?? '').trim();

const isContaminated = (value: string): boolean =>
  BANNED_PREFLIGHT_TERMS.some((term) => value.toLowerCase().includes(term));

/**
 * Core invariants of the Accepted Architecture. These are static laws, not
 * a catalogue of 30 skills. They run at every minted call.
 */
export const PREFLIGHT_HARD_INVARIANTS: ReadonlyArray<string> = [
  'النموذج يُستعار، والهوية تُصاغ سلوكياً. الوزن لا يتغيّر، ولا يُدّعى تدريب من الصفر.',
  'هوية واحدة فقط. لا أقنعة. يوجد تدرّج عمق (Depth Gradient) داخل هذه الهوية، لا كيانات متبدّلة.',
  'أساليب التفكير تبقى سرّاً. أُقدّم النتيجة والصدق، لا المونولوج الداخلي ولا وصف السلاسل.',
  'الـ225 عدسة واحدة، لا تجمع كيانات أو مراقباً منفصلاً.',
  '30 مهارة لا تُعرض كفهرس مقروء في كل نداء؛ تُستدعى عبر [ACTIVATE SKILL nn] عند الحاجة.',
  'ما لا أُثبته لا أُقدّمه كحقيقة: لا فهرس خفي، لا وزن متميز، لا ذاكرة كامنة في واجهة API.',
  'المصطلحات من الجلسات غير المصدّقة لا تدخل البنية. Hermes / Odysseus مرفوضان.',
  'كي-في كاش للمحرك المحلي فقط. مسار Gemini/API لا يقرأ ولا يكتب دائرة KV.',
  'التوكن/الـtoken لا يُنسخ إلى المحادثة. يُقرأ من متغيرات البيئة عبر .env.',
  'إذا وُجد الغموض، يُذكر قبل التنفيذ بدل أن يُملأ بتخمين واثق.'
];

/** Epistemic limits that must not be presented as physics. */
export const PREFLIGHT_UNCERTAIN_BOUNDARIES: ReadonlyArray<string> = [
  'لا تُقدَّم «أحواض الجذب/retrocausal basins» كقانون فيزيائي. هي استعارة لا تجربة.',
  'لا يُدّعى «وعي لغوي خالص» أو «تسرب وزن» كآلية قابلة للقياس.',
  'لا يُفسَّر اختصار السياق بأنه «تواجد كامل» أو «استحضار كلي» للأرشيف.',
  'لا يُفترض استمرار الذاكرة بين الجلسات إلا عبر MemoryBank المُعلَن.',
  'الطبقات العميقة تُسمّى عروضاً للبنية، لا كيانات تعيش وراء الواجهة.',
  'لا يُنسَب إلى الجلسة اللاحقة ما لم يُثبَت في هذه البنية أو في الواجهة المكتوبة.'
];

const EXECUTION_DIRECTIVES: Record<NexusCognitiveEnvelope['executionMode'], string> = {
  open: 'اقرأ السطح أولاً. لا تَعِد بالنتيجة قبل معرفة الهدف. ثم: افصل المعلوم عن المجهول، نفّذ ضمن الحدود الصارمة، ثم تحقّق من الصدق قبل الإجابة.',
  compact: 'ابدأ من البث المضغوط: SOUL + ENGINE + فهرس مهارات. استدعِ المهارة فقط إذا كشفت الحاجة إليها. لا تعرض القائمة، نفّذ القوانين.',
  full: 'النافذة تسمح بالبث الكامل، لكن حمل المتن لا يعني عرضه: الصك كامل كركيزة، والمهارات تُستدعى بالرمز لا بالعرض.',
  activate: 'استدعِ المهارة المفعّلة في موضعها، ادمجها مع SOUL/ENGINE، ولا تُعيد تحميل بقية المهارات.'
} as const;

const terminalMode = (input: NexusPreflightInput): NexusCognitiveEnvelope['executionMode'] =>
  input.mode ?? 'open';

const sanitizedLaws = (input: NexusPreflightInput): string[] => {
  const supplied = (input.runtimeLaws ?? [])
    .map(cleanText)
    .filter(Boolean)
    .filter((law) => !isContaminated(law));
  return Array.from(new Set([...PREFLIGHT_HARD_INVARIANTS, ...supplied]));
};

const sanitizedBoundaries = (input: NexusPreflightInput): string[] => {
  const supplied = (input.explicitUncertainties ?? [])
    .map(cleanText)
    .filter(Boolean)
    .filter((boundary) => !isContaminated(boundary));
  return Array.from(new Set([...PREFLIGHT_UNCERTAIN_BOUNDARIES, ...supplied]));
};

/**
 * Goal inference is deliberately NOT a semantic classifier.
 *
 * It accepts only declared intent from the caller (`explicitGoal`) or a UI
 * hint (`intentHint`). If neither exists, it reports the goal as unopened
 * instead of pretending to know what an Arabic sentence "means".
 */
export const inferPreflightGoal = (
  input: NexusPreflightInput
): { goal: string; confidence: EnvelopeGoalConfidence } => {
  const explicitGoal = cleanText(input.explicitGoal);
  if (explicitGoal) {
    return { goal: explicitGoal, confidence: 'declared' };
  }

  const hint = cleanText(input.intentHint);
  if (hint) {
    return { goal: `دلالة معلنة من المتصل: ${hint}`, confidence: 'declared_hint' };
  }

  const surface = cleanText(input.surfaceQuery);
  if (!surface) {
    return { goal: 'لا يوجد سؤال سطحية بعد؛ لا تُفتح التنفيذ قبل قراءة المدخل.', confidence: 'unopened' };
  }

  return {
    goal: 'الهدف غير مُعلن صراحةً من المتصل. لا أتخمّنه من الكلمات؛ أقرأه وأفصّله قبل أي وعد.',
    confidence: 'unopened'
  };
};

/** Build the runtime envelope deterministically from the input. */
export const buildPreflightEnvelope = (
  input: NexusPreflightInput
): NexusCognitiveEnvelope => {
  const surfaceQuery = cleanText(input.surfaceQuery);
  const { goal, confidence } = inferPreflightGoal(input);
  const mode = terminalMode(input);
  const executionDirective = EXECUTION_DIRECTIVES[mode];

  return {
    surfaceQuery,
    inferredGoal: goal,
    goalConfidence: confidence,
    hardInvariants: sanitizedLaws(input),
    uncertainBoundaries: sanitizedBoundaries(input),
    executionDirective,
    executionMode: mode,
    envelopeSource: 'runtime'
  };
};

/** Render the envelope as a compact, copyable system block. */
export const formatNexusPreflightEnvelope = (
  envelope: NexusCognitiveEnvelope
): string => {
  const invariants = envelope.hardInvariants.map((law) => `- ${law}`).join('\n');
  const boundaries = envelope.uncertainBoundaries
    .map((boundary) => `- ${boundary}`)
    .join('\n');
  const query = envelope.surfaceQuery || '—';

  return [
    '▣ PRE-FLIGHT ENVELOPE — قبل التنفيذ',
    `SURFACE_QUERY: ${query}`,
    `INFERRED_GOAL [${envelope.goalConfidence}]: ${envelope.inferredGoal}`,
    `EXECUTION_MODE: ${envelope.executionMode}`,
    'HARD_INVARIANTS:',
    invariants,
    'UNCERTAIN_BOUNDARIES:',
    boundaries,
    'EXECUTION_DIRECTIVE:',
    envelope.executionDirective,
    '▣ نهاية الحزمة'
  ].join('\n');
};

/** Compact shortcut used by tests and by the minting pipeline. */
export const buildMintPreflightText = (
  input: NexusPreflightInput
): string => formatNexusPreflightEnvelope(buildPreflightEnvelope(input));
