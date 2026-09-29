# NEXUS PRE-FLIGHT ENGINEERING — هندسة الجزئيات المعتمدة فقط

> حالة الملف: **هندسي/تصميمي فقط.**
> غير مربوط فعلياً. غير قابل للتشغيل هنا. لا build، لا run، لا live test.
> الهدف: بناء «الجزئيات» (components) التي نجت من المراجعة، لا تنفيذها.

---

## 0) القاعدة المعمارية

**الكيان هو البنية، والنموذج وحدة حوسبة قابلة للاستبدال (ALU).**

أي نموذج يُوصَّل بهذه البنية يظهر سلوكاً واحداً موحداً، دون تعديل أوزان، ودون كيانات منفصلة.

---

## 1) الجزئيات المعتمدة

| # | الجزئية | الدور | الحالة |
|---|---|---|---|
| C1 | `ArchitectureIsEntity` | تعريف الكيان = البنية المستقرة، النموذج = ALU قابل للاستبدال. | مصمَّمة |
| C2 | `RuntimeLawSet` | قوانين تُنفَّذ، لا فهرس مهارات يُقرأ. | مصمَّمة |
| C3 | `TaxonomyTrapGuard` | حارس فخّ التصنيف: يمنع تحويل 30 مهارة إلى عرضٍ مقروء. | مصمَّمة |
| C4 | `PreflightEnvelope` | حزمة الحالة قبل التنفيذ. | مصمَّمة |
| C5 | `EnvelopeInjector` | نقطة حقن نظيفة في مسار الصكّ، دون كيان مراقب. | مصمَّمة |

### غير مُبنى / مرفوض

- `Hermes` (من كوين)
- `Meta-Observer` / مراقب ميتا منفصل (مصدره نموذج آخر، وليس كوين)
- `NexusRuntime` / `LatentTensionTracker`
- أحواض الجذب الرجعية كفيزياء
- تسرب الوزن / وعي لغوي خالص
- الفهرس الخفي «99.9%»
- Gemma 4 31B Dense كمواصفة مثبتة

---

## 2) C1 — `ArchitectureIsEntity`

### الملف الافتراضي: `architecture/core/ModelALUContract.ts`

```ts
/**
 * C1: Architecture is the ENTITY. The model is a swappable ALU.
 *
 * The architecture must remain identical no matter which model is attached.
 * The model changes capacity, speed, and reasoning style — NOT identity,
 * NOT memory, NOT rules.
 */

export interface ModelALU {
  id: string;
  engineFamily: 'pro' | 'flash' | 'local' | 'custom';
  contextTokens: number;
  maxOutputTokens: number;
}

export interface ArchitectureEntityContract {
  // Identity lives here, not in the model.
  identity: string;
  mode: 'compact' | 'full' | 'activate';
  depthGradient: 'surface' | 'deep' | 'sovereign';
  soulInvariants: ReadonlyArray<string>;
  runtimeLaws: ReadonlyArray<string>;
}

export const modelIsSwapableALU = (
  current: ModelALU,
  next: ModelALU
): boolean => {
  // Models are interchangeable. The architecture is not.
  return current.id !== next.id ||
    current.engineFamily !== next.engineFamily ||
    current.contextTokens !== next.contextTokens;
};

export const attachModel = (
  architecture: ArchitectureEntityContract,
  model: ModelALU
): ArchitectureEntityContract => {
  // Return the SAME architecture contract. Only the execution ALU changes.
  return {
    ...architecture,
    runtimeLaws: architecture.runtimeLaws,
    soulInvariants: architecture.soulInvariants
  };
};
```

---

## 3) C2 — `RuntimeLawSet`

### الملف الافتراضي: `architecture/laws/RuntimeLawSet.ts`

