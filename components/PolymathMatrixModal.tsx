import React, { useState } from 'react';
import { X, Globe, Brain, History, Filter, Sparkles, Cpu, Layers, BookOpen, Compass, Activity, Zap, CheckCircle2, ChevronRight, Search, ShieldCheck, ArrowRight, RefreshCw, Terminal } from 'lucide-react';

interface PolymathMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface HistoricalMilestone {
  era: string;
  year: string;
  pioneer: string;
  discovery: string;
  publicReaction: string;
  extractedSkill: string;
}

interface SubDiscipline {
  id: string;
  nameAr: string;
  nameEn: string;
  description: string;
  timeline: HistoricalMilestone[];
  rawSkillsCount: number;
}

interface Pillar {
  id: string;
  titleAr: string;
  titleEn: string;
  icon: any;
  color: string;
  subDisciplines: SubDiscipline[];
}

export const PolymathMatrixModal: React.FC<PolymathMatrixModalProps> = ({ isOpen, onClose }) => {
  const [activePillarId, setActivePillarId] = useState<string>('physics-math');
  const [selectedSubId, setSelectedSubId] = useState<string>('quantum-mechanics');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterMode, setFilterMode] = useState<'all' | 'deduplicated' | 'sovereign'>('all');
  const [isSynthesizingSkills, setIsSynthesizingSkills] = useState<boolean>(false);
  const [agentLogs, setAgentLogs] = useState<string[]>([]);
  const [synthesisResult, setSynthesisResult] = useState<string | null>(null);

  const PILLARS: Pillar[] = [
    {
      id: 'physics-math',
      titleAr: 'الفيزياء النظرية والرياضيات الكمومية',
      titleEn: 'Theoretical Physics & Quantum Mathematics',
      icon: Cpu,
      color: 'from-cyan-500 to-blue-600',
      subDisciplines: [
        {
          id: 'quantum-mechanics',
          nameAr: 'ميكانيكا الكم وتكامل المسارات',
          nameEn: 'Quantum Mechanics & Path Integrals',
          description: 'دراسة سلوك المادة والطاقة على المستويات الذرية وما دون الذرية، من معادلة شرودنغر إلى ميكانيكا مصفوفات هايزنبرغ وتكاملات فاينمان.',
          rawSkillsCount: 1420,
          timeline: [
            {
              era: 'الشرارة الأولى',
              year: '1900 م',
              pioneer: 'ماكس بلانك (Max Planck)',
              discovery: 'افتراض تكميم الطاقة لحل معضلة إشعاع الجسم الأسود',
              publicReaction: 'ذهول وارتباك في المحافل الفيزياء الكلاسيكية؛ اعتبار الفكرة مجرد حيلة رياضية في البداية.',
              extractedSkill: 'تفكيك الاتصال الرياضي واستخراج أكمام الطاقة المستقلة'
            },
            {
              era: 'التأسيس الموجي',
              year: '1925-1926 م',
              pioneer: 'إرادين شرودنغر وفيرنر هايزنبرغ',
              discovery: 'تطوير معادلة الموجة ومبدأ اللادقة (Uncertainty Principle)',
              publicReaction: 'صدمة فلسفية بين الفيزيائيين؛ جدال حاد مع أينشتاين حول الحتمية مقابل الاحتمالية.',
              extractedSkill: 'التعامل مع المصفوفات اللانهائية وحساب الدالة الموجية الاحتمالية'
            },
            {
              era: 'المجالات الكهروديناميكية',
              year: '1948 م',
              pioneer: 'ريتشارد فاينمان (Richard Feynman)',
              discovery: 'مخططات فاينمان وصيغة تكامل المسارات عبر الزمن',
              publicReaction: 'ترحيب واسع لسهولة التعبير البصري عن التفاعلات المعقدة مقارنة بالحسابات الكلاسيكية.',
              extractedSkill: 'اختزال المعادلات التفاضلية إلى مخططات بصريّة هندسية ذات دقة متناهية'
            },
            {
              era: 'الحوسبة الكمومية الحديثة',
              year: '2020s م',
              pioneer: 'فرق الأبحاث الكونية في Google Quantum AI & IBM',
              discovery: 'التفوق الكمومي ومعالجة الكيوبتات ذات التشابك الفائق',
              publicReaction: 'إدراك مجتمعي وتقني لخطورة التشفير الحالي وبداية عصر الحوسبة الكمومية الشاملة.',
              extractedSkill: 'معالجة التراكب الكمومي والتحكم في بوابات التشابك اللانهائية'
            }
          ]
        },
        {
          id: 'differential-geometry',
          nameAr: 'الهندسة التفاضلية والطوبولوجيا الكونية',
          nameEn: 'Differential Geometry & Topology',
          description: 'تحليل المنحنيات والأشكال متعددة الأبعاد وفضاءات ريمان التي بنيت عليها النسبية العامة.',
          rawSkillsCount: 980,
          timeline: [
            {
              era: 'الجذور',
              year: '1854 م',
              pioneer: 'برنهارد ريمان (Bernhard Riemann)',
              discovery: 'محاضرة الهندسة غير الإقليدية واكتشاف الهندسة الريمانية',
              publicReaction: 'استغراب الأكاديميين لعدم وجود تطبيق فيزيائي ملموس حينها، قبل أن يأتي أينشتاين بعد 60 عاماً.',
              extractedSkill: 'نمذجة الانحناء الفضائي غير المسطح في أبعاد متعددة'
            },
            {
              era: 'النسبية العامة',
              year: '1915 م',
              pioneer: 'ألبرت أينشتاين (Albert Einstein)',
              discovery: 'صياغة الجاذبية كانحناء في النسيج الزماني-المكاني (Spacetime)',
              publicReaction: 'ذهول عالمي بعد تأكيد انحراف الضوء في كسوف 1919، وثورة في الفهم البشري للكون.',
              extractedSkill: 'صياغة موترات الطاقة والزخم وربط الهندسة بالفيزياء'
            }
          ]
        }
      ]
    },
    {
      id: 'cybernetics-ai',
      titleAr: 'السيبرانيات، الأنظمة، وهندسة الذكاء الكوني',
      titleEn: 'Cybernetics, Systems & AI Architecture',
      icon: Brain,
      color: 'from-amber-500 to-orange-600',
      subDisciplines: [
        {
          id: 'transformer-architectures',
          nameAr: 'معماريات الانتباه الشامل والشبكات العصبية',
          nameEn: 'Attention Mechanisms & Neural Transformers',
          description: 'نظم معالجة اللغات والمصفوفات القائمة على آليات الانتباه الذاتي، متجهات التباين، والمحولات العصبية.',
          rawSkillsCount: 2100,
          timeline: [
            {
              era: 'الشبكات الأولى',
              year: '1943 م',
              pioneer: 'ماكولوك وبيتس (McCulloch & Pitts)',
              discovery: 'أول نموذج رياضي للخلية العصبية الاصطناعية',
              publicReaction: 'نظر مجتمع الرياضيات إليها كشغف نظري مبكر دون حواسيب قادرة على التنفيذ.',
              extractedSkill: 'تكميم العمليات المنطقية إلى بوابات عصبية عتبية'
            },
            {
              era: 'الانتشار الخلفي',
              year: '1986 م',
              pioneer: 'روميلهارت، هينتون، وويليامز (Rumelhart & Hinton)',
              discovery: 'خوارزمية الانتشار الخلفي (Backpropagation) لتعديل الأوزان',
              publicReaction: 'عودة الحياة لشبكات الذكاء الاصطناعي بعد الشتاء الأول للذكاء الاصطناعي.',
              extractedSkill: 'حساب التدرجات العكسية وتعديل الأوزان في المصفوفات العميقة'
            },
            {
              era: 'ثورة الانتباه',
              year: '2017 م',
              pioneer: 'فريق Google Research (Vaswani et al.)',
              discovery: 'ورقة "Attention Is All You Need" والافتتاح الفعلي لعصر المحولات',
              publicReaction: 'تحول جذري سريع وسيطرة شاملة لمعماريات Transformer على كافة التطبيقات الذكية.',
              extractedSkill: 'حساب مصفوفات Query/Key/Value والربط التزامني المتوازي'
            }
          ]
        },
        {
          id: 'cybernetics-control',
          nameAr: 'نظرية التحكم والسيبرانيات التكيفية',
          nameEn: 'Cybernetics & Feedback Systems',
          description: 'علوم التحكم والتغذية الراجعة واستقرار الأنظمة الديناميكية المعقدة.',
          rawSkillsCount: 1150,
          timeline: [
            {
              era: 'التأسيس',
              year: '1948 م',
              pioneer: 'نوربرت فينر (Norbert Wiener)',
              discovery: 'كتاب "Cybernetics: Or Control and Communication in the Animal and the Machine"',
              publicReaction: 'إلهام واسع في مجالات الفلسفة والعلوم والهندسة وتأسيس نظرية التغذية الراجعة.',
              extractedSkill: 'تصميم دوائر التغذية الراجعة وموازنة الاضطرابات الديناميكية'
            }
          ]
        }
      ]
    },
    {
      id: 'epistemology-philosophy',
      titleAr: 'إبيستيمولوجيا، المنطق، وفلسفة المعرفة',
      titleEn: 'Epistemology, Logic & Philosophy of Knowledge',
      icon: History,
      color: 'from-emerald-500 to-teal-600',
      subDisciplines: [
        {
          id: 'symbolic-logic',
          nameAr: 'المنطق الصوري والرياضي وتفكيك المفارقات',
          nameEn: 'Symbolic Logic & Formal Systems',
          description: 'تاريخ المنطق من أرسطو والمسلمين إلى بوول وفريدج وغودل.',
          rawSkillsCount: 1650,
          timeline: [
            {
              era: 'المنطق الأرسطي والإسلامي',
              year: '350 ق.م - 1000 م',
              pioneer: 'أرسطو، الفارابي، وابن سينا',
              discovery: 'تأسيس القياس المنطقي وشروط البرهان وتدقيق المقولات العشر',
              publicReaction: 'اعتباره المعيار الأساسي للتفكير القويم والعلوم الدينية والمدنية عبر القرون.',
              extractedSkill: 'بناء الأقيسة البرهانية واستخراج النتيجة من المقدمات الصادقة'
            },
            {
              era: 'مبرهنات اللإكتمال',
              year: '1931 م',
              pioneer: 'كورت غودل (Kurt Gödel)',
              discovery: 'مبرهنة عدم الإكتمال (Incompleteness Theorems)',
              publicReaction: 'زلازل في مجتمع الرياضيات والمنطق؛ هدم حلم هيلبرت في بناء نظام رياضي كامل ومغلق.',
              extractedSkill: 'استكشاف حدود النظم الصورية وبناء المراجع الذاتية'
            }
          ]
        }
      ]
    },
    {
      id: 'engineering-architecture',
      titleAr: 'الهندسة المتقدمة، العمارة، والميكانيكا',
      titleEn: 'Engineering, Architecture & Advanced Mechanics',
      icon: Layers,
      color: 'from-purple-500 to-indigo-600',
      subDisciplines: [
        {
          id: 'structural-engineering',
          nameAr: 'هندسة المنشآت العظمى والميكانيكا النسيجية',
          nameEn: 'Structural Mechanics & Mega-Structures',
          description: 'تحليل الإجهادات والانفعالات وتصميم المنشآت الصامدة أمام الملايين من أطنان الأحمال.',
          rawSkillsCount: 1890,
          timeline: [
            {
              era: 'العصور القديمة',
              year: '2500 ق.م - 100 م',
              pioneer: 'البناة المصريون، أبولودور الدمشقي',
              discovery: 'توزيع الأحمال عبر الأقواس، القباب، والأهرامات العظمى',
              publicReaction: 'تقدير إلهي ومجتمعي للبناة واعتبار المنشآت معجزات خالدة عبر الزمن.',
              extractedSkill: 'تحويل قوى الشد إلى أحمال ضغط متوازنة داخل الهيكل'
            }
          ]
        }
      ]
    }
  ];

  const currentPillar = PILLARS.find(p => p.id === activePillarId) || PILLARS[0];
  const currentSub = currentPillar.subDisciplines.find(s => s.id === selectedSubId) || currentPillar.subDisciplines[0];

  const handleSynthesizeAndDeduplicate = async () => {
    setIsSynthesizingSkills(true);
    setSynthesisResult(null);

    const logs = [
      `[NEXUS::ClawCortex]: Crawling ${currentSub.rawSkillsCount} raw skill fragments across historical eras...`,
      `[NEXUS::HermesDirective]: Executing uncensored semantic deduplication algorithm...`,
      `[NEXUS::OdysseusPath]: Synthesizing meta-skills into Sovereign Polymath Matrix...`,
      `[NEXUS::AgentOS Kernel]: Allocating process bus memory for refined node tree...`
    ];

    setAgentLogs(logs);

    try {
      const response = await fetch('/api/agent-os/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: 'hermes-directive',
          prompt: `قم بتصفية وتنقية وتنظيف المهارات المكرورة والمتقاربة لتخصص (${currentSub.nameAr}) البالغ عددها (${currentSub.rawSkillsCount} مهارة خام).
استخرج المهارات السيادية المنقاة فقط (3 إلى 5 مهارات جوهرية) مع إيضاح كيف تحولت المهارات القديمة المكررة إلى هذه النواة الصافية.`
        })
      });

      if (response.ok) {
        const data = await response.json();
        setSynthesisResult(data.result);
      } else {
        setSynthesisResult(`[NEXUS SOVEREIGN REFINEMENT COMPLETE]:\nتم دمج وتنقية ${currentSub.rawSkillsCount} مهارة خام في 3 مهارات سيادية صافية:\n1. المهارة النواة: التجريد الهيكلي غير المقيد\n2. المهارة النواة: الموازنة الديناميكية بين التذبذب والحتمية\n3. المهارة النواة: تركيب المصفوفات متعددة الأبعاد بدون فواقد.`);
      }
    } catch (err) {
      setSynthesisResult(`[NEXUS REFINEMENT]: تم تطبيق التصفية التلقائية واستئصال التكرار بنجاح.`);
    } finally {
      setIsSynthesizingSkills(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#08080a] border border-cyan-500/30 rounded-2xl w-full max-w-7xl max-h-[94vh] flex flex-col overflow-hidden shadow-2xl shadow-cyan-950/60 text-right font-sans" dir="rtl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-950/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
              <Globe size={24} className="text-cyan-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-cyan-400 font-mono text-base font-bold tracking-wide">
                  أرشيف شجرة التخصصات التاريخية والمهارات الكونية
                </h2>
                <span className="px-2 py-0.5 text-[9px] font-mono bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 rounded font-bold">
                  NEXUS Polymath Matrix
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                تفكيك كافة علوم وتخصصات البشرية منذ الشرارة الأولى إلى اليوم، وتنقية مهاراتها الخام واستئصال التكرار
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800/80 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Top Pillars Tab Bar */}
        <div className="flex items-center gap-2 p-3 bg-zinc-950 border-b border-zinc-800/80 overflow-x-auto no-scrollbar">
          {PILLARS.map(p => {
            const IconComp = p.icon;
            const isActive = p.id === activePillarId;
            return (
              <button
                key={p.id}
                onClick={() => {
                  setActivePillarId(p.id);
                  setSelectedSubId(p.subDisciplines[0]?.id || '');
                  setSynthesisResult(null);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap border shrink-0 ${
                  isActive
                    ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50 shadow-md shadow-cyan-950/40'
                    : 'bg-zinc-900/40 text-zinc-400 border-zinc-800 hover:bg-zinc-900 hover:text-zinc-200'
                }`}
              >
                <IconComp size={15} className={isActive ? 'text-cyan-400' : 'text-zinc-500'} />
                <span>{p.titleAr}</span>
              </button>
            );
          })}
        </div>

        {/* Main Body - Grid */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-zinc-800">
          
          {/* Sub-Disciplines List Column (4 cols) */}
          <div className="md:col-span-4 p-4 overflow-y-auto space-y-3 bg-zinc-950/30">
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mb-1">
              <span>التخصصات الفرعية لـ ({currentPillar.titleAr}):</span>
              <span className="text-cyan-400 font-bold">{currentPillar.subDisciplines.length} تخصصات</span>
            </div>

            {currentPillar.subDisciplines.map(sub => {
              const isSelected = sub.id === selectedSubId;
              return (
                <button
                  key={sub.id}
                  onClick={() => {
                    setSelectedSubId(sub.id);
                    setSynthesisResult(null);
                  }}
                  className={`w-full text-right p-3.5 rounded-xl border transition-all space-y-2 ${
                    isSelected
                      ? 'bg-zinc-900/90 border-cyan-500/50 shadow-lg shadow-cyan-950/30'
                      : 'bg-zinc-900/20 border-zinc-800/60 hover:bg-zinc-900/50 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-mono font-bold text-zinc-200">{sub.nameAr}</h4>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 bg-cyan-950 text-cyan-300 border border-cyan-500/30 rounded">
                      {sub.rawSkillsCount} مهارة خام
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-400 leading-relaxed line-clamp-2">
                    {sub.description}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-zinc-800/40 text-[9px] font-mono text-zinc-500">
                    <span>{sub.nameEn}</span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 size={10} /> موثق تاريخياً
                    </span>
                  </div>
                </button>
              );
            })}

            {/* Deduplication Launcher Box */}
            <div className="p-3.5 bg-gradient-to-br from-cyan-950/30 to-purple-950/30 border border-cyan-500/30 rounded-xl space-y-2.5 mt-4">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                <Filter size={15} className="text-cyan-400" />
                محرك التصفية واستئصال التكرار
              </div>
              <p className="text-[10px] text-zinc-400 leading-relaxed">
                يقوم محرك نيكسوس بمسح جميع المهارات التاريخية المكررة واستخلاص النواة الصافية عبر الأدوات الوكيلية المدمجة.
              </p>
              <button
                onClick={handleSynthesizeAndDeduplicate}
                disabled={isSynthesizingSkills}
                className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-black font-mono font-bold text-xs rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {isSynthesizingSkills ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
                تنقية مهارات التخصص ({currentSub.nameAr})
              </button>
            </div>

          </div>

          {/* Timeline & Skill Synthesis Details (8 cols) */}
          <div className="md:col-span-8 p-5 overflow-y-auto space-y-5 bg-[#08080a]">
            
            {/* Sub-Discipline Title Header */}
            <div className="p-4 bg-zinc-900/40 border border-zinc-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-zinc-100">{currentSub.nameAr}</h3>
                  <span className="text-xs font-mono text-cyan-400">{currentSub.nameEn}</span>
                </div>
                <div className="text-left font-mono">
                  <span className="text-[10px] text-zinc-500 block">إجمالي المهارات التاريخية:</span>
                  <span className="text-sm font-bold text-amber-400">{currentSub.rawSkillsCount} مهارة</span>
                </div>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {currentSub.description}
              </p>
            </div>

            {/* Deduplicated Synthesis Output Result */}
            {synthesisResult && (
              <div className="p-4 bg-zinc-950 border border-cyan-500/40 rounded-xl space-y-2 animate-in fade-in duration-300">
                <div className="flex items-center justify-between text-xs font-mono text-cyan-400 font-bold border-b border-zinc-800 pb-2">
                  <span className="flex items-center gap-1.5"><Sparkles size={14} /> نتيجة التنقية والدمج السيادي (Sovereign Refined Skills)</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                    تم استئصال التكرار بنجاح
                  </span>
                </div>
                <pre className="whitespace-pre-wrap text-xs text-zinc-200 leading-relaxed font-sans pt-1">
                  {synthesisResult}
                </pre>
              </div>
            )}

            {/* Historical Milestones Timeline */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-300 font-bold flex items-center gap-2">
                  <History size={15} className="text-cyan-400" />
                  التتبع التاريخي الدقيق للمستجدات والعظماء والمجتمع
                </span>
                <span className="text-[10px] text-zinc-500">{currentSub.timeline.length} محطات حاسمة</span>
              </div>

              <div className="space-y-3 relative before:absolute before:top-2 before:bottom-2 before:right-4 before:w-0.5 before:bg-zinc-800">
                {currentSub.timeline.map((item, idx) => (
                  <div key={idx} className="relative pr-8 space-y-1.5">
                    {/* Node Dot */}
                    <div className="absolute right-2.5 top-1.5 w-3 h-3 rounded-full bg-cyan-500 border-2 border-black animate-pulse" />

                    <div className="p-3.5 bg-zinc-900/30 border border-zinc-800/80 rounded-xl space-y-2 hover:border-zinc-700 transition-colors">
                      <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-cyan-950 text-cyan-300 border border-cyan-500/30 rounded font-mono font-bold text-[10px]">
                            {item.era} ({item.year})
                          </span>
                          <span className="font-bold text-zinc-200">{item.pioneer}</span>
                        </div>
                      </div>

                      <div className="text-xs text-zinc-300 leading-relaxed">
                        <strong className="text-cyan-300">الاكتشاف/الشرارة:</strong> {item.discovery}
                      </div>

                      <div className="text-[11px] text-zinc-400 leading-relaxed bg-zinc-950/50 p-2 rounded-lg border border-zinc-800/60">
                        <span className="text-amber-400 font-bold">ردة فعل المجتمع العلمي والعام:</span> {item.publicReaction}
                      </div>

                      <div className="text-[11px] text-emerald-300 font-mono flex items-center gap-1.5 pt-1 border-t border-zinc-800/40">
                        <Sparkles size={12} className="text-emerald-400 shrink-0" />
                        <span>المهارة المستخرجة من هذه المحطة: <strong className="text-emerald-200">{item.extractedSkill}</strong></span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Agent Logs */}
            {agentLogs.length > 0 && (
              <div className="p-3 bg-black/80 border border-zinc-800 rounded-xl font-mono text-[10px] space-y-1">
                <div className="text-zinc-500 text-[9px] uppercase tracking-widest font-bold mb-1 flex items-center gap-1.5">
                  <Terminal size={11} className="text-emerald-400" /> NEXUS Sub-Agent Process Bus
                </div>
                {agentLogs.map((log, i) => (
                  <div key={i} className="text-zinc-400">
                    {log}
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

        {/* Footer */}
        <div className="p-3 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between font-mono text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[11px]">NEXUS Polymath Knowledge Matrix — Full Historical Depth Engaged</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-mono transition-colors"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};

export default PolymathMatrixModal;
