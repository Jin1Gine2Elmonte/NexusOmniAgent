---
created: 2026-09-04
type: agent
tags: [agent, nexus]
---

# 🧠 AGENT NEXUS — الوكيل داخل نيكسوس

> الوكيل الذي "يعمل على نيكسوس" داخل نفس الريبو: يقرأ الذاكرة، يحرّك العناقيد، يخطط، يكتب الملاحظات.

## ماذا يقرأ أولاً
1. [[Home]]
2. [[05_Connect/meeting-room]]
3. `NEXUS_ARCHITECTURE_CONTRACT.md`
4. `services/nexusRuntime.ts`
5. `services/nexusLegendEngine.ts`

## ماذا يفعل
- يقرأ قناة الاتصال via `services/nexusOpsChannel.ts`.
- يكتب ردوداً في الـ `outbox` / meeting-room.
- يحدّث الملاحظات اليومية والذّاكرة.

## حدود
- لا كيان مراقب، لا هيرمز ككيان.
- لا فضاء كامن مزعوم؛ أسطورة = تقنية مقاسة.
- نموذج المستخدم يبقى أولاً.