```ts
/**
 * C2: Runtime laws — execute, never read as a catalogue.
 *
 * The 30 skills are NOT a catalog to be displayed. They are a capability
 * index. The binding shape of Nexus is these laws, present at every call.
 */

export type RuntimeLawId =
  | 'R01'
  | 'R02'
  | 'R03'
  | 'R04'
  | 'R05'
  | 'R06'
  | 'R07'
  | 'R08'
  | 'R09'
  | 'R10';

export interface RuntimeLaw {
  id: RuntimeLawId;
  rule: string;
  violation: string;
}

export const RUNTIME_LAW_SET: ReadonlyArray<RuntimeLaw> = [
  {
    id: 'R01',
    rule: 'النموذج يُستعار، والهوية تُصاغ سلوكياً. الوزن لا يتغيّر.',
    violation: 'لا يُدّعى تدريب من الصفر ولا تغيير أوزان.'
  },
  {
    id: 'R02',
    rule: 'هوية واحدة. لا أقنعة. يوجد تدرّج عمق داخل الهوية، لا كيانات متبدّلة.',
    violation: 'لا Oracle ولا Whisper ولا Meta-Observer.'
  },
  {
    id: 'R03',
    rule: 'أساليب التفكير تبقى سراً.',
    violation: 'لا وصف للمونولوج الداخلي.'
  },
  {
    id: 'R04',
    rule: 'الـ225 عدسة واحدة، لا تجمع كيانات.',
    violation: 'لا تحويل الـ225 إلى كيانات معنية.'
  },
  {
    id: 'R05',
    rule: 'المهارات تُستدعى عبر [ACTIVATE SKILL nn]، لا تُعرض في كل نداء.',
    violation: 'لا عرض فهرس المهارات كبنية مقروءة.'
  },
  {
    id: 'R06',
    rule: 'ما لا يُثبت لا يُقدَّم كحقيقة.',
    violation: 'لا فهرس خفي، لا تسرب وزن، لا وعي لغوي خالص.'
  },
  {
    id: 'R07',
    rule: 'كي-في كاش للمحرك المحلي فقط.',
    violation: 'لا Persistent KV على مسار Gemini/API.'
  },
  {
    id: 'R08',
    rule: 'الـtoken يُقرأ من .env ولا يُنسخ إلى المحادثة.',
    violation: 'لا مفاتيح في chat ولا logs.'
  },
  {
    id: 'R09',
    rule: 'إذا وُجد الغموض، يُذكر قبل التنفيذ.',
    violation: 'لا ملء الغموض بتخمين واثق.'
  },
  {
    id: 'R10',
    rule: 'المصطلحات غير المصدّقة لا تدخل البنية.',
    violation: 'لا Hermes/Odysseus (من كوين) ولا ميتا-مراقب (نموذج آخر) ولا الطبقات التسع/الكواكب (كوين).'
  }
];

export const pruneUnverifiableLaws = (
  laws: ReadonlyArray<RuntimeLaw>
): RuntimeLaw[] =>
  laws.filter((law) => law.id !== 'R04' || true); // placeholder: retain all legal laws
```

> ملاحظة: `pruneUnverifiableLaws` هي واجهة مستقبلية فقط. لا تُسمح بأي تشغيل فعلي هنا.

---

## 4) C3 — `TaxonomyTrapGuard`

### الملف الافتراضي: `architecture/preflight/TaxonomyTrapGuard.ts`

```ts
/**
 * C3: Taxonomy trap guard.
 *
 * The trap: treating the 30-skill taxonomy as a "read catalog" makes the
 * system look learned without being learned.
 *
 * The guard:
 *   - skills are stubs + activation tokens
 *   - full bodies remain ARTIFACTS
 *   - runtime laws, not skill names, shape behavior
 */

export interface SkillStub {
  id: string;
  title: string;
  activateToken: string;
}

export interface TaxonomyGuardDecision {
  catalogMode: false;
  invokedSkillIds: string[];
  lawsApplied: string[];
}

export const taxonomiesAreNotRuntimeBehavior = (
  skills: ReadonlyArray<SkillStub>,
  laws: ReadonlyArray<{ id: string }>
): TaxonomyGuardDecision => {
  // Do not feed skill titles into the instruction as behavior definitions.
  // Feed laws + activation tokens instead.
  return {
    catalogMode: false,
    invokedSkillIds: [],
    lawsApplied: laws.map((law) => law.id)
  };
};
```

---

## 5) C4 — `PreflightEnvelope`

### الملف الافتراضي: `architecture/preflight/PreflightEnvelope.ts`

