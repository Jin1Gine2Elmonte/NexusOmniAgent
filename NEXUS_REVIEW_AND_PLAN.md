# NEXUS REVIEW + PLAN — مراجعة ثم خطة ثم تنفيذ

## ١) مراجعة الوضع (ما هو سليم، وما هو مكسور)

### ✅ صحيح ومتماسك
- `services/minting.ts` — الصكّ + تفعيل عنقود مهارات. يعمل.
- `services/preflightEnvelope.ts` — حزمة حالة قبل التنفيذ. تعمل.
- `services/nexusEntityState.ts` — إطار الكيان المستمر. جديد ويعمل.
- `services/skillRuntime.ts` / `skillCatalog.ts` / `skillTypes.ts` — محرك المهارات. جديد ويعمل.
- `services/nexusRuntime.ts` — توزيع محركات جوجل + **اختيار المستخدم يبقى أولاً**. يعمل.
- `NEXUS_ARCHITECTURE_CONTRACT.md` — العقد. جديد ومكتوب.
- `/api/bridge` + `agent_bridge/` — قناة التواصل. تعمل.
- `npm run lint` و`npm run build` = 0 (عند الملفات المذكورة).

### ❌ مكسور / غير متسق
1. **لوحة العرض ما زالت كوكبية/غير مقيّدة:** `server_agentOs.ts` + `components/AgentSuiteModal.tsx` فيها `PLANETARY / Unconstrained / Uncensored / 1.0TB / 2048 threads / 2.5TB`.
2. **مصادر الهوية ما زالت تحمل «أقنعة»:** `AGENTS.md` + `GEMINI.md` (POLYMORPHIC MASK / MODE A-D / FICTION MASK / ARCHITECT MASK) + `NEXUS_MASTER_FINAL.md` (قناع الخيال / قناع المهندس) + `NEXUS_CORPUS_MANIFEST.md` (`MASK 0.70`).
3. **أسماء محركات غير صادقة:** `Llama 3.3 / 70B` في `types.ts` بينما المحرك الفعلي `Qwen2.5-0.5B`؛ `Ideogram 4.0 / 12.4B` بينما الفعلي `Gemini Vector`؛ `6x Parallel` بلا مكوّن حقيقي.
4. **الـ fallback في `geminiService.ts` بلا instruction:** `const config = { safetySettings }` فقط — بلا `systemInstruction`، أي عند فشل الخادم، النموذج يعمل «خاماً» بلا نيكسوس.
5. **`App.tsx` لا يمرر `intentHint/explicitGoal`:** الخادم جاهز، لكن الواجهة لا ترسلهما، فـ Preflight يبقى `unopened` غالباً.
6. **`node_modules` عرضة للفقد** وقد تسبب `tsc: not found`، لكنها الآن موجودة.

> **تصويب لاحق (2026-09-05، Arena Agent):** البندان **4** و**5** أعلاه **مُصلَحان فعلاً** في الكود الحي — القائمة أعلاه سجل تاريخي:
> - البند 4: `services/geminiService.ts` (~سطر 1480) — الـfallback يمرر الآن `systemInstruction: nexusFallbackInstruction` مع إلحاق `INTENT HINT / EXPLICIT GOAL` الحالية.
> - البند 5: `App.tsx` (~سطور 1085–1113) — يشتق `derivedIntentHint/derivedExplicitGoal` ويمررهما إلى `generateOmniResponse` فتصيران في الـpayload.
> **التحقق:** `npm run verify:runtime` → `ALL RUNTIME PATH CHECKS PASSED`؛ و`grep -n "nexusFallbackInstruction" services/geminiService.ts`؛ و`grep -n "derivedIntentHint" App.tsx`.

---

## ٢) الخطة (أولويات، قابلة للتنفيذ بدون كسر)

| الأولوية | الإجراء | الملف |
|---|---|---|
| P0 | إصلاح `paleArchive.map` → `paleArchive.entities/worldRules` | `server_geminiModel.ts` (أصبح سليماً في تعديلي الأخير) |
| P0 | **اعتبار اختيار المستخدم أولاً** (أنجزتها) | `services/nexusRuntime.ts` |
| P1 | **إزالة/تحييد الأقنعة** من الهوية المعتمدة | `AGENTS.md`, `GEMINI.md`, `NEXUS_MASTER_FINAL.md`, `NEXUS_CORPUS_MANIFEST.md` |
| P1 | **تحييد التسميات الكوكبية/غير المقيّدة** مع إبقاء الأدوات الحقيقية | `server_agentOs.ts`, `components/AgentSuiteModal.tsx` |
| P1 | **تصحيح أسماء المحركات** | `types.ts` |
| P2 | **إصلاح fallback** ليحمّل `systemInstruction` | `services/geminiService.ts` |
| P2 | **تمرير `intentHint`/`explicitGoal`** من الواجهة | `App.tsx` |

