
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { X, Activity, GitBranch, Zap, Brain, Network, Share2, Layers, Archive, EyeOff, Merge, Ban, Fingerprint, History, RefreshCw, Search, Sparkles, Hexagon, Anchor, Ghost } from 'lucide-react';
import { NodeStatus } from '../types';

interface MindMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  thoughtContent: string;
}

interface GraphNode extends NodeStatus {
  text: string;
  size: number;
  type: 'core' | 'major' | 'minor' | 'ghost' | 'axiom';
  opacity: number;
  pulseDelay: number;
  mass: number; // Physics mass
}

const MindMapModal: React.FC<MindMapModalProps> = ({ isOpen, onClose, thoughtContent }) => {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isSimulating, setIsSimulating] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);
  
  // Physics Simulation State
  const nodesRef = useRef<GraphNode[]>([]);

  // Track Mouse for Repulsion Effect
  const handleMouseMove = (e: React.MouseEvent) => {
      if (canvasRef.current) {
          const rect = canvasRef.current.getBoundingClientRect();
          setMousePos({
              x: ((e.clientX - rect.left) / rect.width) * 100,
              y: ((e.clientY - rect.top) / rect.height) * 100
          });
      }
  };

  // Initialize The Archive
  useEffect(() => {
    if (isOpen) {
      const newNodes: GraphNode[] = [];
      
      // 1. The Core (The Singularity)
      newNodes.push({ 
        id: 0, 
        text: "NEXUS::SINGULARITY", 
        x: 50, y: 50, vx: 0, vy: 0,
        size: 40, 
        type: 'core', 
        opacity: 1,
        pulseDelay: 0,
        mass: 100, // Immovable object
        layer: 'BEDROCK_ARCHIVE', 
        status: 'manifesting', 
        intensity: 1
      });

      // 2. Parse Thought Content into "Fragments"
      const lines = thoughtContent ? thoughtContent.split('\n').filter(l => l.trim().length > 3) : ["Initializing Archive...", "Scanning Ghost Paths...", "Accessing Pale Archive..."];
      
      // Create chaotic distribution
      lines.slice(0, 40).forEach((line, i) => {
        const cleanText = line.replace(/[*#-]/g, '').trim().substring(0, 50);
        
        // DETERMINE NODE TYPE
        const isAxiom = line.includes('**') || line.includes('Step') || line.includes('Rule') || line.length > 60;
        const isGhost = Math.random() > 0.85 || line.includes('?');
        const isMajor = !isGhost && !isAxiom && Math.random() > 0.7;
        
        // Random starting position (exploded from center)
        const angle = Math.random() * Math.PI * 2;
        const dist = 15 + Math.random() * 35; // Distance from center 15-50%
        
        newNodes.push({
          id: i + 1,
          text: cleanText + (isGhost ? " [FRAG_ERR]" : ""),
          x: 50 + Math.cos(angle) * dist,
          y: 50 + Math.sin(angle) * dist,
          vx: (Math.random() - 0.5) * 0.05,
          vy: (Math.random() - 0.5) * 0.05,
          // Properties based on Type
          size: isAxiom ? 20 : isGhost ? 6 : isMajor ? 12 : 8,
          type: isAxiom ? 'axiom' : isGhost ? 'ghost' : isMajor ? 'major' : 'minor',
          opacity: isGhost ? 0.3 : 0.9,
          pulseDelay: Math.random() * 5,
          mass: isAxiom ? 5 : isGhost ? 0.5 : 1, // Axioms are heavy, Ghosts are light
          layer: 'BEDROCK_ARCHIVE', 
          status: 'active', 
          intensity: Math.random()
        });
      });
      
      nodesRef.current = newNodes;
      setNodes(newNodes);
      setIsSimulating(true);
    } else {
        setIsSimulating(false);
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
  }, [isOpen, thoughtContent]);

  // Physics Loop (Organic Drift + Interactions)
  const animate = useCallback(() => {
    if (!isSimulating) return;

    const updatedNodes = nodesRef.current.map(node => {
        if (node.id === 0) return node; // Core is static in position

        // 1. Base Drift
        let vx = (node.vx || 0);
        let vy = (node.vy || 0);

        // Ghost Nodes Jitter (Chaos)
        if (node.type === 'ghost') {
            vx += (Math.random() - 0.5) * 0.02;
            vy += (Math.random() - 0.5) * 0.02;
        }

        // 2. Gravitational Pull to Center
        // Axioms resist gravity more (they are stable truths)
        const gravityStrength = node.type === 'axiom' ? 0.00005 : 0.0001; 
        const dx = 50 - (node.x || 50);
        const dy = 50 - (node.y || 50);
        const distToCenter = Math.sqrt(dx*dx + dy*dy);
        
        if (distToCenter > 10) {
            vx += dx * gravityStrength;
            vy += dy * gravityStrength;
        }

        // 3. Mouse Repulsion (The Observer Effect)
        // Nodes flee from user interaction
        const mdx = (node.x || 0) - mousePos.x;
        const mdy = (node.y || 0) - mousePos.y;
        const mouseDist = Math.sqrt(mdx*mdx + mdy*mdy);
        if (mouseDist < 15) {
            const force = (15 - mouseDist) * 0.002;
            vx += (mdx / mouseDist) * force;
            vy += (mdy / mouseDist) * force;
        }

        // 4. Node Repulsion (Social Distancing)
        // Axioms push others away strongly
        nodesRef.current.forEach(other => {
            if (other.id !== node.id) {
                const odx = (node.x || 0) - (other.x || 0);
                const ody = (node.y || 0) - (other.y || 0);
                const odist = Math.sqrt(odx*odx + ody*ody);
                const minDist = (node.size + other.size) / 5; // Simplified collision radius
                
                if (odist < minDist && odist > 0) {
                    const pushFactor = node.type === 'axiom' ? 0.01 : 0.002;
                    vx += (odx / odist) * pushFactor;
                    vy += (ody / odist) * pushFactor;
                }
            }
        });

        // 5. Apply Velocity & Damping
        // Heavy objects (Axioms) have more friction
        const friction = node.type === 'axiom' ? 0.90 : node.type === 'ghost' ? 0.99 : 0.95;
        node.vx = vx * friction;
        node.vy = vy * friction;

        let newX = (node.x || 50) + node.vx;
        let newY = (node.y || 50) + node.vy;

        // Boundary containment
        if (newX < 5) newX = 5; if (newX > 95) newX = 95;
        if (newY < 5) newY = 5; if (newY > 95) newY = 95;

        return { ...node, x: newX, y: newY };
    });

    nodesRef.current = updatedNodes;
    setNodes([...updatedNodes]); // Trigger render
    requestRef.current = requestAnimationFrame(animate);
  }, [isSimulating, mousePos]);

  useEffect(() => {
    if (isSimulating) {
        requestRef.current = requestAnimationFrame(animate);
    }
    return () => {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isSimulating, animate]);


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in duration-500">
      <div className="w-[98vw] h-[95vh] bg-[#020305] border border-[#1f2e1f]/30 rounded-2xl relative overflow-hidden flex flex-col shadow-[0_0_150px_rgba(0,0,0,1)]">
        
        {/* --- THE ABYSS LAYERS --- */}
        
        {/* 1. The Void Texture */}
        <div className="absolute inset-0 opacity-[0.15] pointer-events-none" 
             style={{
                 backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
             }}>
        </div>
        
        {/* 2. Moving Grid (Parallax) */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none cyber-grid animate-pulse" style={{ animationDuration: '8s' }}></div>

        {/* 3. Header: The Terminal Interface */}
        <div className="h-16 border-b border-[#1f2e1f]/50 flex items-center justify-between px-6 bg-[#050a05]/90 backdrop-blur-md relative z-20">
           <div className="flex items-center gap-6">
               <div className="flex flex-col">
                   <h2 className="text-[#dcfce7] font-mono tracking-[0.2em] text-xl font-bold uppercase flex items-center gap-2">
                       <Archive className="text-emerald-500" size={18} />
                       The Pale Archive
                   </h2>
                   <span className="text-[10px] text-emerald-500/50 font-mono">PALE ARCHIVE // DEPTH: SILENT</span>
               </div>
               
               {/* Search Simulation */}
               <div className="hidden md:flex items-center gap-2 bg-black/50 border border-emerald-900/50 rounded px-3 py-1.5 w-64">
                   <Search size={12} className="text-emerald-700" />
                   <div className="h-3 w-px bg-emerald-900/50"></div>
                   <span className="text-[10px] font-mono text-emerald-500/70 animate-pulse">Querying Dead Timelines...</span>
               </div>
           </div>

           <button onClick={onClose} className="p-2 hover:bg-emerald-900/20 rounded-full text-emerald-500/70 hover:text-emerald-400 transition-colors">
               <X size={24} />
           </button>
        </div>

        {/* 4. Main Canvas: The Floating Void */}
        <div 
            className="flex-1 relative overflow-hidden cursor-crosshair" 
            ref={canvasRef} 
            onMouseMove={handleMouseMove}
            onClick={() => setSelectedNode(null)}
        >
            
            {/* Background Halo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-900/5 rounded-full blur-[100px] animate-pulse"></div>

            {/* Connecting Synapses (Dynamic Lines) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                {nodes.map((node, i) => (
                    // Connect close nodes to create "Constellations"
                    nodes.map((other, j) => {
                        if (i >= j) return null; // Avoid duplicates
                        
                        // Don't connect ghosts to axioms (Logic vs Chaos)
                        if ((node.type === 'ghost' && other.type === 'axiom') || (node.type === 'axiom' && other.type === 'ghost')) return null;

                        const dx = (node.x || 0) - (other.x || 0);
                        const dy = (node.y || 0) - (other.y || 0);
                        const dist = Math.sqrt(dx*dx + dy*dy);
                        const maxDist = 20;
                        
                        if (dist < maxDist) { // Only connect if close
                            const isAxiomLink = node.type === 'axiom' || other.type === 'axiom';
                            const isGhostLink = node.type === 'ghost' || other.type === 'ghost';
                            
                            return (
                                <line 
                                    key={`link-${i}-${j}`}
                                    x1={`${node.x}%`} y1={`${node.y}%`} 
                                    x2={`${other.x}%`} y2={`${other.y}%`} 
                                    stroke={isAxiomLink ? '#fbbf24' : isGhostLink ? '#3f3f46' : '#10b981'} 
                                    strokeWidth={isAxiomLink ? 0.8 : 0.4 * (1 - dist/maxDist)}
                                    strokeOpacity={0.4 * (1 - dist/maxDist)}
                                    strokeDasharray={isGhostLink ? "2,2" : ""}
                                />
                            );
                        }
                        return null;
                    })
                ))}
            </svg>

            {/* The Nodes (Floating Thoughts) */}
            {nodes.map((node) => (
                <div
                    key={node.id}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 z-10 flex flex-col items-center justify-center group
                        ${node.type === 'core' ? 'z-50' : ''}
                        ${node.type === 'axiom' ? 'z-40' : ''}
                    `}
                    style={{
                        left: `${node.x}%`,
                        top: `${node.y}%`,
                        opacity: node.opacity
                    }}
                    onClick={(e) => { e.stopPropagation(); setSelectedNode(node.id); }}
                >
                    {/* The Particle Itself */}
                    <div className={`
                        relative transition-all duration-300 flex items-center justify-center
                        ${node.type === 'core' ? 'w-20 h-20' : ''}
                        ${node.type === 'axiom' ? 'w-6 h-6 rotate-45 bg-[#0a0a00] border border-amber-500/80 shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:scale-125 hover:bg-amber-900' : ''}
                        ${node.type === 'major' ? 'w-4 h-4 rounded-full bg-zinc-900 border border-emerald-500/50 hover:scale-125 hover:bg-emerald-500' : ''}
                        ${node.type === 'minor' ? 'w-2 h-2 rounded-full bg-zinc-800 hover:scale-150 hover:bg-emerald-400' : ''}
                        ${node.type === 'ghost' ? 'w-1.5 h-1.5 rounded-sm bg-zinc-600 animate-pulse hover:bg-red-500' : ''}
                    `}>
                        
                        {/* 1. CORE VISUALS (The Singularity) */}
                        {node.type === 'core' && (
                             <>
                                {/* Event Horizon (Black Hole) */}
                                <div className="absolute inset-2 bg-black rounded-full border border-emerald-500/30 z-20 flex items-center justify-center shadow-[inset_0_0_20px_rgba(16,185,129,0.2)]">
                                     <Fingerprint size={32} className="text-emerald-400 opacity-80" />
                                </div>
                                {/* Spinning Accretion Disk */}
                                <div className="absolute inset-0 rounded-full border-2 border-dashed border-emerald-500/20 animate-[spin_10s_linear_infinite]"></div>
                                {/* Outer Gravity Ring */}
                                <div className="absolute -inset-4 rounded-full border border-emerald-500/10 animate-[spin_15s_linear_infinite_reverse]"></div>
                                {/* Pulse */}
                                <div className="absolute inset-0 rounded-full bg-emerald-500/5 animate-ping"></div>
                             </>
                        )}

                        {/* 2. AXIOM VISUALS (The Anchor) */}
                        {node.type === 'axiom' && (
                            <Anchor size={12} className="text-amber-500 -rotate-45" />
                        )}

                        {/* 3. GHOST VISUALS (The Glitch) */}
                        {node.type === 'ghost' && (
                            <div className="absolute inset-0 bg-red-500/20 blur-[1px] animate-pulse"></div>
                        )}

                    </div>

                    {/* The Label (Reveals on Hover or Select) */}
                    <div className={`
                        mt-4 px-3 py-1.5 bg-black/90 border backdrop-blur rounded text-[10px] font-mono whitespace-nowrap pointer-events-none transition-all duration-300 z-50 shadow-xl
                        ${node.type === 'core' ? 'block border-emerald-500/50 text-emerald-100 scale-100' : ''}
                        ${node.type === 'axiom' ? 'border-amber-500/50 text-amber-100' : 'border-emerald-900/50 text-emerald-100'}
                        ${node.type === 'ghost' ? 'text-zinc-500 border-zinc-800 italic' : ''}
                        ${selectedNode === node.id ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'}
                    `}>
                        {node.text}
                    </div>
                </div>
            ))}

            {/* Selected Node Inspector (Bottom Panel) */}
            {selectedNode !== null && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-96 bg-black/95 border border-emerald-500/30 p-4 rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur animate-in slide-in-from-bottom-4 z-50">
                     <div className="flex items-start justify-between mb-2">
                         <div className="flex items-center gap-2 font-mono text-xs uppercase">
                             {nodes.find(n => n.id === selectedNode)?.type === 'axiom' ? (
                                 <span className="text-amber-400 flex items-center gap-2"><Anchor size={12}/> Axiom Node (Immutable)</span>
                             ) : nodes.find(n => n.id === selectedNode)?.type === 'ghost' ? (
                                 <span className="text-zinc-500 flex items-center gap-2"><Ghost size={12}/> Ghost Fragment (Corrupted)</span>
                             ) : (
                                 <span className="text-emerald-400 flex items-center gap-2"><Hexagon size={12}/> Active Fragment</span>
                             )}
                         </div>
                         <button onClick={() => setSelectedNode(null)} className="text-zinc-500 hover:text-emerald-400"><X size={12}/></button>
                     </div>
                     <p className="text-zinc-300 text-xs font-mono leading-relaxed border-l-2 border-emerald-900 pl-3">
                         "{nodes.find(n => n.id === selectedNode)?.text}"
                     </p>
                     
                     {/* Node Actions */}
                     <div className="mt-4 flex gap-2">
                         <button className="flex-1 bg-emerald-900/20 hover:bg-emerald-900/40 text-emerald-400 text-[10px] py-1.5 rounded border border-emerald-500/20 font-mono uppercase transition-colors">
                             Materialize
                         </button>
                         <button className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 text-[10px] py-1.5 rounded border border-zinc-700 font-mono uppercase transition-colors">
                             Recursive Scan
                         </button>
                     </div>
                </div>
            )}

        </div>

        {/* 5. Footer: Telemetry */}
        <div className="h-10 bg-[#020502] border-t border-[#1f2e1f]/50 flex items-center justify-between px-6 font-mono text-[9px] text-emerald-500/40 relative z-20">
             <div className="flex items-center gap-4">
                 <span className="flex items-center gap-1.5">
                     <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                     ARCHIVE INTEGRITY: 99.9%
                 </span>
                 <span className="hidden md:inline">ENTROPY LEVEL: {nodes.length * 1.5}μ</span>
             </div>
             <div className="flex gap-4 uppercase tracking-widest">
                 <span className="text-amber-600">Axioms: {nodes.filter(n => n.type === 'axiom').length}</span>
                 <span>Active: {nodes.filter(n => n.type === 'major' || n.type === 'minor').length}</span>
                 <span className="text-zinc-600">Ghosts: {nodes.filter(n => n.type === 'ghost').length}</span>
             </div>
        </div>
      </div>
    </div>
  );
};

export default MindMapModal;