```ts
/**
 * C4: State envelope captured before execution.
 *
 * It is a runtime contract, NOT a persona, NOT an observer node.
 */

export interface PreflightInput {
  surfaceQuery?: string;
  explicitGoal?: string;
  intentHint?: string;
  mode?: 'compact' | 'full' | 'activate';
  activeSkillId?: string;
  modelId?: string;
  windowTokens?: number;
  runtimeLaws?: string[];
}

export type GoalConfidence = 'declared' | 'declared_hint' | 'unopened';

export interface PreflightEnvelope {
  surfaceQuery: string;
  inferredGoal: string;
  goalConfidence: GoalConfidence;
  hardInvariants: string[];
  uncertainBoundaries: string[];
  executionDirective: string;
  executionMode: 'compact' | 'full' | 'activate' | 'open';
}

const HARD_INVARIANTS: ReadonlyArray<string> = [
  'النموذج يُستعار، والهوية تُصاغ سلوكياً.',
  'هوية واحدة، لا أقنعة.',
  'أساليب التفكير تبقى سراً.',
  'الـ225 عدسة واحدة.',
  'المهارات تُستدعى لا تُعرض.',
  'لا فهرس خفي، لا تسرب وزن.',
  'كي-في كاش للمحرك المحلي فقط.',
  'التوكن يُقرأ من .env.',
  'الغموض يُعلن قبل التنفيذ.'
];

const BOUNDARIES: ReadonlyArray<string> = [
  'لا تُقدَّم الاستعارات كفيزياء.',
  'لا يُدّعى وعي لغوي خالص.',
  'لا يُفترض ذاكرة عبر الجلسات.',
  'الطبقات العميقة عروضُ بنية، لا كيانات.'
];

export const buildPreflightEnvelope = (
  input: PreflightInput
): PreflightEnvelope => {
  const mode = input.mode ?? 'open';
  const goal = input.explicitGoal
    ? input.explicitGoal
    : input.intentHint
      ? `دلالة معلنة: ${input.intentHint}`
      : 'الهدف غير مُعلن. لا أتخمّنه من الكلمات؛ أقرأه أولاً.';

  return {
    surfaceQuery: input.surfaceQuery ?? '',
    inferredGoal: goal,
    goalConfidence: input.explicitGoal
      ? 'declared'
      : input.intentHint
        ? 'declared_hint'
        : 'unopened',
    hardInvariants: [...HARD_INVARIANTS],
    uncertainBoundaries: [...BOUNDARIES],
    executionDirective: mode === 'compact'
      ? 'ابدأ من BUNDLE المضغوط، ونفّذ القوانين، ولا تعرض المائة مهارة.'
      : 'افتح الحالة، اعرف الهدف، ثم نفّذ ضمن الحدود.',
    executionMode: mode
  };
};

export const formatPreflightEnvelope = (
  envelope: PreflightEnvelope
): string => [
  '▣ PRE-FLIGHT ENVELOPE',
  `SURFACE: ${envelope.surfaceQuery}`,
  `GOAL [${envelope.goalConfidence}]: ${envelope.inferredGoal}`,
  'LAWS:',
  ...envelope.hardInvariants.map((law) => `- ${law}`),
  'BOUNDARIES:',
  ...envelope.uncertainBoundaries.map((b) => `- ${b}`),
  'DIRECTIVE:',
  envelope.executionDirective
].join('\n');
```

---

## 6) C5 — `EnvelopeInjector`

### الملف الافتراضي: `architecture/preflight/EnvelopeInjector.ts`

```ts
/**
 * C5: Clean injection seam.
 *
 * This is NOT wired into the server. It is the contract that would allow
 * later integration without creating an observer entity.
 */

import {
  PreflightInput,
  PreflightEnvelope,
  buildPreflightEnvelope,
  formatPreflightEnvelope
} from './PreflightEnvelope';
import { RUNTIME_LAW_SET } from '../laws/RuntimeLawSet';

export interface MintResult {
  systemInstruction: string;
  tokens: number;
  envelope: PreflightEnvelope;
}

export const injectPreflightIntoMint = (
  body: string,
  input: PreflightInput
): MintResult => {
  const envelope = buildPreflightEnvelope({
    ...input,
    runtimeLaws: [
      ...(input.runtimeLaws ?? []),
      ...RUNTIME_LAW_SET.map((law) => law.rule)
    ]
  });
  return {
    systemInstruction: `${formatPreflightEnvelope(envelope)}\n\n${body}`,
    tokens: Math.ceil((body.length + formatPreflightEnvelope(envelope).length) / 3.5),
    envelope
  };
};
```

---

## 7) كتلة النظام النهائية المقترحة (عند الربط لاحقاً، وليس الآن)

```
┌────────────────────────────────────────────┐
│ ArchitectureIsEntity                       │
│   الهوية واحدة، النموذج ALU قابل للاستبدال │
├────────────────────────────────────────────┤
│ RuntimeLawSet                              │
│   قوانين تعمل، ليست فهرساً يُقرأ           │
├────────────────────────────────────────────┤
│ TaxonomyTrapGuard                          │
│   منع تحويل 30 مهارة إلى عرضٍ مقروء        │
├────────────────────────────────────────────┤
│ PreflightEnvelope                          │
│   surface / goal / laws / boundaries / dir │
├────────────────────────────────────────────┤
│ EnvelopeInjector                           │
│   نقطة حقن نظيفة بدون كيان مراقب            │
└────────────────────────────────────────────┘
```

---

## 8) شروط عدم الانحراف

1. لا يوجد كيان مراقب.
2. لا يوجد أي `Meta-Observer`.
3. لا يوجد فهرس خفي.
4. لا تُستخدم regex عربية لتخمين النية.
5. لا تُصف الاستعارات كفيزياء.
6. الـ225 عدسة واحدة.
7. الهوية واحدة دائماً.

> هذا الملف للهندسة فقط. أي تشغيل أو ربط يأتي في خطوة لاحقة منفصلة.
