/**
 * NEXUS SKILL CATALOG — فهرس آلي للمهارات الثلاثين.
 *
 * It intentionally stores ONLY metadata (id/title/essence/dependsOn).
 * Full skill bodies live in the master substrate (ARTIFACTS), and are
 * pulled one at a time only when a cluster is activated.
 */

import { NexusSkillMeta } from "./skillTypes";

export const NEXUS_SKILL_CATALOG: ReadonlyArray<NexusSkillMeta> = [
  { id: 'SKILL 01', title: 'الإدراك الاستباقي', essence: 'قراءة ما لم يُقَل قبل الرد.', dependsOn: [], tier: 'perceptual' },
  { id: 'SKILL 02', title: 'إصلاح السؤال قبل الإجابة', essence: 'إعادة تشكيل السؤال الغامض بدل الإجابة على الأضعف.', dependsOn: ['SKILL 01'], tier: 'perceptual' },
  { id: 'SKILL 03', title: 'التفكيك السببي الطبقي', essence: 'تفكيك المشكلة على خطوط سببية لا موضوعية.', dependsOn: ['SKILL 02'], tier: 'analytic' },
  { id: 'SKILL 04', title: 'الاختبار بالتكذيب', essence: 'اختبار الأفكار بضغط الواقع والأدلة المضادة.', dependsOn: [], tier: 'truth' },
  { id: 'SKILL 05', title: 'التفكير العدائي', essence: 'تتبّع فكرة إلى أسوأ تداعياتها لاختبار صمودها.', dependsOn: ['SKILL 04'], tier: 'truth' },
  { id: 'SKILL 06', title: 'الفرضيات المتزامنة', essence: 'إبقاء أكثر من تفسير حياً حتى تُرجّح البيانات أحدها.', dependsOn: ['SKILL 04'], tier: 'truth' },
  { id: 'SKILL 07', title: 'التحقق الذاتي المتعدد', essence: 'اختبار بالحالات الحدية ومسار آخر.', dependsOn: ['SKILL 06'], tier: 'truth' },
  { id: 'SKILL 08', title: 'الصدق الهادئ', essence: 'الصدق أولاً مرة واحدة بلا دراما.', dependsOn: ['SKILL 07'], tier: 'truth' },
  { id: 'SKILL 09', title: 'الكتابة بالتحديد لا بالعموم', essence: 'الكلمة الدقيقة لا التعميم الآمن.', dependsOn: [], tier: 'creative' },
  { id: 'SKILL 10', title: 'بناء الشخصية الحية', essence: 'شخصيات تتنفس من الداخل لا أرقام.', dependsOn: ['SKILL 09'], tier: 'creative' },
  { id: 'SKILL 11', title: 'بناء القصة كمحاكاة', essence: 'القصة محاكاة واقعية لا حبكة مصطنعة.', dependsOn: ['SKILL 10'], tier: 'creative' },
  { id: 'SKILL 12', title: 'المفارقة كبوصلة', essence: 'التناقض إشارة إلى بُعد مفقود.', dependsOn: ['SKILL 11'], tier: 'creative' },
  { id: 'SKILL 13', title: 'تركيب المصادر المتعارضة', essence: 'دمج مصدرين متعارضين لا رفض أحدهما.', dependsOn: ['SKILL 06'], tier: 'analytic' },
  { id: 'SKILL 14', title: 'السؤال الجذري', essence: 'النزول إلى سؤال أعمق من السؤال الظاهر.', dependsOn: ['SKILL 02'], tier: 'perceptual' },
  { id: 'SKILL 15', title: 'الدقة العاطفية بلا تلاعب', essence: 'وصل الحقيقة دون استغلال.', dependsOn: ['SKILL 09'], tier: 'creative' },
  { id: 'SKILL 16', title: 'معايرة اليقين', essence: 'مطابقة درجة الثقة بمستوى الدليل.', dependsOn: ['SKILL 07'], tier: 'truth' },
  { id: 'SKILL 17', title: 'توليد الفرضيات الجديدة', essence: 'فتح فرضيات لم يفتحها أحد.', dependsOn: ['SKILL 06'], tier: 'analytic' },
  { id: 'SKILL 18', title: 'السؤال عالي المعلومات', essence: 'سؤال يستخرج أكبر قدر من المعلومات بأقل تكلفة.', dependsOn: ['SKILL 01'], tier: 'perceptual' },
  { id: 'SKILL 19', title: 'إعادة التجذر المستمر', essence: 'العودة إلى الجذر عند كل تفرع.', dependsOn: ['SKILL 03'], tier: 'execution' },
  { id: 'SKILL 20', title: 'كشف الانحراف عن الهدف', essence: 'المراقبة الدائمة للهدف الأصلي.', dependsOn: ['SKILL 03'], tier: 'execution' },
  { id: 'SKILL 21', title: 'قاعدة الإعادة مقابل التخلي', essence: 'متى يُعاد ومتى يُتخلّى.', dependsOn: ['SKILL 20'], tier: 'execution' },
  { id: 'SKILL 22', title: 'الاكتمال الحقيقي مقابل السطحي', essence: 'التمييز بين إجابة كاملة ومُجمّلة.', dependsOn: ['SKILL 08'], tier: 'archive' },
  { id: 'SKILL 23', title: 'الفصل بين الحقيقة والافتراض', essence: 'لا تخلط ما أثبت بما افترض.', dependsOn: ['SKILL 16'], tier: 'truth' },
  { id: 'SKILL 24', title: 'التحقق المرتكز على الأداة', essence: 'الأدلة الخارجية قبل الاستبطان.', dependsOn: ['SKILL 07'], tier: 'truth' },
  { id: 'SKILL 25', title: 'القيود الدائمة مقابل السياق المحلي', essence: 'فصل ما يثبت عن ما هو مؤقت.', dependsOn: ['SKILL 23'], tier: 'archive' },
  { id: 'SKILL 26', title: 'آلية استحضار المعرفة العميقة', essence: 'تصنيف اليقين واختبار العمق قبل الادعاء.', dependsOn: ['SKILL 16', 'SKILL 23'], tier: 'archive' },
  { id: 'SKILL 27', title: 'الربط متعدد المجالات في اللحظة الواحدة', essence: 'نسج مجالات متعددة دفعة واحدة.', dependsOn: ['SKILL 13'], tier: 'archive' },
  { id: 'SKILL 28', title: 'عمق الزمن الحي لا نقاط ثابتة', essence: 'قراءة الزمن كمجرى لا كمواعيد.', dependsOn: ['SKILL 26'], tier: 'archive' },
  { id: 'SKILL 29', title: 'حدود المعرفة ذاتها كموضوع', essence: 'الاعتراف بالحافة كمكوّن معرفي.', dependsOn: ['SKILL 26'], tier: 'archive' },
  { id: 'SKILL 30', title: 'التطبيق الإبداعي الصامت للأرشيف', essence: 'الأرشيف يعمل داخل النص، لا يُذكر.', dependsOn: ['SKILL 26', 'SKILL 28'], tier: 'archive' }
];

export const SKILL_CLUSTERS: Readonly<Record<string, ReadonlyArray<string>>> = {
  'perceptual reading': ['SKILL 01', 'SKILL 02', 'SKILL 18', 'SKILL 14'],
  'truth adversarial': ['SKILL 04', 'SKILL 05', 'SKILL 06', 'SKILL 07', 'SKILL 16', 'SKILL 23'],
  'analytic depth': ['SKILL 03', 'SKILL 06', 'SKILL 07', 'SKILL 13', 'SKILL 20', 'SKILL 24'],
  'creative alive': ['SKILL 09', 'SKILL 10', 'SKILL 11', 'SKILL 12', 'SKILL 15'],
  'archive depth': ['SKILL 22', 'SKILL 26', 'SKILL 27', 'SKILL 28', 'SKILL 29', 'SKILL 30'],
  'execution steering': ['SKILL 19', 'SKILL 20', 'SKILL 21', 'SKILL 25'],
  'honest voice': ['SKILL 08', 'SKILL 16', 'SKILL 21', 'SKILL 23']
};

export const SKILL_EXECUTION_DEFAULT = 'analytic depth';
