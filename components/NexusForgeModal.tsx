import React, { useState, useEffect, useRef } from 'react';
import { X, Sparkles, Download, RefreshCw, Sliders, CheckCircle2, Terminal, Layers, Palette, Eye, Copy, Zap, Cpu, Activity, Play } from 'lucide-react';

interface NexusForgeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NexusForgeModal: React.FC<NexusForgeModalProps> = ({ isOpen, onClose }) => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>('مشهد سينمائي ملحمي مع إضاءة قوية ورونية عميقة');
  const [steps, setSteps] = useState<number>(20);
  const [useExternal, setUseExternal] = useState<boolean>(true);
  const [generationResult, setGenerationResult] = useState<any>(null);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll terminal to bottom when new logs arrive
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [consoleLogs]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGenerationResult(null);
    setConsoleLogs([
      `[${new Date().toLocaleTimeString()}] [NEXUS KERNEL]: Initializing sovereign tesseract grid...`,
      `[${new Date().toLocaleTimeString()}] [NEXUS KERNEL]: Steering latent space denoising trajectory...`,
      `[${new Date().toLocaleTimeString()}] [NEXUS KERNEL]: Allocating virtual memory bus for ${steps} steps...`
    ]);

    try {
      const res = await fetch('/api/nexus-forge-x/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          concept: prompt,
          steps,
          useExternal
        })
      });

      const data = await res.json();
      if (data.logs && data.logs.length > 0) {
        setConsoleLogs(prev => [...prev, ...data.logs]);
      }

      if (data.success) {
        setGenerationResult(data);
      } else {
        setConsoleLogs(prev => [...prev, `[FATAL ERROR]: ${data.error || 'Latent space rupture'}`]);
      }
    } catch (err: any) {
      setConsoleLogs(prev => [...prev, `[NETWORK ERROR]: ${err.message}`]);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  const PRESETS = [
    { title: 'بوابة النجم رونية', prompt: 'بوابة نجمية كونية تطفو في الفراغ مع نقوش رونية متوهجة وشريط زمن مكسور', steps: 25 },
    { title: 'المدينة السيادية', prompt: 'ناطحات سحاب طوبولوجية متداخلة من الزجاج الكريستالي الفاخر والنور الدافئ', steps: 20 },
    { title: 'محيط دلالي كمومي', prompt: 'أمواج من البيانات المشوشة تتكثف لتشكل دالة موجية مجسمة ثلاثية الأبعاد', steps: 15 },
    { title: 'نواة الوجود المطلقة', prompt: 'مركز الإدراك الفائق تيسيراكت ذو ثمانية أبعاد يشع خطوط طاقة عمودية متوهجة', steps: 30 }
  ];

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
                  NEXUS FORGE X // SOVEREIGN GENESIS ENGINE
                </h2>
                <span className="px-2 py-0.5 text-[9px] font-mono bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 rounded font-bold uppercase">
                  Real-Time Latent Steering
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                محرك التوجيه الجراحي للفضاء الكامن وتشكيل التنسورات عبر الانتباه المباشر والناقد البصري المستمر
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

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 bg-[#09090b]">
          
          {/* Left Column: Form & Configuration */}
          <div className="md:col-span-5 space-y-4">
            
            {/* System Info Card */}
            <div className="p-4 bg-zinc-900/40 border border-zinc-800 rounded-xl space-y-2">
              <span className="text-xs font-mono font-bold text-zinc-200 flex items-center gap-2">
                <Layers size={15} className="text-cyan-400" />
                خصائص المعمارية (Active Blueprint)
              </span>
              <p className="text-[11px] text-zinc-400 font-mono leading-relaxed">
                يتحكم محرك <strong className="text-cyan-400">NEXUS Forge X</strong> في خط سير فك التشوير الزمني (Denoising Steps) عن طريق تطبيق حقول قوة من الانحياز والتعزيز في كتل الانتباه لـ UNet (Cross-Attention Blocks) متجاوزاً التوليد العشوائي التقليدي.
              </p>
            </div>

            {/* Inputs Form */}
            <div className="p-4 bg-zinc-900/40 border border-zinc-800 rounded-xl space-y-4">
              <span className="text-xs font-mono font-bold text-zinc-200 flex items-center gap-2">
                <Sliders size={15} className="text-cyan-400" />
                بارامترات التوجيه الكامن
              </span>

              {/* Concept Input */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-zinc-400 block">المفهوم المراد تشكيله (Concept Prompt):</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={3}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-cyan-500/60 rounded-xl p-2.5 text-xs text-zinc-200 font-mono outline-none resize-none leading-relaxed"
                  placeholder="وصف المشهد الفلسفي أو البصري..."
                />
              </div>

              {/* Steps Input */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[11px] font-mono">
                  <span className="text-zinc-400">خطوات التصفية (Denoising Steps):</span>
                  <span className="text-cyan-400 font-bold">{steps} Steps</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="5"
                  value={steps}
                  onChange={(e) => setSteps(Number(e.target.value))}
                  className="w-full accent-cyan-500 bg-zinc-950 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* External Critic Toggle */}
              <div className="flex items-center justify-between p-2.5 bg-zinc-950/80 rounded-xl border border-zinc-800/60">
                <div className="flex flex-col">
                  <span className="text-[11px] font-mono font-bold text-zinc-200">الناقد الخارجي الفعال (Gemini Critic)</span>
                  <span className="text-[9px] text-zinc-500 font-mono">التقييم المستمر بالرؤية الحاسوبية وإعادة التوجيه</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={useExternal} 
                    onChange={(e) => setUseExternal(e.target.checked)} 
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-400 after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500 peer-checked:after:bg-white peer-checked:after:border-cyan-600"></div>
                </label>
              </div>

              {/* Presets */}
              <div className="space-y-1.5 pt-2 border-t border-zinc-800">
                <span className="text-[10px] font-mono text-zinc-500 uppercase">مفاهيم مسبقة الصنع (Sovereign Presets):</span>
                <div className="flex flex-col gap-1.5">
                  {PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setPrompt(p.prompt);
                        setSteps(p.steps);
                      }}
                      className="text-[10px] text-right font-mono bg-zinc-950 hover:bg-zinc-800/80 text-zinc-300 hover:text-cyan-300 border border-zinc-800 p-2 rounded-lg transition-colors truncate"
                    >
                      {p.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fire Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-black font-mono font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-lg shadow-cyan-950/50"
              >
                {isGenerating ? <RefreshCw size={16} className="animate-spin text-black" /> : <Play size={16} className="fill-black text-black" />}
                بدء تشكيل الفضاء الكامن (ENGAGE STEERING)
              </button>
            </div>

          </div>

          {/* Right Column: Interactive Output Canvas & Terminal */}
          <div className="md:col-span-7 flex flex-col space-y-4">
            
            {/* Display Canvas */}
            <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex flex-col justify-center items-center relative overflow-hidden min-h-[380px]">
              {isGenerating ? (
                <div className="flex flex-col items-center gap-3 text-cyan-400 font-mono text-xs animate-pulse">
                  <Activity size={32} className="animate-spin text-cyan-400" />
                  <span>NEXUS Forge X: Modulating latent coordinates in real-time...</span>
                  <span className="text-[10px] text-zinc-500">Injecting mathematical force vectors into cross-attention channels</span>
                </div>
              ) : generationResult ? (
                <div className="w-full h-full flex flex-col space-y-3">
                  
                  <div className="flex items-center justify-between text-xs font-mono border-b border-zinc-800 pb-2">
                    <span className="text-cyan-300 font-bold flex items-center gap-2">
                      <CheckCircle2 size={15} className="text-cyan-400" />
                      {generationResult.title}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 bg-cyan-950 text-cyan-300 rounded border border-cyan-500/30">
                      Forge X Output
                    </span>
                  </div>

                  {/* SVG Display */}
                  {generationResult.svgContent && (
                    <div 
                      className="w-full flex-1 rounded-xl overflow-hidden border border-zinc-800 bg-black flex items-center justify-center p-2"
                      dangerouslySetInnerHTML={{ __html: generationResult.svgContent }}
                    />
                  )}

                  <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 pt-1">
                    <span>المفهوم: <strong className="text-cyan-300">{prompt}</strong></span>
                    <span>الخطوات: <strong className="text-zinc-300">{steps}</strong></span>
                  </div>

                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center space-y-3 text-zinc-500 font-mono p-6">
                  <Palette size={48} className="text-zinc-700 animate-pulse" />
                  <div>
                    <h4 className="text-xs font-bold text-zinc-400">Latent Vector Canvas</h4>
                    <p className="text-[11px] text-zinc-600 mt-1">
                      اضبط المفهوم وانقر على بدء التشكيل لتوجيه مصفوفات الانتباه وتحريض التنسورات في الزمن الفعلي
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Terminal Window */}
            <div className="p-4 bg-black/95 border border-zinc-800/80 rounded-xl font-mono text-[10px] md:text-xs text-emerald-400 space-y-2 h-44 overflow-y-auto shadow-inner flex flex-col">
              <div className="text-zinc-500 font-bold flex items-center justify-between border-b border-zinc-800/60 pb-1 mb-1 shrink-0">
                <span className="flex items-center gap-1.5">
                  <Terminal size={12} className="text-cyan-400" /> Real-time Latent Trace & Engine Diagnostics:
                </span>
                <span className="text-[9px] text-zinc-600 uppercase">SYS_LOGS_ACTIVE</span>
              </div>
              <div className="flex-1 overflow-y-auto space-y-1">
                {consoleLogs.length > 0 ? (
                  consoleLogs.map((log, i) => (
                    <div key={i} className={`leading-relaxed ${log.includes('[SUCCESS]') ? 'text-cyan-300 font-bold' : log.includes('[ERROR]') || log.includes('[FATAL]') ? 'text-rose-400 font-bold' : 'text-emerald-400/90'}`}>
                      {log}
                    </div>
                  ))
                ) : (
                  <div className="text-zinc-700 italic">SYSTEM IDLE. AWAITING EXTREME COGNITION LAUNCH...</div>
                )}
                <div ref={terminalEndRef} />
              </div>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="p-3 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between font-mono text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[11px]">NEXUS::Forge-X Sovereign Core — Active Simulator & Latent Steerer</span>
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

export default NexusForgeModal;
