import React, { useState } from 'react';
import { X, Download, Maximize2, Aperture, Grid, Calendar, MessageSquare, Image as ImageIcon } from 'lucide-react';
import { SessionsMap, Session } from '../types';

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: SessionsMap;
}

const GalleryModal: React.FC<GalleryModalProps> = ({ isOpen, onClose, sessions }) => {
  const [selectedImage, setSelectedImage] = useState<{ src: string, prompt: string, date: string, sessionTitle: string } | null>(null);

  if (!isOpen) return null;

  // 1. EXTRACT ARTIFACTS
  // Scan the entire memory matrix for visual data
  const artifacts: Array<{
      id: string;
      src: string;
      prompt: string; // We use message content as context
      date: number;
      sessionId: string;
      sessionTitle: string;
  }> = [];

  Object.values(sessions).forEach((session: Session) => {
      session.messages.forEach(msg => {
          if (msg.generatedImage) {
              // Find the user prompt that likely triggered this (usually the message before)
              // But strictly, the image is attached to the model message.
              // We'll use the model's text (if any) or a generic label.
              artifacts.push({
                  id: msg.id,
                  src: `data:image/png;base64,${msg.generatedImage}`,
                  prompt: msg.content.substring(0, 100) + "...",
                  date: msg.timestamp,
                  sessionId: session.id,
                  sessionTitle: session.title
              });
          }
      });
  });

  // Sort by newest
  artifacts.sort((a, b) => b.date - a.date);

  const handleDownload = (src: string, id: string) => {
      const link = document.createElement('a');
      link.href = src;
      link.download = `nexus_artifact_${id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/98 backdrop-blur-xl animate-in fade-in duration-500 font-arabic">
      
      {/* FULLSCREEN PREVIEW */}
      {selectedImage && (
          <div className="absolute inset-0 z-[60] bg-black/95 flex items-center justify-center p-4 md:p-10 animate-in zoom-in-95 duration-200" onClick={() => setSelectedImage(null)}>
              <div className="relative max-w-7xl max-h-full flex flex-col items-center" onClick={e => e.stopPropagation()}>
                  <img src={selectedImage.src} alt="Artifact" className="max-h-[85vh] w-auto rounded border border-white/10 shadow-[0_0_100px_rgba(255,0,255,0.1)]" />
                  <div className="mt-4 flex items-center gap-6 text-zinc-400">
                      <div className="flex flex-col text-sm">
                          <span className="text-white font-mono">{selectedImage.sessionTitle}</span>
                          <span className="text-xs font-mono opacity-50">{selectedImage.date}</span>
                      </div>
                      <button 
                        onClick={() => handleDownload(selectedImage.src, Date.now().toString())}
                        className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition"
                      >
                          <Download size={20} />
                      </button>
                      <button onClick={() => setSelectedImage(null)} className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition">
                          <X size={20} />
                      </button>
                  </div>
              </div>
          </div>
      )}

      <div className="w-full h-full flex flex-col relative bg-[#050505]">
         {/* HEADER */}
         <div className="h-20 border-b border-zinc-800 flex items-center justify-between px-6 md:px-10 bg-zinc-900/30">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.2)]">
                    <Aperture size={20} className="animate-spin-slow" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                        THE PRISM VAULT
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-900/30 text-pink-400 border border-pink-500/20 font-mono">
                            {artifacts.length} ARTIFACTS
                        </span>
                    </h2>
                    <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest">Visual Manifestation Archive</p>
                </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition">
                <X size={24} />
            </button>
         </div>

         {/* GRID */}
         <div className="flex-1 overflow-y-auto p-6 md:p-10 scrollbar-hide">
             {artifacts.length === 0 ? (
                 <div className="h-full flex flex-col items-center justify-center text-zinc-600 space-y-4">
                     <ImageIcon size={48} className="opacity-20" />
                     <p className="font-mono text-sm">THE VAULT IS EMPTY.</p>
                     <p className="text-xs opacity-50 max-w-md text-center">Ask Nexus to "generate an image" or "visualize this" to populate the Prism Archive.</p>
                 </div>
             ) : (
                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                     {artifacts.map((art) => (
                         <div 
                            key={art.id} 
                            className="group relative aspect-video bg-zinc-900 rounded border border-zinc-800 overflow-hidden cursor-pointer hover:border-pink-500/50 transition-all hover:shadow-[0_0_30px_rgba(236,72,153,0.15)]"
                            onClick={() => setSelectedImage({
                                src: art.src,
                                prompt: art.prompt,
                                date: new Date(art.date).toLocaleDateString(),
                                sessionTitle: art.sessionTitle
                            })}
                         >
                             <img 
                                src={art.src} 
                                alt="Artifact" 
                                className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-500" 
                             />
                             
                             {/* Overlay Info */}
                             <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                                 <div className="flex justify-between items-end">
                                     <div>
                                        <p className="text-[10px] text-pink-400 font-mono font-bold truncate max-w-[150px]">
                                            {art.sessionTitle}
                                        </p>
                                        <p className="text-[9px] text-zinc-500 font-mono">
                                            {new Date(art.date).toLocaleDateString()}
                                        </p>
                                     </div>
                                     <button 
                                        className="p-1.5 bg-white/10 hover:bg-white/20 rounded text-white backdrop-blur-sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDownload(art.src, art.id);
                                        }}
                                     >
                                         <Download size={14} />
                                     </button>
                                 </div>
                             </div>

                             {/* Corner Accent */}
                             <div className="absolute top-0 right-0 p-1">
                                 <div className="w-1.5 h-1.5 bg-pink-500 rounded-full shadow-[0_0_10px_#ec4899] opacity-0 group-hover:opacity-100"></div>
                             </div>
                         </div>
                     ))}
                 </div>
             )}
         </div>
      </div>
    </div>
  );
};

export default GalleryModal;