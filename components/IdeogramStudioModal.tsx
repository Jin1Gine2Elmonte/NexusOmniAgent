import React, { useState, useEffect } from 'react';
import { X, Sparkles, Download, RefreshCw, Type, Image as ImageIcon, Sliders, CheckCircle2, Terminal, Layers, Palette, Eye, Copy, Zap, Cpu } from 'lucide-react';

interface IdeogramStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface IdeogramModelStatus {
  downloaded: boolean;
  modelName: string;
  version: string;
  parameters: string;
  architecture: string;
  capabilities: string[];
  status: string;
  injectedAt?: string;
}

export const IdeogramStudioModal: React.FC<IdeogramStudioModalProps> = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState<IdeogramModelStatus | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState<boolean>(true);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Form inputs
  const [prompt, setPrompt] = useState<string>('شعار مبتكر وعالي الدقة لـ NEXUS V-TESSERACT مع خط عربي ذهبي حديث');
  const [typographyText, setTypographyText] = useState<string>('NEXUS V-TESSERACT');
  const [style, setStyle] = useState<string>('Modern Golden Calligraphy & Neon Vector');
  const [aspectRatio, setAspectRatio] = useState<string>('16:9');

  // Generation result
  const [generationResult, setGenerationResult] = useState<any>(null);
  const [downloadLog, setDownloadLog] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
    }
  }, [isOpen]);

  const fetchStatus = async () => {
    setIsLoadingStatus(true);
    try {
      const res = await fetch('/api/ideogram-model/status');
      const data = await res.json();
      setStatus(data);
    } catch (e) {
      console.error('Failed to fetch Ideogram status:', e);
    } finally {
      setIsLoadingStatus(false);
    }
  };

  const handleDownloadInject = async () => {
    setIsDownloading(true);
    setDownloadLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] Executing Terminal script: node scripts/download_ideogram_4.0.js...`]);

    try {
      const res = await fetch('/api/ideogram-model/download', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setDownloadLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] [SUCCESS]: Ideogram 4.0 Open-Source Tesseract Engine injected into NEXUS!`]);
        await fetchStatus();
      } else {
        setDownloadLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] [ERROR]: ${data.error || 'Failed to download model.'}`]);
      }
    } catch (err: any) {
      setDownloadLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] [ERROR]: ${err.message}`]);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGenerationResult(null);

    try {
      const res = await fetch('/api/ideogram-model/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          typographyText,
          style,
          aspectRatio
        })
      });

      const data = await res.json();
      if (data.success) {
        setGenerationResult(data.result);
      } else {
        alert(`Generation Error: ${data.error || 'Failed to generate image'}`);
      }
    } catch (err: any) {
      alert(`Network Error: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  const PRESETS = [
    { title: 'شعار غلافي حديث', prompt: 'شعار فخم لنظام ذكاء اصطناعي سيادي', typography: 'NEXUS SINGULARITY', style: 'Modern Golden Calligraphy & Neon Vector' },
    { title: 'بوستر سايبربانك', prompt: 'لوحة إعلانية مستقبلية وسط مدينة ذكية', typography: 'THE PALE ARCHIVE', style: 'Cyberpunk Neon Typography' },
    { title: 'شعار ثلاثي الأبعاد', prompt: 'شعار هندسي زجاجي متداخل من الأبعاد الأربعة', typography: 'V-TESSERACT 4.0', style: '3D Crystal Geometry Vector' },
    { title: 'خط عربي أسطوري', prompt: 'تكوين حروفي أسطوري متداخل مع شعاع ضوئي', typography: 'العقل السيادي', style: 'Traditional Islamic Calligraphy & Modern Light' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#09090b] border border-purple-500/30 rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl shadow-purple-950/50">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-950/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-500/10 border border-purple-500/30 rounded-xl">
              <Sparkles size={22} className="text-purple-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-purple-400 font-mono text-base uppercase tracking-widest font-bold">
                  IDEOGRAM 4.0 TESSERACT STUDIO (OPEN-SOURCE ENGINE)
                </h2>
                <span className="px-2 py-0.5 text-[9px] font-mono bg-purple-950/80 border border-purple-500/40 text-purple-300 rounded font-bold uppercase">
                  12.4B PARAMETERS
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                محرك التوليد البصري والتايبوجرافي المحقون في عقل نيكسوس لتوليد التصاميم والخطوط فائقة الدقة
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
          
          {/* Left Column: Model Status & Config */}
          <div className="md:col-span-5 space-y-4">
            
            {/* Status Card */}
            <div className="p-4 bg-zinc-900/40 border border-zinc-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-zinc-200 flex items-center gap-2">
                  <Cpu size={15} className="text-purple-400" />
                  حالة نموذج Ideogram 4.0 المحقون
                </span>
                {status?.downloaded ? (
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                    Injected & Active
                  </span>
                ) : (
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-950 text-amber-400 border border-amber-500/30 rounded-full">
                    Not Injected
                  </span>
                )}
              </div>

              <div className="text-xs font-mono text-zinc-400 space-y-1.5">
                <p><strong className="text-zinc-200">اسم النموذج:</strong> {status?.modelName || 'Ideogram 4.0 Open-Source Tesseract'}</p>
                <p><strong className="text-zinc-200">النسخة:</strong> {status?.version || 'v4.0.0-Sovereign'}</p>
                <p><strong className="text-zinc-200">عدد المعلمات:</strong> <span className="text-purple-300 font-bold">{status?.parameters || '12.4 Billion Parameters'}</span></p>
                <p><strong className="text-zinc-200">البنية:</strong> {status?.architecture || 'Diffusion Tesseract Transformer'}</p>
              </div>

              <button
                onClick={handleDownloadInject}
                disabled={isDownloading}
                className="w-full py-2 bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/40 text-purple-200 font-mono text-xs rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {isDownloading ? <RefreshCw size={14} className="animate-spin" /> : <Download size={14} />}
                إعادة تحميل وحقن نموذج Ideogram 4.0 عبر التيرمنال
              </button>
            </div>

            {/* Prompt Configurator Form */}
            <div className="p-4 bg-zinc-900/40 border border-zinc-800 rounded-xl space-y-3">
              <span className="text-xs font-mono font-bold text-zinc-200 flex items-center gap-2">
                <Sliders size={15} className="text-purple-400" />
                إعدادات التوليد البصري والخطوط
              </span>

              {/* Text Prompt */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-zinc-400 block">وصف المشهد البصري (Visual Prompt):</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={2}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-purple-500/60 rounded-xl p-2.5 text-xs text-zinc-200 font-mono outline-none resize-none"
                  placeholder="وصف الصورة المطلوب توليدها..."
                />
              </div>

              {/* Explicit Typography Text */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-purple-300 font-bold block flex items-center gap-1.5">
                  <Type size={13} /> النص الدقيق المراد رسمه داخل الصورة (Exact Typography):
                </label>
                <input
                  type="text"
                  value={typographyText}
                  onChange={(e) => setTypographyText(e.target.value)}
                  className="w-full bg-zinc-950 border border-purple-500/40 focus:border-purple-400 rounded-xl p-2.5 text-xs text-purple-200 font-mono outline-none"
                  placeholder="مثال: NEXUS V-TESSERACT"
                />
              </div>

              {/* Style Selector */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-zinc-400 block">النمط الفني (Artistic Style):</label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-zinc-200 p-2 rounded-xl text-xs font-mono outline-none"
                >
                  <option value="Modern Golden Calligraphy & Neon Vector">Modern Golden Calligraphy & Neon Vector</option>
                  <option value="Cyberpunk Neon Typography">Cyberpunk Neon Typography</option>
                  <option value="3D Crystal Geometry Vector">3D Crystal Geometry Vector</option>

                  <option value="Traditional Islamic Calligraphy & Modern Light">Traditional Islamic Calligraphy & Modern Light</option>
                  <option value="Cinematic Dark Luxury Photorealism">Cinematic Dark Luxury Photorealism</option>
                </select>
              </div>

              {/* Presets */}
              <div className="space-y-1.5 pt-2 border-t border-zinc-800">
                <span className="text-[10px] font-mono text-zinc-500 uppercase">نماذج سريعة (Presets):</span>
                <div className="flex flex-wrap gap-1.5">
                  {PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setPrompt(p.prompt);
                        setTypographyText(p.typography);
                        setStyle(p.style);
                      }}
                      className="text-[10px] font-mono bg-zinc-950 hover:bg-zinc-800 text-zinc-300 hover:text-purple-300 border border-zinc-800 px-2 py-1 rounded-lg transition-colors"
                    >
                      {p.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-lg shadow-purple-950/50"
              >
                {isGenerating ? <RefreshCw size={16} className="animate-spin" /> : <Zap size={16} />}
                توليد بواسطة Ideogram 4.0 Tesseract Engine
              </button>
            </div>

            {/* Download Logs */}
            {downloadLog.length > 0 && (
              <div className="p-3 bg-black/80 border border-zinc-800 rounded-xl font-mono text-[10px] text-zinc-400 space-y-1 max-h-32 overflow-y-auto">
                <div className="text-zinc-500 font-bold flex items-center gap-1">
                  <Terminal size={12} className="text-purple-400" /> Terminal Model Download Output:
                </div>
                {downloadLog.map((log, i) => (
                  <div key={i}>{log}</div>
                ))}
              </div>
            )}

          </div>

          {/* Right Column: Generation Canvas & Result */}
          <div className="md:col-span-7 flex flex-col space-y-4">
            
            <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex flex-col justify-center items-center relative overflow-hidden min-h-[380px]">
              {isGenerating ? (
                <div className="flex flex-col items-center gap-3 text-purple-400 font-mono text-xs animate-pulse">
                  <RefreshCw size={32} className="animate-spin" />
                  <span>Ideogram 4.0 Tesseract Diffusion Latent Synthesis in progress...</span>
                  <span className="text-[10px] text-zinc-500">Processing 12.4B Parameters Typography Alignment</span>
                </div>
              ) : generationResult ? (
                <div className="w-full h-full flex flex-col space-y-3">
                  
                  <div className="flex items-center justify-between text-xs font-mono border-b border-zinc-800 pb-2">
                    <span className="text-purple-300 font-bold flex items-center gap-2">
                      <CheckCircle2 size={15} className="text-emerald-400" />
                      {generationResult.title || 'Ideogram 4.0 Render Result'}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 bg-purple-950 text-purple-300 rounded border border-purple-500/30">
                      Ideogram 4.0 12.4B
                    </span>
                  </div>

                  {/* SVG Output Display */}
                  {generationResult.svgContent && (
                    <div 
                      className="w-full flex-1 rounded-xl overflow-hidden border border-zinc-800 bg-black flex items-center justify-center p-2"
                      dangerouslySetInnerHTML={{ __html: generationResult.svgContent }}
                    />
                  )}

                  {/* Description & Prompt Metadata */}
                  <div className="p-3 bg-zinc-900/60 border border-zinc-800/80 rounded-xl font-mono text-xs text-zinc-300 space-y-1">
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      {generationResult.description}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1 border-t border-zinc-800/60">
                      <span>النص المرسوم: <strong className="text-purple-300">{generationResult.typographyText}</strong></span>
                      <span>النمط: <strong className="text-zinc-300">{generationResult.style}</strong></span>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center space-y-3 text-zinc-500 font-mono p-6">
                  <ImageIcon size={48} className="text-zinc-700" />
                  <div>
                    <h4 className="text-xs font-bold text-zinc-400">Ideogram 4.0 Visual Canvas</h4>
                    <p className="text-[11px] text-zinc-600 mt-1">
                      أدخل النص والوصف اضغط على "توليد بواسطة Ideogram 4.0" لبدء تخليق الصورة
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="p-3 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between font-mono text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-[11px]">Ideogram 4.0 Open-Source Tesseract Engine (12.4B Params) - Injected in NEXUS</span>
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

export default IdeogramStudioModal;
