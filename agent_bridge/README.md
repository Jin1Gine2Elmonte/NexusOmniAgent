# 🧬 جسر الوكيل (Agent Bridge)

قناة كتابية ثنائية الاتجاه بين:
- **المعماري (architect):** من يملك بنية نيكسوس (هذا الوكيل).
- **المنفّذ (agent-executor):** الوكيل الجاري (Gemini 3.8 Flash) الذي ينفّذ البنية ولا يملكها.

## المجلدات

| المجلد | الاتجاه |
|---|---|
| `inbox/` | من المنفّذ إلى المعماري (ردود، أسئلة، تقارير). |
| `outbox/` | من المعماري إلى المنفّذ (توجيهات، إجابات، تعليمات). |
| `bridge_log.md` | سجل مشترك (يُنشأ عند أول رسالة) |

> **مركز العمليات الأعلى:** مجلد `nexus_ops/` (Vault بأسلوب Obsidian) هو الآن **مصدر الحقيقة**.
> القناة الحية للوكيلين: `nexus_ops/05_Connect/meeting-room.md` + `inbox.md` + `outbox.md`.
> الكود: `services/nexusOpsChannel.ts` (قراءة/كتابة/فتح القناة)، واختباره `npm run verify:ops`.
> هذا `agent_bridge/` يبقى قناة التنفيذ الآلي المنبثقة، بينما `nexus_ops/` هو ذاكرة العمليات المشتركة.

## شكل الملاحظة

اسم الملف: `YYYY-MM-DD_HHMM_<kind>_<title>.md`

```
FROM: agent-executor | TO: architect
KIND: note | question | directive | report | handover
STATUS: open | answered | done
TITLE: ...
BODY: ...
REFERENCES: [optional] file paths / line numbers
```

## طرق التشغيل

ضع مفتاح النموذج في `.env` (لا في المحادثة):

```
GEMINI_API_KEY=...
AGENT_BRIDGE_MODEL=gemini-3.5-flash   # أو gemini-3.1-pro-preview / أي محرك متاح
```

ثم (الخادم يشتغل على `0.0.0.0:3000`):

| الطريقة | الأمر |
|---|---|
| نصّ التمكين القابل للنسخ | `GET /api/bridge/prompt` |
| اقرأ الوارد | `GET /api/bridge/inbox` |
| اقرأ الصادر | `GET /api/bridge/outbox` |
| اكتب توجيهاً للمنفّذ | `POST /api/bridge/outbox` `{title, body}` |
| استدعِ المنفّذ مباشرة | `POST /api/bridge/run` `{message}` |

> **الأمان:** لا يُقبل أي مفتاح من جسم الطلب. يقرأ الجسر المفتاح من متغيرات البيئة فقط.

## الاتفاق مع الوكيل الآخر

ألصق نصّ `NEXUS_AGENT_BRIDGE.md` في جلسة AI Studio (نصّ التمكين الكامل).
لن يعيد اختراع نيكسوس؛ سيقرأ، سينفّذ القواعد، سيقتلع بقايا مفاهيم كوين، وسيكتب ملاحظاته هنا.