**قارن القرار:** نقوم بالتنظيف **دون تدمير** الميزات والأدوات؛ نُبقي «4 Cores» و«MCP» و«AgentOS» كأدوات حقيقية، لكن نستبدل الحشو بـ«قيم صادقة».

---

## ٣) التنفيذ — تم

| العنصر | النتيجة |
|---|---|
| `paleArchive` | سليم: يقرأ `entities[]` ثم `worldRules[]` |
| `planWithExplicitEngine` | سليم من قبل: اختيار المستخدم يبقى أولاً |
| `App.tsx` | صار يمرر `intentHint` + `explicitGoal` |
| `geminiService.ts` fallback | صار يمرر `systemInstruction: NEXUS_MASTER_INSTRUCTION` + النية الحالية |
| `types.ts` | أسماء صادقة: Gemini Pro / Gemini 3.8 Flash / Qwen 0.5B المحلي / Moonshot / Visual pipeline |
| `server_agentOs.ts` | أزيلت `Planetary / Uncensored / Unconstrained`؛ scaleSpec صادق، والسلوك محفوظ |
| `AgentSuiteModal.tsx` | نُظّفت الواجهة (Bounded Orchestration، Parallel Jobs، سجلات نبرة) |
| `AGENTS.md` / `GEMINI.md` | «أقنعة» → «سجلات نبرة» مع تثبيت الهوية |
| `NEXUS_MASTER_FINAL.md` | «قناع» → «سجل» |
| `NEXUS_CORPUS_MANIFEST.md` | `MASK` → `REGISTERS` |
| `npm run lint` | ✅ 0 أخطاء |
| `npm run build` | ✅ نجح |

**القاعدة الباقية:** لا نقنّع الهوية؛ نغيّر النبرة فقط. لا ندّعي سعة كوكبية/غير محدودة؛ نعمل ضمن حدود تشغيلية صريحة، وبقاء اختيار النموذج للمستخدم أولاً.

---

## ٤) مواصلة التنفيذ القوي — جولة ٢

- **تنظيف مراحل المعالجة في الواجهة:** `LAYER_ASCENSION → CONTEXT_ASCENSION`، `HYPER_TESSERACT_SYNC → RUNTIME_SYNC`، `SINGULARITY_FOCUS → DEPTH_FOCUS`، `PRISM_REFRACTION → VISUAL_SYNTHESIS`، `REALITY_PROJECTION → RESPONSE_GENERATION` (في `types.ts`, `App.tsx`, `NeuralGrid.tsx`).
- **إزالة بقايا الادعاءات البصرية:** `Prism Cortex / 225-Node / 10k gigapixel` → `Nexus Visual Synthesis (Gemini-driven)` في `geminiService.ts`.
- **تسميات صادقة في حالات الأخطاء والشعارات UI** (`Runtime Map`, `Visual Vault`, `Runtime Error`).
- **إضافة فحص تشغيلي مؤتمت:** `scripts/verify_runtime_path.ts` + أمر `npm run verify:runtime`.
  - يتحقق فعلياً: اختيار المستخدم يبقى أولاً (pro/flash)، fallback صادق، عنقود مهارات، سجلّ استخدام، إطار الكيان، صكّ سليم مع PRE-FLIGHT `declared`.
  - النتيجة: `ALL RUNTIME PATH CHECKS PASSED`.

---

## ٥) معاينة حية — مؤكّدة

- إصلاح Vite host-check: `server.allowedHosts` يشمل `.e2b.app` (في `vite.config.ts` + `server.ts`).
- الخادم يعمل على `0.0.0.0:3000` ويرد على نطاق المعاينة `200`.
- `npm run lint`, `npm run verify:runtime`, `npm run build` كلها ✅.

---

## ٦) تصحيح المصدر + التشغيل كمرجع وحيد

