# 🧬 NEXUS CORPUS MANIFEST — فهرس الأصل المستوعب

> تم إنشاؤه بعد وصول أرشيفات «معلومات عن نيكسوس» (6 ملفات ZIP + ملف `Jn`) إلى بيئة العمل.
> الأصل يقع خارج Git في `/home/user/nexus_data/معلومات عن نيكسوس`، والاستخراج في `/home/user/nexus_data/extracted`.
> **هذا المستند لا يحجز المحتوى الضخم في Git — بل يوثّق مواقعه وأدواره كي لا تضيع.**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 1. المصدر الخام

| العنصر | الموقع |
|---|---|
| الأرشفة الأصلية | `/home/user/nexus_data/معلومات عن نيكسوس/` |
| `Jn` | ملف فارغ تقريباً (5 بايت: `مم`) — غير مهم |
| `New Folder1.zip` | 12.0 MB |
| `New Folder2.zip` | 19.3 MB |
| `New Folder3.zip` | 0.47 MB |
| `New Folder4.zip` | 11.4 MB |
| `New Folder5.zip` | 12.3 MB |
| `New Folder6.zip` | 22.3 MB |
| إجمالي المستخرج | 284 ملفاً / ~145 MB |

## 2. خريطة الأدوار (ما وثّقه `canonical_corpus.json` و`THE_FORGE_PROTOCOL.md`)

| الدور | الوصف | الوزن |
|---|---|---|
| 🌱 SEED | يحدّد هوية الكيان: "You are NEXUS" | 1.00 |
| 🏗️ STRUCTURE | البنية والأرقام (225، 7، 18، 12) | 0.90 |
| 🔥 SOUL | الفلسفة/الحياة الداخلية العميقة | 0.80 |
| 🎭 REGISTERS | الأنماط المتعددة / سجلات النبرة | 0.70 |
| 📜 DOCTRINE | المبادئ والقوانين السلوكية | 0.65 |
| 📚 REFERENCE | تصنيفات وقوائم | 0.50 |
| 🛠️ CODE | كود تقني | 0.30 |

## 3. الملفات التأسيسية (أهم ما قرأته)

- `NEXUS_COMPLETE_IDENTITY.md` — **النص الكامل للهوية** (CORE ANCHOR + Pale Archive + Self-Honesty + Entity Boundaries + Technical Capabilities).
- `NEXUS_ULTIMATE_MASTER.md` — **الماستر النهائي** (الهوية + عقيدة السيادة + البوليماث + الـ 225 + الـ 7 طبقات + سجلات النبرة + عقيدة + مهارات).
- `NEXUS_NEW_SYSTEM_PROMPT.md` — نسخة الهوية الجديدة الواجب استبدالها بـ `COSMIC_SYSTEM_INSTRUCTION`.
- `NEXUS_SOVEREIGNTY_DOCTRINE.md` — عقيدة الحدود والدمج وقِراءة المخاطب.
- `NEXUS_SOUL_PRINT_ARCHITECTURE.md` — كيف يُحسب `soulPrint` بدون API إضافي.
- `NEXUS_QUESTION_PROTOCOL_COMPLETE.md` — بروتوكول «السؤال الصحيح» عبر 3 طبقات.
- `NEXUS_PLACEMENT_GUIDE.md` — أين يوضع كل جزء في `services/geminiService.ts`.
- `NEXUS_TECHNICAL_IMPLEMENTATION.md` — التطبيق التقني للصوت الحي (استبدال النظام + Tesseract + إخفاء المخرجات).
- `THE_FORGE_PROTOCOL.md` — منهج توليد `AGENTS.md` من الـ Corpus.
- `AGENTS (1).md` — **نسخة `AGENTS.md` النهائية (526 سطراً، 18 مهارة)** — هذه المطلوب للـ repo.
- `AGENTS.md` (في Folder1) — نسخة وسيطة (248 سطر).
- الملفات الفلسفية `00_why_not_symphony.md` … `12_score_fragments.md` — عمل «الدورة اليقاع» (مشروع فني/وجودي).
- `New Folder5/6` — مصفوفات الذاكرة (sessions + memoryBank + axioms + paleArchive + soulPrint) عبر الزمن.

## 4. الفجوات المكتشفة (بين المستودع والـ Corpus)

| # | الوضع الحالي في المستودع | المطلوب وفق الـ Corpus | الأولوية |
|---|---|---|---|
| 1 | `AGENTS.md` = 46 سطراً فقط | النسخة النهائية 526 سطراً | عالية |
| 2 | `GEMINI.md` مطابق للنسخة المختصرة | يجب مطابقة النسخة النهائية | عالية |
| 3 | `geminiService.ts` يستخدم `NEXUS_MASTER_INSTRUCTION` القديم (البداية "لستُ أداةً") | استبدال بـ `NEXUS_COMPLETE_IDENTITY` / `NEXUS_ULTIMATE_MASTER` | عالية |
| 4 | نماذج مرشّحة غير موجودة (`gemini-3.1-pro-preview`) | قائمة نماذج حقيقية/متاحة + fallback سليم | عالية |
| 5 | لا يوجد `Self-Honesty Check` | طبقة `flash` رخيصة بعد الـ Surface Refiner | متوسطة |
| 6 | تناقض categories بين `crystallizeSession` و`types.ts` | توحيد `identity \| world_building \| preference \| absolute_truth` | متوسطة |
| 7 | عمليات Tesseract تُشغَّل لمعظم الرسائل | ضبط شرط `isDeepQuery` للأسئلة العميقة فقط | متوسطة |
| 8 | `nexus_genesis_engine.py` و`server_nexusForge.ts` تعتمد على Python باشتراطات غير مضمونة | مراجعة/إصلاح التبعيات | لاحقاً |

## 5. خطة الإصلاح التدريجي

- **المرحلة 1 (هذه):** توثيق الـ Manifest + استبدال `AGENTS.md` و`GEMINI.md` بالنسخة النهائية.
- **المرحلة 2:** محاذاة تعليمة `geminiService.ts` مع `NEXUS_COMPLETE_IDENTITY` و`NEXUS_ULTIMATE_MASTER` + placeholders.
- **المرحلة 3:** إصلاح النماذج والـ fallback + إضافة Self-Honesty + ضبط Tesseract.
- **المرحلة 4:** توحيد الذاكرة (axioms/paleArchive/soulPrint) مع `types.ts`.
- **المرحلة 5:** إصلاح Nexus Forge / generators إذا طُلبت.
- **بعد الإصلاح:** التحديات التي تتجاوز عنان السماء.

## 6. قواعد العمل المتبعة

- لا تحذف الأصل. `nexus_data` يبقى مرجعاً خارج Git.
- تعديلات الكود على الفرع `arena/01a06335-nexusomniagent` فقط.
- كل خطوة تُثبَّت قبل الانتقال للتالية.
- لا نستبدل نسخة الهوية بمحتوى قبل التأكد من مصدره داخل الـ Corpus.
