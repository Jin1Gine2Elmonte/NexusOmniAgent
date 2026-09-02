
import React, { useState } from 'react';
import { Message } from '../types';
import { User, Bot, BrainCircuit, Terminal, Sparkles, Copy, Check, FileText, Edit2, FileCode, FileImage, Paperclip, Eye, Network, Globe, ExternalLink, Play, Pause, Volume2, ChevronDown, ChevronUp, Aperture, Maximize2, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  message: Message;
  onEdit?: (content: string) => void;
  onViewMindMap?: (content: string) => void;
  onPlayAudio?: (messageId: string, content: string, base64?: string) => void;
  isPlaying?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = React.memo(({ message, onEdit, onViewMindMap, onPlayAudio, isPlaying }) => {
  const isUser = message.role === 'user';
  const [showThought, setShowThought] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadImage = (base64Data: string, filename: string) => {
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${base64Data}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('image')) return <FileImage size={14} />;
    if (mimeType.includes('pdf')) return <FileText size={14} />;
    if (mimeType.includes('code') || mimeType.includes('javascript') || mimeType.includes('html')) return <FileCode size={14} />;
    return <Paperclip size={14} />;
  };

  const hasGrounding = message.groundingMetadata?.groundingChunks && message.groundingMetadata.groundingChunks.length > 0;

  return (
    <div className={`flex w-full mb-8 ${isUser ? 'justify-start' : 'justify-start'} group`}>
      <div className={`
        flex max-w-4xl w-full gap-5
        ${isUser ? 'flex-row-reverse' : 'flex-row'}
      `}>
        {/* Avatar */}
        <div className={`
            flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center border
            ${isUser 
                ? 'bg-zinc-900/50 border-zinc-700 text-zinc-400' 
                : 'bg-gradient-to-br from-emerald-900/20 to-teal-900/20 border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]'}
        `}>
          {isUser ? <User size={22} /> : <Bot size={22} />}
        </div>

        {/* Content */}
        <div className={`flex flex-col gap-2 w-full min-w-0 ${isUser ? 'items-end' : 'items-start'}`}>
            <div className="flex items-center gap-2 text-xs font-mono opacity-70 mb-1 flex-wrap">
                <span className={isUser ? 'text-zinc-400' : 'text-emerald-500 font-bold tracking-wide'}>
                    {isUser ? 'USER::INPUT' : 'NEXUS::EVOLVED_ENTITY'}
                </span>
                {!isUser && message.actualModelUsed && (
                    <span className={`px-2 py-0.5 text-[9px] rounded font-mono font-semibold uppercase tracking-wider ${
                        message.actualModelUsed.includes('kimi-k3')
                        ? 'bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.1)]'
                        : 'bg-emerald-950/40 border border-emerald-500/20 text-emerald-400'
                    }`}>
                        {message.actualModelUsed.includes('kimi-k3') 
                            ? `NEXUS K3 // ${message.actualModelUsed.replace('kimi-k3 (resolved via ', '').replace(')', '').toUpperCase()}` 
                            : message.actualModelUsed.toUpperCase()}
                    </span>
                )}
                <span className="text-zinc-600 text-[10px]">{new Date(message.timestamp).toLocaleTimeString()}</span>
            </div>

            {/* Attachments (If any) */}
            {message.attachments && message.attachments.length > 0 && (
              <div className={`flex flex-wrap gap-2 mb-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
                {message.attachments.map((file) => (
                  <div key={file.id} className="flex items-center gap-2 px-3 py-2 bg-zinc-900/80 border border-zinc-700/50 rounded-lg text-xs text-zinc-300 max-w-[200px]">
                    <span className="text-emerald-500">{getFileIcon(file.mimeType)}</span>
                    <span className="truncate font-mono">{file.name}</span>
                  </div>
                ))}
              </div>
            )}
            
            {/* Thinking Process Block */}
            {!isUser && message.isThinking && (
                 <div className="w-full max-w-2xl">
                     <div className="flex items-center border-t border-x border-emerald-500/20 rounded-t-lg overflow-hidden bg-zinc-900/30">
                         {/* Main Toggle */}
                         <button 
                            onClick={() => setShowThought(!showThought)}
                            className={`
                                flex items-center gap-2 text-xs px-4 py-2 transition-all flex-1 text-left
                                ${showThought 
                                    ? 'text-emerald-400 bg-zinc-900' 
                                    : 'text-zinc-500 hover:text-emerald-400 hover:bg-zinc-900/80'}
                            `}
                         >
                            <BrainCircuit size={14} className={showThought ? "animate-pulse" : ""} />
                            <span className="font-mono uppercase tracking-wider font-bold">
                                QUANTUM MIND-MAP
                            </span>
                         </button>
                         
                         {/* VISUALIZE BUTTON - High Visibility */}
                         {onViewMindMap && (
                             <button
                                onClick={() => onViewMindMap(message.content)}
                                className="flex items-center gap-2 text-[10px] px-3 py-2 bg-emerald-500/10 text-emerald-400 border-l border-r border-emerald-500/20 hover:bg-emerald-500/20 hover:text-emerald-300 transition-all font-mono uppercase tracking-wide font-bold group/eye"
                             >
                                 <Network size={14} className="group-hover/eye:rotate-180 transition-transform duration-700" />
                                 <span className="hidden sm:inline">OPEN CORTEX</span>
                             </button>
                         )}
                         
                         {/* Collapse Chevron */}
                         <button 
                            onClick={() => setShowThought(!showThought)}
                            className="px-3 py-2 text-zinc-500 hover:text-white hover:bg-zinc-900/80 transition-colors"
                         >
                            {showThought ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                         </button>
                     </div>
                     
                     {showThought && (
                        <div className="bg-black border-x border-b border-emerald-500/20 rounded-b-lg p-5 text-xs font-mono text-zinc-400 overflow-hidden relative">
                             {/* Code-like look */}
                             <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/20"></div>
                             <div className="flex items-center gap-2 mb-3 text-emerald-600 border-b border-emerald-900/30 pb-2">
                                 <Terminal size={12} />
                                 <span>EXECUTION_LOG::COGNITIVE_MATRIX</span>
                             </div>
                             <div className="whitespace-pre-wrap leading-relaxed opacity-90 prose prose-invert prose-sm max-w-none prose-headings:text-emerald-400 prose-headings:font-bold prose-headings:uppercase prose-headings:tracking-widest prose-headings:text-xs prose-headings:border-b prose-headings:border-zinc-800 prose-headings:pb-1 prose-headings:mb-2 prose-ul:mt-1 prose-li:my-0.5">
                                <ReactMarkdown>{message.content}</ReactMarkdown>
                             </div>
                        </div>
                     )}
                     {!showThought && (
                        <div className="h-0.5 w-full bg-gradient-to-r from-emerald-500/0 via-emerald-500/30 to-emerald-500/0"></div>
                     )}
                 </div>
            )}
            
            {/* GENERATED VISUAL ARTIFACT (The Prism Output) */}
            {message.generatedImage && (
                <div className="w-full max-w-xl mb-3 relative group/image">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-lg opacity-30 blur-sm group-hover/image:opacity-60 transition duration-700"></div>
                    <div className="relative bg-black rounded-lg border border-white/10 overflow-hidden">
                        {/* Header */}
                        <div className="h-8 bg-black/80 backdrop-blur border-b border-white/10 flex items-center justify-between px-3">
                            <div className="flex items-center gap-2 text-[10px] font-mono text-pink-400 uppercase tracking-widest">
                                <Aperture size={12} className="animate-spin-slow" />
                                Prism Visual Artifact
                            </div>
                            <div className="flex items-center gap-2">
                                {message.imagePrompt && (
                                    <button 
                                        onClick={() => handleCopy(message.imagePrompt!)}
                                        className="text-zinc-500 hover:text-emerald-400 transition-colors"
                                        title="Copy Prompt"
                                    >
                                        <Copy size={12} />
                                    </button>
                                )}
                                <button 
                                    onClick={() => handleDownloadImage(message.generatedImage!, `nexus-prism-${message.timestamp}.png`)}
                                    className="text-zinc-500 hover:text-emerald-400 transition-colors"
                                    title="Download Artifact"
                                >
                                    <Download size={12} />
                                </button>
                                <button className="text-zinc-500 hover:text-white"><Maximize2 size={12} /></button>
                            </div>
                        </div>
                        {/* Image */}
                        <div className="relative aspect-video">
                            <img 
                                src={`data:image/png;base64,${message.generatedImage}`} 
                                alt="Nexus Visual" 
                                className="w-full h-full object-cover"
                            />
                            {/* Overlay Scanlines */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20"></div>
                        </div>
                    </div>
                </div>
            )}

            {/* GENERATED MUSIC ARTIFACT (Lyria Audio Output) */}
            {message.audioData && (
                <div className="w-full max-w-xl mb-3 relative group/music">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-xl opacity-30 blur-sm group-hover/music:opacity-60 transition duration-700"></div>
                    <div className="relative bg-black rounded-xl border border-cyan-500/30 overflow-hidden p-4 space-y-3">
                        <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
                            <span className="flex items-center gap-2 uppercase tracking-widest font-bold">
                                <Volume2 size={14} className="animate-pulse text-cyan-300" />
                                Lyria 3 Music Composition Artifact
                            </span>
                            <span className="text-[10px] text-zinc-500 font-mono">Audio Signal Active</span>
                        </div>
                        <audio controls src={message.audioData} className="w-full h-10 rounded-lg filter invert dark:invert-0" />
                    </div>
                </div>
            )}

            {/* Main Content Bubble */}
            {(!message.isThinking) && (
                <div className={`
                    relative px-6 py-5 rounded-2xl text-sm leading-7 shadow-sm break-words w-full overflow-hidden border group-bubble
                    ${isUser 
                        ? 'bg-zinc-800/80 border-zinc-700 text-zinc-100 rounded-tr-sm' 
                        : 'bg-zinc-900/40 border-zinc-800 text-zinc-200 rounded-tl-sm shadow-[0_4px_20px_rgba(0,0,0,0.2)]'}
                `}>
                    {!isUser && <Sparkles size={14} className="absolute top-4 left-4 text-emerald-500/20" />}
                    
                    <div className="prose prose-invert prose-sm max-w-none font-arabic">
                        <ReactMarkdown 
                            components={{
                                code({node, className, children, ...props}: any) {
                                    const match = /language-(\w+)/.exec(className || '');
                                    const lang = match ? match[1] : '';
                                    const codeText = String(children).replace(/\n$/, '');

                                    // In react-markdown v9+, we check for 'match' or if it has newlines to determine if it's a block
                                    const isBlock = match || String(children).includes('\n');

                                    if (isBlock) {
                                        return (
                                            <div className="my-4 rounded-lg border border-zinc-700 overflow-hidden bg-[#0d0d10]">
                                                {/* Professional Code Header */}
                                                <div className="flex items-center justify-between px-3 py-2 bg-[#18181b] border-b border-zinc-700">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex gap-1.5">
                                                            <div className="w-2.5 h-2.5 rounded-full bg-zinc-600/50"></div>
                                                            <div className="w-2.5 h-2.5 rounded-full bg-zinc-600/50"></div>
                                                            <div className="w-2.5 h-2.5 rounded-full bg-zinc-600/50"></div>
                                                        </div>
                                                        <span className="text-[10px] font-mono text-zinc-400 uppercase ml-2">{lang || 'text'}</span>
                                                    </div>
                                                    <button 
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(codeText);
                                                        }}
                                                        className="flex items-center gap-1 text-[10px] text-zinc-400 hover:text-emerald-400 transition font-mono uppercase group/btn"
                                                    >
                                                        <Copy size={12} />
                                                        <span className="group-hover/btn:underline">Copy Code</span>
                                                    </button>
                                                </div>
                                                
                                                <div className="p-4 overflow-x-auto font-mono text-xs leading-relaxed text-zinc-300">
                                                    <code className={className} {...props}>
                                                        {children}
                                                    </code>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return (
                                        <code {...props} className="bg-zinc-800/80 px-1.5 py-0.5 rounded text-emerald-300 font-mono text-xs border border-zinc-700/50">
                                            {children}
                                        </code>
                                    )
                                }
                            }}
                        >
                            {message.content}
                        </ReactMarkdown>
                    </div>

                    {/* Grounding Sources (Google Search) */}
                    {hasGrounding && (
                        <div className="mt-6 border-t border-zinc-700/50 pt-3">
                             <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono mb-2 uppercase tracking-wider">
                                 <Globe size={12} className="text-blue-400" />
                                 <span>Nexus Knowledge Graph</span>
                             </div>
                             <div className="flex flex-wrap gap-2">
                                 {message.groundingMetadata?.groundingChunks.map((chunk, idx) => chunk.web ? (
                                     <a 
                                        key={idx} 
                                        href={chunk.web.uri} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800/50 hover:bg-zinc-700 border border-zinc-700 hover:border-blue-500/50 rounded-lg text-[10px] text-zinc-300 hover:text-blue-300 transition-all group/link"
                                     >
                                         <span className="max-w-[150px] truncate">{chunk.web.title}</span>
                                         <ExternalLink size={10} className="opacity-50 group-hover/link:opacity-100" />
                                     </a>
                                 ) : null)}
                             </div>
                        </div>
                    )}

                    {/* Message Actions */}
                    <div className="flex justify-end items-center gap-3 mt-4 pt-3 border-t border-zinc-800/50 opacity-0 group-hover:opacity-100 transition-opacity">
                        {onPlayAudio && (
                             <button
                                onClick={() => onPlayAudio(message.id, message.content, message.audioData)}
                                className={`
                                    flex items-center gap-1 text-[10px] font-mono uppercase transition
                                    ${isPlaying ? 'text-amber-400 animate-pulse' : 'text-zinc-500 hover:text-amber-400'}
                                `}
                             >
                                 {isPlaying ? <Pause size={10} /> : <Play size={10} />}
                                 {isPlaying ? 'Broadcasting...' : 'Play Neural Voice'}
                             </button>
                        )}
                        {isUser && onEdit && (
                            <button 
                                onClick={() => onEdit(message.content)}
                                className="text-zinc-500 hover:text-emerald-400 transition flex items-center gap-1 text-[10px] font-mono uppercase"
                            >
                                <Edit2 size={10} /> Edit
                            </button>
                        )}
                        <button 
                            className="text-zinc-500 hover:text-white transition flex items-center gap-1 text-[10px] font-mono uppercase"
                            onClick={() => handleCopy(message.content)}
                        >
                            {copied ? <Check size={10} className="text-emerald-500" /> : <Copy size={10} />}
                            {copied ? <span className="text-emerald-500">Copied</span> : 'Copy Text'}
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
});

export default ChatMessage;