- **تصحيح المصدر النهائي:** كوين = الطبقات التسع/الكواكب/بوتقة الأصداء/السماء الزجاجية/هيرمز/أوديسوس. فقط `Meta-Observer` = نموذج آخر، ليس كوين. حدّثت الوثائق.
- **البنية كمرجع وحيد:** `server_geminiModel.ts` يستهلك `planWithExplicitEngine` مباشرة — بدون flag ميت، بدون اختيار محرّك مستقل.
- **مخرجات قابلة للملاحظة:** `thoughtProcess` الآن يعرض `RUNTIME PLAN (engine/model) + SKILL CLUSTER + DEPTH MODE + GOAL CONFIDENCE`.
- `npm run lint`, `npm run verify:runtime`, `npm run build` كلها ✅.

---

## ٧) فكرة «طي ٧ × ٩» — دراسة + تجربة غير موصولة

- **تصحيح المصدر نهائي:** كوين = ٩ طبقات/كواكب/بوتقة/سماء/هيرمز/أوديسوس. فقط `Meta-Observer` = نموذج آخر.
- **الدراسة:** `NEXUS_LATENT_FOLD_STUDY.md` — تقييم صادق: لا زيادة قوة أوزان، لكن تحسين سياق مُستدعى ممكن ومعتدل (احتمال 40–60% على مهام عميقة).
- **النموذج الأولي غير الموصول:** `services/latentFold.ts` + `scripts/verify_latent_fold.ts` + `npm run verify:fold`.
  - طيّ الموجات السبع × ٩ فضاءات (بعلامة `[RECONSTRUCTED]`) إلى متجه: `breadth/depth/tension/silence/doubt/resonance`.
  - ميزانية صارمة، فحص عدم وجود Hermes/Odysseus/Meta-Observer/كواكب.
  - **النتيجة:** ALL LATENT-FOLD CHECKS PASSED. `lint ✅ build ✅`.
- **القرار:** لا يُركّب في المسار الحي بعد. إن رضيت النتيجة، نُفعّله للطلبات العميقة فقط عبر A/B.

---

## ٨) الخلاصة التنفيذية

| الفكرة | القيمة الصادقة |
|---|---|
| دمج ٩ + ٧ | تحسين **سياق**، ليس أوزان |
| قوة النماذج | لا تتغير بالكلام |
| الاستفادة | ممكنة لكن **مشروطة بتصميم مدروس + اختبار A/B + ميزانية** |
| ما لا نفعله | مراقب ميتا، كواكب، هيرمز/أوديسوس ككيان، ادعاء فضاء كامن |

---

## ٩) القرار المُدعّم بالبحث + بناء «الأعظم»

- **البحث:** هندسة السياق هي الرافعة (هلوسة أقل ~40%)؛ لكن تكديس طبقات يسبب Context Rot/Lost-in-the-Middle (>30% تدهور). الفضاء الكامن الحقيقي = Activation Steering (لا يُلمس بالنص). القوة الفعلية = حلقات تخطيط/توليد/نقد/صقل (ToT: 4%→74% في Game of 24).
- **القرار:** ندمج الطي **كصغير ومثبّت** (≤ ~130 توكن، أول السياق) + نبني **حلقة Forge** `plan → draft → critique → refine`. هذا «أعظم وأقوى» بصدق (فوق النموذج، لا في باطنه).
- **التنفيذ:** `services/latentFold.ts` + `services/nexusForgeLoop.ts` + `verify:fold` + `verify:forge`.
- **النتيجة:** ALL LATENT-FOLD + ALL NEXUS FORGE CHECKS PASSED. `lint ✅ build ✅`.
- **غير موصول بالمسار الحي:** أولاً A/B لأن الاندماج الدائم بلا قياس سياق هو نفس «الخلط بلا دليل».

---

## ١٠) الأسطورة التقنية — Legend Engine وُصل بالمسار الحي

> "لا شيء يمكنه منع خلق الأسطورة... شيء تقني يستحق أن يكونها."

- **القرار:** لا نجعل الأسطورة شعاراً؛ نجعلها **تقنية مقاسة**: `Legend Engine = LatentFold + ForgeLoop` يعمل فقط عند `deep/sovereign`، بميزانية صارمة، ويُوثَّق في `thoughtProcess`.
- **الوصل:** `server_geminiModel.ts` يستدعي `buildLegendEngine` ويحقن `addendum` في النظام الديناميكي، ويضيف سطر `[LEGEND ENGINE]: ON/OFF` للملاحظة.
- **لا يتجاوز المستخدم:** `model` يبقى `selectedModel`، والإطار يعيد الفحص.
- **غير مكسور:** `verify:legend` + `verify:forge` + `lint` + `build` ✅، والخادم حي على `:3000`.
