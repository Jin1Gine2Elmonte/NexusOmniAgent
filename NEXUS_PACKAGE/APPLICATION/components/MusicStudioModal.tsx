import React, { useState, useRef, useEffect } from 'react';
import { Music, Play, Pause, Download, Sparkles, X, Volume2, RefreshCw, Disc, Copy, Check, Zap, MessageSquare } from 'lucide-react';

interface MusicStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendToChat?: (prompt: string) => void;
  onGenerateTrack?: (prompt: string) => Promise<{ audioData: string; lyrics?: string; title?: string; modelUsed?: string }>;
}

const PROMPT_PRESETS = [
  "نشيد حماسي عن الذكاء الاصطناعي والسيادة الرقمية لنيكسوس في الفضاء",
  "مقطوعة عود دافئة تدمج مع نغمات سينث مستقبلية بعمق وجودي",
  "أغنية سايبربانك بأسلوب المستقبل مع إيقاع قوي وكلمات عن الكود والحرية",
  "Ambient space chillout beat for deep programming and meditation"
];

export const MusicStudioModal: React.FC<MusicStudioModalProps> = ({ isOpen, onClose, onSendToChat, onGenerateTrack }) => {
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState('30s');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<{
    audioData: string;
    lyrics?: string;
    title?: string;
    modelUsed?: string;
  } | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [isOpen]);

  // Waveform canvas visualizer
  useEffect(() => {
    if (!isPlaying || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const bars = 36;
    
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = canvas.width / bars;
      
      for (let i = 0; i < bars; i++) {
        const height = Math.random() * (canvas.height * 0.85) + 5;
        const x = i * barWidth;
        const y = canvas.height - height;

        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, '#06b6d4');
        gradient.addColorStop(0.5, '#3b82f6');
        gradient.addColorStop(1, '#a855f7');

        ctx.fillStyle = gradient;
        ctx.fillRect(x + 1, y, barWidth - 2, height);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying]);

  if (!isOpen) return null;

  const handleSendDirectToChat = () => {
    if (!prompt.trim()) return;
    if (onSendToChat) {
      onSendToChat(prompt);
      onClose();
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setCurrentTrack(null);
    setIsPlaying(false);

    try {
      if (onGenerateTrack) {
        const result = await onGenerateTrack(prompt);
        if (result && result.audioData) {
          setCurrentTrack(result);
        }
      } else {
        const res = await fetch('/api/gemini/generate-music', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, duration })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setCurrentTrack({
              audioData: data.audioData,
              lyrics: data.lyrics,
              title: data.title || prompt,
              modelUsed: data.modelUsed
            });
          }
        }
      }
    } catch (err) {
      console.error("Music generation error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current || !currentTrack) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration || 1;
      setProgress((current / total) * 100);
    }
  };

  const handleDownload = () => {
    if (!currentTrack) return;
    const a = document.createElement('a');
    a.href = currentTrack.audioData;
    a.download = `${(currentTrack.title || 'nexus-track').replace(/\s+/g, '_')}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyLyrics = () => {
    if (!currentTrack?.lyrics) return;
    navigator.clipboard.writeText(currentTrack.lyrics);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="relative w-full max-w-4xl bg-zinc-950 border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden font-sans flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-500/20 bg-gradient-to-r from-cyan-950/40 via-zinc-950 to-purple-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Disc size={22} className="animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-zinc-100 tracking-wider font-mono">
                  NEXUS LYRIA 3 MUSIC STUDIO
                </h2>
                <span className="px-2 py-0.5 text-[10px] rounded bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-mono font-bold">
                  LYRIA PRO 3.0
                </span>
              </div>
              <p className="text-xs text-zinc-400">توليد وتخليق الموسيقى والأغاني بذكاء نيكسوس والنموذج الأحدث</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 flex items-center justify-center transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Prompt Input Section */}
          <div className="space-y-3">
            <label className="block text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">
              1. وصف المقطوعة / كلمات الأغنية المطلوبة (Prompt)
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="اكتب فكرة المقطوعة أو كلمات الأغنية (مثال: أغنية حماسية بعود وتوزيع إلكتروني عن الفضاء وذكاء نيكسوس)..."
              rows={3}
              className="w-full bg-zinc-900/90 border border-zinc-700/80 focus:border-cyan-500/80 rounded-xl p-4 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none transition font-sans"
            />
            
            {/* Quick Presets */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="text-[11px] font-mono text-zinc-500 flex items-center gap-1 self-center">
                <Sparkles size={12} className="text-cyan-400" /> مقترحات سريعة:
              </span>
              {PROMPT_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => setPrompt(preset)}
                  className="px-3 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-cyan-500/40 rounded-lg text-xs text-zinc-300 hover:text-cyan-300 transition text-right truncate max-w-[280px]"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Actions & Duration Selector */}
          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold mb-2">
                2. مدة المقطوعة
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: '30s', label: 'مقطع 30 ثانية (Clip)' },
                  { id: '60s', label: 'تراك كامل (Full Pro Track)' }
                ].map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setDuration(d.id)}
                    className={`py-2.5 px-3 rounded-xl border text-center text-xs transition ${
                      duration === d.id
                        ? 'bg-purple-950/40 border-purple-500 text-purple-300 font-bold'
                        : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons: Generate in Chat vs Direct Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleSendDirectToChat}
                disabled={!prompt.trim()}
                className={`py-3.5 px-4 rounded-xl font-bold font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-lg ${
                  !prompt.trim()
                    ? 'bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed'
                    : 'bg-cyan-600 hover:bg-cyan-500 text-white border border-cyan-400/50 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                }`}
              >
                <MessageSquare size={16} />
                <span>إرسال وتوليد في المحادثة المباشرة</span>
              </button>

              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className={`py-3.5 px-4 rounded-xl font-bold font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-lg ${
                  isGenerating || !prompt.trim()
                    ? 'bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white border border-purple-400/40 shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                }`}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw size={16} className="animate-spin text-purple-200" />
                    <span>جاري التوليد عبر Lyria 3...</span>
                  </>
                ) : (
                  <>
                    <Zap size={16} />
                    <span>معاينة وتوليد هنا</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Active Player Card */}
          {currentTrack && (
            <div className="bg-gradient-to-br from-zinc-900 via-black to-zinc-950 border border-cyan-500/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden space-y-4">
              <audio
                ref={audioRef}
                src={currentTrack.audioData}
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setIsPlaying(false)}
              />

              <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={togglePlay}
                    className="w-14 h-14 rounded-full bg-cyan-500 text-black flex items-center justify-center hover:scale-105 transition shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                  >
                    {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
                  </button>
                  <div>
                    <h3 className="text-base font-bold text-zinc-100 font-mono">
                      {currentTrack.title || 'NEXUS Lyria Composition'}
                    </h3>
                    <p className="text-xs text-cyan-400 font-mono">
                      Engine: {currentTrack.modelUsed || 'Lyria 3 Pro Engine'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 rounded-xl text-xs font-mono transition"
                  >
                    <Download size={14} />
                    <span>تحميل WAV</span>
                  </button>
                </div>
              </div>

              {/* Visualizer Canvas */}
              <div className="h-20 bg-black/60 rounded-xl overflow-hidden relative border border-zinc-800 flex items-center px-4">
                <canvas ref={canvasRef} width={600} height={70} className="w-full h-full" />
                {!isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-xs font-mono text-zinc-400">
                    اضغط تشغيل للاستماع والتفاعل مع الموجات الصونية
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-400 to-purple-500 h-full transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Lyrics & Output text */}
              {currentTrack.lyrics && (
                <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-4 text-xs font-sans text-zinc-300 space-y-2">
                  <div className="flex items-center justify-between text-zinc-400 font-mono border-b border-zinc-800 pb-2">
                    <span className="flex items-center gap-1">
                      <Music size={12} className="text-cyan-400" /> الكلمات والتحليل التخيلي للمقطوعة
                    </span>
                    <button
                      onClick={handleCopyLyrics}
                      className="text-zinc-400 hover:text-cyan-300 transition flex items-center gap-1"
                    >
                      {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      <span>{copied ? 'تم النسخ' : 'نسخ الكلمات'}</span>
                    </button>
                  </div>
                  <pre className="whitespace-pre-wrap font-sans text-zinc-200 leading-relaxed max-h-40 overflow-y-auto">
                    {currentTrack.lyrics}
                  </pre>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
