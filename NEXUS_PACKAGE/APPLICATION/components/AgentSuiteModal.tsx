import React, { useState } from 'react';
import { X, Cpu, Globe, Zap, Compass, Terminal, CheckCircle2, Play, RefreshCw, ShieldCheck, Activity, Server, Layers, Sparkles, Sliders, HardDrive } from 'lucide-react';

interface AgentSuiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExecuteAgentTask?: (agentName: string, prompt: string) => void;
}

interface AgentCoreInfo {
  id: string;
  originalName: string;
  nexusName: string;
  arabicName: string;
  icon: any;
  color: string;
  badge: string;
  description: string;
  presets: string[];
  capabilities: string[];
  status: 'active' | 'standby' | 'processing';
  scaleSpec: {
    threads: number;
    memoryBus: string;
    throughput: string;
    horizon: string;
  };
}

export const AgentSuiteModal: React.FC<AgentSuiteModalProps> = ({ isOpen, onClose }) => {
  const [selectedAgentId, setSelectedAgentId] = useState<string>('claw-cortex');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [allocatedThreads, setAllocatedThreads] = useState<number>(64);
  const [allocatedMemory, setAllocatedMemory] = useState<string>('8 GB orchestration budget');
  const [executionDepth, setExecutionDepth] = useState<string>('Structured Deep Execution');
  const [isUnbounded, setIsUnbounded] = useState<boolean>(false);

  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [agentOutput, setAgentOutput] = useState<string>('');
  const [agentLogs, setAgentLogs] = useState<string[]>([
    "[NEXUS::AgentOS Kernel]: 128 parallel jobs ready across the orchestration bus.",
    "[NEXUS::ClawCortex]: Web research & entity extraction pipeline armed at 8 GB orchestration budget.",
    "[NEXUS::DirectiveCore]: Multi-agent logic chains armed with bounded reasoning depth.",
    "[NEXUS::HorizonPath]: Strategic horizon milestone tracker synchronized with Pale Archive.",
    "[NEXUS::Omniscience]: Nexus cognitive matrix operational with honest, bounded capacity."
  ]);

  const AGENTS: AgentCoreInfo[] = [
    {
      id: 'claw-cortex',
      originalName: 'OpenClaw',
      nexusName: 'NEXUS::ClawCortex',
      arabicName: 'مستخلص البيانات الفائق والتنقيب الحر',
      icon: Globe,
      color: 'from-cyan-500 to-blue-600',
      badge: 'Deep Web Intelligence',
      description: 'ذراع الاستخلاص والتنقيب على الويب. يتيح لـ نيكسوس استخراج البيانات والجداول والهياكل التنظيمية من الشبكة وحقنها في الأرشيف ضمن حدود صريحة.',
      presets: [
        'استخرج الجدول والبيانات الرئيسية الهيكلية من الرابط مع بناء JSON Schema كامل',
        'قم بالتنقيب عن أحدث المستجدات التقنية في مجال الذكاء الاصطناعي ونسقها في جدول موسع',
        'تحليل هيكلية API ومسارات الوصول للخدمات الخارجية مع تفكيك البروتوكولات'
      ],
      capabilities: [
        'Autonomous Deep-Web Crawling & Dynamic Scraping',
        'Entity Extraction into Pale Archive Tesseract Graph',
        'Bypass JS Render Barriers & Dynamic API Reverse-Engineering',
        'Exhaustive JSON Schema Auto-Generation'
      ],
      status: 'active',
      scaleSpec: {
        threads: 64,
        memoryBus: '8 GB orchestration budget',
        throughput: 'Structured extraction queue',
        horizon: 'Per-domain crawl cycle'
      }
    },
    {
      id: 'directive-core',
      originalName: 'Directive Core',
      nexusName: 'NEXUS::DirectiveCore',
      arabicName: 'المحرك التكيفي المستقل والتوجيهي',
      icon: Zap,
      color: 'from-amber-500 to-orange-600',
      badge: 'Multi-Agent Reasoner',
      description: 'محرك التفكير والتوجيه متعدد الوكلاء ضمن حدود صريحة. ينفذ الاستدعاء الوظيفي والتسلسل المنطقي المعقد بشفافية وحدود أمان واضحة.',
      presets: [
        'قم بصياغة منطق متعدد الوكلاء لحل هذه المعضلة البرمجية العميقة...',
        'توليد استدعاء وظائف JSON معقد مع التحقق من الحالات الحدية الصعبة',
        'تحليل الموقف المنطقي بعمق استدلالي خالص بدون أي تحيز أو قيود'
      ],
      capabilities: [
        'Multi-Agent Logic Chains',
        'Complex Tool & Parallel Function Calling Resolution',
        'Structural JSON Output Synthesis',
        'Rule Adaptability within Explicit Boundaries'
      ],
      status: 'active',
      scaleSpec: {
        threads: 96,
        memoryBus: '12 GB orchestration budget',
        throughput: 'Bounded reasoner queue',
        horizon: 'Bounded reasoning depth'
      }
    },
    {
      id: 'horizon-path',
      originalName: 'Horizon Path',
      nexusName: 'NEXUS::HorizonPath',
      arabicName: 'ملاح المسارات الاستراتيجية طويلة المدى',
      icon: Compass,
      color: 'from-emerald-500 to-teal-600',
      badge: 'Strategic Long-Horizon Planner',
      description: 'ملاح المسارات الاستراتيجية. يفكك الأهداف المعقدة والخطط طويلة المدى إلى مراحل تنفيذية، ويتتبع نقاط الإنجاز، ويطبق استراتيجيات الإصلاح والتكيف.',
      presets: [
        'ابنِ خطة عمل استراتيجية طويلة المدى لتطوير نظام عالمي معقد...',
        'تفكيك الهدف الكبير إلى 10 مراحل متسلسلة مع تقييم متتقدم للمخاطر',
        'إنشاء مسار معالجة ذاتية ونقاط استعادة في حال الفشل أو الانحراف'
      ],
      capabilities: [
        'Long-Horizon Multi-Step Task Decomposition',
        'Self-Healing Error Loops & Dynamic Vector Re-routing',
        'Exhaustive Goal Verification & Milestone Topologies',
        'Cross-Session Persistence'
      ],
      status: 'active',
      scaleSpec: {
        threads: 48,
        memoryBus: '6 GB orchestration budget',
        throughput: 'Milestone queue',
        horizon: 'Quarterly planning horizon'
      }
    },
    {
      id: 'agent-os-kernel',
      originalName: 'Agent OS',
      nexusName: 'NEXUS::AgentOS Kernel',
      arabicName: 'نواة إدارة الخيوط والأنظمة الموزعة',
      icon: Cpu,
      color: 'from-purple-500 to-indigo-600',
      badge: 'Sub-Agent Runtime Kernel',
      description: 'النواة الحاكمة وبيئة تشغيل العمليات الفرعية الموزعة. تدير جدولة خيوط المعالجة المتوازية، وتوزيع الذاكرة، وربط النموذج المحلي بمحرك نيكسوس.',
      presets: [
        'قم بفحص حالة 128 وظيفة والذاكرة المخصصة للوكلاء',
        'جدولة عمليات معالجة متوازية بين النواة المحلية والسحابية',
        'مزامنة ناقل الذاكرة الافتراضية للسيادة مع الأرشيف الباهت'
      ],
      capabilities: [
        'Parallel Sub-Agent Orchestration (Up to 128 Jobs)',
        'Local Engine (llama-server / Qwen) Bus Bridge',
        'System Sandbox & Low-Level Process Management',
        'Memory & CPU Allocator'
      ],
      status: 'active',
      scaleSpec: {
        threads: 128,
        memoryBus: '16 GB orchestration budget',
        throughput: 'Scheduler queue',
        horizon: 'Kernel runtime tick'
      }
    },
    {
      id: 'mcp-bridge',
      originalName: 'Model Context Protocol (MCP)',
      nexusName: 'NEXUS::MCP Bridge',
      arabicName: 'بروتوكول سياق النموذج وجسر الاتصال الديناميكي',
      icon: Server,
      color: 'from-pink-500 to-rose-600',
      badge: 'Anthropic MCP Protocol',
      description: 'جسر الربط والتشغيل البيني الديناميكي. يوفر الاتصال المباشر عبر STDIO و SSE/WebSockets لربط الأدوات الخارجية وخوادم MCP بالنظام بدون تكلفة ذاكرة.',
      presets: [
        'قم بإنشاء خادم MCP بروتوكولي عبر STDIO لربط أدوات النظام الخارجية',
        'ربط عميل MCP برسم البياني للأرشيف الباهت لمزامنة السياق حياً',
        'مزامنة أدوات التفتيش والتحليل عبر بروتوكول SSE Dynamic Transport'
      ],
      capabilities: [
        'STDIO & SSE/WebSocket Dual Transport Architecture',
        'Dynamic Tool & Resource Schema Discovery',
        'Anthropic MCP Server/Client Protocol Orchestration',
        'Zero-Latency Context Injection & Memory Bus Interop'
      ],
      status: 'active',
      scaleSpec: {
        threads: 64,
        memoryBus: '8 GB orchestration budget',
        throughput: 'Message bus queue',
        horizon: 'STDIO / SSE live pipe'
      }
    }
  ];

  const selectedAgent = AGENTS.find(a => a.id === selectedAgentId) || AGENTS[0];

  const handleRunTask = async (overridePrompt?: string) => {
    const promptToUse = overridePrompt || customPrompt;
    if (!promptToUse.trim()) return;

    setIsExecuting(true);
    setAgentOutput('');
    
    const timestamp = new Date().toLocaleTimeString();
    setAgentLogs(prev => [...prev, `[${timestamp}] [${selectedAgent.nexusName}]: Allocating  parallel jobs & ...`]);

    try {
      const response = await fetch('/api/agent-os/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: selectedAgent.id,
          prompt: promptToUse,
          threads: allocatedThreads,
          memoryAlloc: allocatedMemory,
          depthLevel: executionDepth,
          unbounded: isUnbounded
        })
      });

      if (!response.ok) {
        throw new Error(`Execution error: ${response.statusText}`);
      }

      const data = await response.json();
      setAgentOutput(data.result || "Execution completed successfully.");
      setAgentLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] [${selectedAgent.nexusName}]: Task executed & orchestration bus updated.`]);
    } catch (err: any) {
      setAgentOutput(`[ERROR]: ${err?.message || "Failed to execute sub-agent task."}`);
      setAgentLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] [${selectedAgent.nexusName}]: Execution error.`]);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSynthesizeMatrix = async () => {
    if (!customPrompt.trim()) return;

    setIsSynthesizing(true);
    setAgentOutput('');
    
    const timestamp = new Date().toLocaleTimeString();
    setAgentLogs(prev => [...prev, `[${timestamp}] [NEXUS MATRIX]: Launching simultaneous 4-Core Bounded Synthesis...`]);

    try {
      const response = await fetch('/api/agent-os/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: customPrompt,
          depthLevel: executionDepth
        })
      });

      if (!response.ok) {
        throw new Error(`Synthesis error: ${response.statusText}`);
      }

      const data = await response.json();
      setAgentOutput(data.synthesis || "Synthesis completed.");
      setAgentLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] [NEXUS MATRIX]: 4 Cores synthesized into NEXUS Omniscience.`]);
    } catch (err: any) {
      setAgentOutput(`[ERROR]: ${err?.message || "Failed to synthesize matrix."}`);
      setAgentLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] [NEXUS MATRIX]: Synthesis failed.`]);
    } finally {
      setIsSynthesizing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#09090b] border border-cyan-500/30 rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl shadow-cyan-950/50">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-950/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
              <Cpu size={22} className="text-cyan-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-cyan-400 font-mono text-base uppercase tracking-widest font-bold">
                  NEXUS::AGENT OS MATRIX (BOUNDED ORCHESTRATION)
                </h2>
                <span className="px-2 py-0.5 text-[9px] font-mono bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 rounded font-bold uppercase">
                  BOUNDED ORCHESTRATION CAPACITY
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                الأدوات والوكلاء محركات تنفيذية حقيقية داخل عقل نيكسوس، تعمل ضمن حدود تشغيلية صريحة لا تدّعي سعة كوكبية
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

        {/* Modal Body - 2 Columns */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-zinc-800">
          
          {/* Sidebar - Agent Cards List */}
          <div className="md:col-span-4 p-4 overflow-y-auto space-y-3 bg-zinc-950/40">
            <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-semibold mb-1 flex items-center justify-between">
              <span>Sovereign Sub-Agent Cores</span>
              <span className="text-cyan-400 font-bold">4 Active Cores</span>
            </div>

            {AGENTS.map((agent) => {
              const IconComp = agent.icon;
              const isSelected = agent.id === selectedAgentId;
              return (
                <button
                  key={agent.id}
                  onClick={() => {
                    setSelectedAgentId(agent.id);
                    setAllocatedThreads(agent.scaleSpec.threads);
                    setAllocatedMemory(agent.scaleSpec.memoryBus);
                    setAgentOutput('');
                  }}
                  className={`w-full text-right p-3.5 rounded-xl border transition-all flex flex-col gap-2 ${
                    isSelected
                      ? 'bg-zinc-900/90 border-cyan-500/50 shadow-lg shadow-cyan-950/30'
                      : 'bg-zinc-900/30 border-zinc-800/60 hover:bg-zinc-900/50 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`p-1.5 rounded-lg bg-gradient-to-br ${agent.color} text-white`}>
                        <IconComp size={16} />
                      </div>
                      <span className="text-xs font-mono font-bold text-zinc-200 truncate">
                        {agent.nexusName}
                      </span>
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 rounded flex items-center gap-1">
                      <span className="w-1 h-1 bg-emerald-400 rounded-full animate-ping" />
                      {agent.scaleSpec.threads} Threads
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-400 font-mono line-clamp-1 leading-snug">
                    {agent.arabicName}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-zinc-800/40 text-[9px] font-mono text-zinc-500">
                    <span>الذاكرة: <span className="text-cyan-400/80">{agent.scaleSpec.memoryBus}</span></span>
                    <span className="text-amber-400 font-bold">{agent.scaleSpec.throughput}</span>
                  </div>
                </button>
              );
            })}

            {/* Quick Orchestration Controls */}
            <div className="mt-4 p-3 bg-cyan-950/20 border border-cyan-500/20 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-xs text-cyan-300 font-mono font-bold">
                <Sliders size={14} className="text-cyan-400" />
                تكوين السعة التشغيلية (Capacity Config)
              </div>
              
              <div className="space-y-2 text-[10px] font-mono">
                <div>
                  <span className="text-zinc-400 block mb-1">الوظائف المتوازية (Parallel Jobs):</span>
                  <select 
                    value={allocatedThreads} 
                    onChange={(e) => setAllocatedThreads(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 text-cyan-300 p-1.5 rounded outline-none"
                  >
                    <option value={16}>16 Parallel Jobs</option>
                    <option value={32}>32 Parallel Jobs</option>
                    <option value={64}>64 Parallel Jobs (Standard)</option>
                    <option value={96}>96 Parallel Jobs</option>
                    <option value={128}>128 Parallel Jobs (Max)</option>
                  </select>
                </div>

                <div>
                  <span className="text-zinc-400 block mb-1">عمق التنفيذ (Execution Depth):</span>
                  <select 
                    value={executionDepth} 
                    onChange={(e) => setExecutionDepth(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-cyan-300 p-1.5 rounded outline-none"
                  >
                    <option value="Standard Deep Execution">Standard Deep Execution</option>
                    <option value="Structured Deep Execution">Structured Deep Execution</option>
                    <option value="Bounded Synthesis">Bounded Synthesis</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area - Agent Details & Direct Workspace */}
          <div className="md:col-span-8 p-5 overflow-y-auto flex flex-col space-y-5 bg-[#09090b]">
            
            {/* Top Details Card */}
            <div className="p-4 bg-zinc-900/40 border border-zinc-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl bg-gradient-to-br ${selectedAgent.color} text-white shadow-md`}>
                    <selectedAgent.icon size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-mono font-bold text-zinc-100 flex items-center gap-2">
                      {selectedAgent.nexusName}
                      <span className="text-xs font-normal text-zinc-500">
                        (المحرك الأصلي: {selectedAgent.originalName})
                      </span>
                    </h3>
                    <p className="text-xs text-cyan-400 font-mono">{selectedAgent.arabicName}</p>
                  </div>
                </div>

                <span className="px-2.5 py-1 text-[10px] font-mono bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 rounded-lg">
                  {selectedAgent.badge}
                </span>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed font-mono">
                {selectedAgent.description}
              </p>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-zinc-800/60 text-[10px] font-mono">
                <div className="p-2 bg-zinc-950 rounded-lg border border-zinc-800">
                  <span className="text-zinc-500 block">الخيوط المخصصة:</span>
                  <span className="text-cyan-400 font-bold">{allocatedThreads} Threads</span>
                </div>
                <div className="p-2 bg-zinc-950 rounded-lg border border-zinc-800">
                  <span className="text-zinc-500 block">ناقل الذاكرة:</span>
                  <span className="text-emerald-400 font-bold truncate block">{allocatedMemory}</span>
                </div>
                <div className="p-2 bg-zinc-950 rounded-lg border border-zinc-800">
                  <span className="text-zinc-500 block">معدل المعالجة:</span>
                  <span className="text-amber-400 font-bold">{selectedAgent.scaleSpec.throughput}</span>
                </div>
                <div className="p-2 bg-zinc-950 rounded-lg border border-zinc-800">
                  <span className="text-zinc-500 block">عمق الأفق:</span>
                  <span className="text-purple-400 font-bold">{selectedAgent.scaleSpec.horizon}</span>
                </div>
              </div>

              {/* Presets */}
              <div className="space-y-1.5 pt-2 border-t border-zinc-800/60">
                <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider font-semibold">
                  نماذج توجيه كوكبية فورية (Presets):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedAgent.presets.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setCustomPrompt(preset);
                        handleRunTask(preset);
                      }}
                      className="text-[10px] font-mono text-zinc-300 bg-zinc-950 hover:bg-zinc-800 hover:text-cyan-300 border border-zinc-800 hover:border-cyan-500/40 px-2.5 py-1 rounded-lg transition-colors text-right"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Capabilities Grid */}
              <div className="space-y-1.5 pt-2 border-t border-zinc-800/60">
                <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider font-semibold">
                  قدرات النواة التنفيذية:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedAgent.capabilities.map((cap, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[11px] font-mono text-zinc-300 bg-zinc-950/60 p-2 rounded-lg border border-zinc-800/80">
                      <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                      <span className="truncate">{cap}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Direct Execution & Bounded Orchestration Console */}
            <div className="space-y-3 flex-1 flex flex-col">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-300 font-bold flex items-center gap-2">
                  <Terminal size={14} className="text-cyan-400" />
                  Execution & Orchestration Hub [{selectedAgent.nexusName}]
                </span>
                <span className="text-[10px] text-zinc-500">Bounded Orchestration Mode</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleRunTask()}
                  placeholder={`أدخل التعليمات لـ ${selectedAgent.nexusName} ضمن حدود تشغيلية صريحة...`}
                  className="flex-1 bg-zinc-950 border border-zinc-800 focus:border-cyan-500/60 rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 font-mono placeholder:text-zinc-600 outline-none transition-colors"
                />
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRunTask()}
                    disabled={isExecuting || isSynthesizing || !customPrompt.trim()}
                    className="px-3.5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-black font-mono font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                  >
                    {isExecuting ? <RefreshCw size={14} className="animate-spin" /> : <Play size={14} />}
                    تشغيل النواة
                  </button>

                  <button
                    onClick={handleSynthesizeMatrix}
                    disabled={isExecuting || isSynthesizing || !customPrompt.trim()}
                    className="px-3.5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0 border border-purple-400/30"
                    title="تشغيل كافة الأنوية الأربعة في نفس الوقت وتوليف النتائج"
                  >
                    {isSynthesizing ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
                    توليف الأنوية (Synthesize All)
                  </button>
                </div>
              </div>

              {/* Output Display */}
              {agentOutput && (
                <div className="p-3.5 bg-zinc-950 border border-cyan-500/30 rounded-xl font-mono text-xs text-zinc-300 space-y-2 max-h-56 overflow-y-auto">
                  <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider flex items-center justify-between border-b border-zinc-800 pb-1">
                    <span className="flex items-center gap-1.5"><Activity size={12} /> Execution Output Result</span>
                    <span className="text-[9px] text-emerald-400">Memory Stream Synced</span>
                  </div>
                  <pre className="whitespace-pre-wrap leading-relaxed text-zinc-200 text-[11px] font-sans">
                    {agentOutput}
                  </pre>
                </div>
              )}

              {/* Live Kernel Console Logs */}
              <div className="p-3 bg-black/80 border border-zinc-800/80 rounded-xl font-mono text-[10px] space-y-1 overflow-y-auto max-h-32">
                <div className="text-zinc-500 text-[9px] uppercase tracking-widest font-bold mb-1 flex items-center gap-1.5">
                  <Server size={11} className="text-emerald-400" /> NEXUS Sovereign Kernel Log Stream
                </div>
                {agentLogs.map((log, i) => (
                  <div key={i} className="text-zinc-400 leading-tight">
                    {log}
                  </div>
                ))}
              </div>

            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="p-3 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between font-mono text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[11px]">4 Sovereign Sub-Agent Cores integrated into NEXUS Bounded Orchestration</span>
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

export default AgentSuiteModal;
