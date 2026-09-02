import React from 'react';
import { X, Database, Network, BookOpen } from 'lucide-react';
import { PaleArchive } from '../types';

interface PaleArchiveModalProps {
    isOpen: boolean;
    onClose: () => void;
    archive: PaleArchive;
}

const PaleArchiveModal: React.FC<PaleArchiveModalProps> = ({ isOpen, onClose, archive }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-[#09090b] border border-zinc-800 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl shadow-emerald-900/20">
                
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/10 rounded-lg">
                            <BookOpen size={20} className="text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="text-emerald-400 font-mono text-sm uppercase tracking-widest font-bold">The Pale Archive</h2>
                            <p className="text-xs text-zinc-500 font-mono">Quantum Knowledge Graph</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
                    {/* Entities */}
                    <div>
                        <h3 className="text-zinc-400 text-xs uppercase tracking-widest mb-4 flex items-center gap-2 font-mono">
                            <Database size={14} className="text-emerald-500" /> 
                            Extracted Entities ({archive.entities.length})
                        </h3>
                        {archive.entities.length === 0 ? (
                            <div className="p-8 text-center border border-dashed border-zinc-800 rounded-xl text-zinc-600 font-mono text-sm">
                                The Archive is empty. Awaiting data crystallization.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {archive.entities.map(e => (
                                    <div key={e.id} className="p-4 bg-zinc-900/30 border border-zinc-800/50 rounded-xl hover:border-emerald-500/30 transition-colors group">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-emerald-300 font-medium text-sm">{e.name}</span>
                                            <span className="text-[9px] text-zinc-500 uppercase px-2 py-0.5 bg-zinc-800 rounded font-mono">{e.type}</span>
                                        </div>
                                        <p className="text-xs text-zinc-400 leading-relaxed">{e.description}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Relationships */}
                    {archive.relationships.length > 0 && (
                        <div>
                            <h3 className="text-zinc-400 text-xs uppercase tracking-widest mb-4 flex items-center gap-2 font-mono">
                                <Network size={14} className="text-emerald-500" /> 
                                Quantum Threads ({archive.relationships.length})
                            </h3>
                            <div className="space-y-2">
                                {archive.relationships.map((r, i) => {
                                    const source = archive.entities.find(e => e.id === r.sourceId)?.name || r.sourceId;
                                    const target = archive.entities.find(e => e.id === r.targetId)?.name || r.targetId;
                                    return (
                                        <div key={i} className="p-3 bg-zinc-900/30 border border-zinc-800/50 rounded-lg flex items-center gap-3 text-sm">
                                            <span className="text-zinc-300 font-medium">{source}</span>
                                            <span className="text-[10px] text-emerald-500 uppercase px-2 py-1 bg-emerald-950/30 rounded border border-emerald-500/20 font-mono flex-1 text-center">
                                                {r.relationType}
                                            </span>
                                            <span className="text-zinc-300 font-medium">{target}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaleArchiveModal;
