
import React, { useEffect, useState, useRef } from 'react';
import { NodeStatus, ProcessingStage } from '../types';
import { Activity, Crown, Database, Cpu, ArrowUp, Layers, Aperture } from 'lucide-react';

interface NeuralGridProps {
  stage: ProcessingStage;
}

const NeuralGrid: React.FC<NeuralGridProps> = ({ stage }) => {
  const [nodes, setNodes] = useState<NodeStatus[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Initialize The Tesseract Architecture
  useEffect(() => {
    const initialNodes: NodeStatus[] = [];
    let idCounter = 0;
    
    // 1. STRATUM 1: BEDROCK (The Archive) - Bottom
    for (let i = 0; i < 300; i++) {
        initialNodes.push({
            id: idCounter++,
            layer: 'BEDROCK_ARCHIVE',
            status: 'dormant',
            intensity: Math.random() * 0.4 + 0.1,
            x: Math.random(),
            y: 0.75 + Math.random() * 0.25,
            z: Math.random() * 5 + 1, 
            phase: Math.random() * Math.PI * 2
        });
    }

    // 2. STRATUM 2: LATTICE (The Quantum) - Middle Ring
    for (let i = 0; i < 100; i++) {
        const angle = (i / 100) * Math.PI * 2;
        initialNodes.push({
            id: idCounter++,
            layer: 'LATTICE_QUANTUM',
            status: 'active',
            intensity: 0.8,
            x: Math.cos(angle),
            y: 0.45 + (Math.random() - 0.5) * 0.1,
            z: Math.sin(angle), 
            frequency: 0.1,
            phase: angle 
        });
    }

    // 3. STRATUM 3: APEX (The Sovereign) - Top Center
    for (let i = 0; i < 15; i++) {
        initialNodes.push({
            id: idCounter++,
            layer: 'APEX_SOVEREIGN',
            status: 'manifesting',
            intensity: 1,
            x: 0.5,
            y: 0.15 + (Math.random() - 0.5) * 0.05,
            z: 0.5,
            phase: Math.random() * Math.PI * 2
        });
    }
    
    // 4. STRATUM 4: PRISM (Visual Cortex) - Hidden until active
    // Visual: Dispersed cloud that forms a lens
    for (let i = 0; i < 50; i++) {
        initialNodes.push({
            id: idCounter++,
            layer: 'PRISM_CORTEX',
            status: 'dormant',
            intensity: 0,
            x: 0.5 + (Math.random() - 0.5) * 0.5,
            y: 0.5 + (Math.random() - 0.5) * 0.5,
            z: 2,
            phase: Math.random() * Math.PI * 2
        });
    }

    setNodes(initialNodes);
  }, []);

  // The Tesseract Render Loop
  useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let animationFrameId: number;
      let tick = 0;

      const render = () => {
          tick++;
          const width = canvas.width;
          const height = canvas.height;
          const cx = width / 2;
          const cy = height / 2;

          // 0. VOID CLEAR (Deep Space Gradient)
          const gradient = ctx.createLinearGradient(0, 0, 0, height);
          gradient.addColorStop(0, '#020204'); // Top (Black/Void)
          gradient.addColorStop(0.5, '#050508'); // Mid
          gradient.addColorStop(1, '#0f172a'); // Bottom (Archive Haze)
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, width, height);

          // SHADOW MODE GLITCH EFFECT
          if (stage === ProcessingStage.SINGULARITY_FOCUS || stage === ProcessingStage.REALITY_PROJECTION) {
              if (Math.random() > 0.9) {
                  ctx.fillStyle = `rgba(0, 255, 100, ${Math.random() * 0.05})`;
                  ctx.fillRect(0, Math.random() * height, width, Math.random() * 20);
                  
                  ctx.fillStyle = `rgba(255, 0, 50, ${Math.random() * 0.05})`;
                  ctx.fillRect(0, Math.random() * height, width, Math.random() * 20);
              }
          }

          // 1. RENDER: BEDROCK (Archive)
          const bedrockNodes = nodes.filter(n => n.layer === 'BEDROCK_ARCHIVE');
          ctx.fillStyle = stage === ProcessingStage.PRISM_REFRACTION ? '#334155' : '#64748b'; // Dim during Prism
          
          bedrockNodes.forEach(node => {
              const driftX = Math.sin(tick * 0.002 + node.phase!) * 10;
              const driftY = Math.cos(tick * 0.003 + node.phase!) * 5;
              const x = node.x! * width + driftX;
              const y = node.y! * height + driftY;
              const size = (1 / node.z!) * 2.5;
              
              const pulse = stage === ProcessingStage.LAYER_ASCENSION ? Math.sin(tick * 0.1 + node.phase!) : 0;
              ctx.globalAlpha = Math.max(0, Math.min(1, node.intensity * 0.5 + pulse * 0.2));
              ctx.beginPath();
              ctx.arc(x, y, size, 0, Math.PI * 2);
              ctx.fill();
          });

          // 2. RENDER: LATTICE (Quantum)
          const quantumNodes = nodes.filter(n => n.layer === 'LATTICE_QUANTUM');
          const baseRotationSpeed = 0.002;
          const activeRotationSpeed = 0.02;
          const rotationSpeed = stage === ProcessingStage.IDLE ? baseRotationSpeed : activeRotationSpeed;
          const currentRotation = tick * rotationSpeed;
          
          if (stage !== ProcessingStage.IDLE && stage !== ProcessingStage.PRISM_REFRACTION) {
             ctx.strokeStyle = '#6366f1'; // Indigo
             ctx.lineWidth = 0.5;
             ctx.globalAlpha = 0.1;
             ctx.beginPath();
             quantumNodes.forEach((node, i) => {
                 if (i % 3 === 0) { 
                     const rx = Math.cos(node.phase! + currentRotation) * 120;
                     const rz = Math.sin(node.phase! + currentRotation) * 120;
                     const scale = 800 / (800 - rz);
                     const x = cx + rx * scale;
                     const y = node.y! * height;
                     
                     const nextNode = quantumNodes[(i + 5) % quantumNodes.length];
                     const rx2 = Math.cos(nextNode.phase! + currentRotation) * 120;
                     const rz2 = Math.sin(nextNode.phase! + currentRotation) * 120;
                     const scale2 = 800 / (800 - rz2);
                     const x2 = cx + rx2 * scale2;
                     const y2 = nextNode.y! * height;

                     if (scale > 0 && scale2 > 0) {
                         ctx.moveTo(x, y);
                         ctx.lineTo(x2, y2);
                     }
                 }
             });
             ctx.stroke();
          }

          ctx.fillStyle = stage === ProcessingStage.PRISM_REFRACTION ? '#e879f9' : '#818cf8'; // Purple during Prism
          quantumNodes.forEach(node => {
              const radius = 120;
              const rx = Math.cos(node.phase! + currentRotation) * radius;
              const rz = Math.sin(node.phase! + currentRotation) * radius;
              const scale = 800 / (800 - rz);
              
              const x = cx + rx * scale;
              const y = node.y! * height;
              const size = 2 * scale;

              if (scale > 0) {
                  const isActive = stage !== ProcessingStage.IDLE;
                  ctx.globalAlpha = isActive ? 0.9 : 0.4;
                  ctx.beginPath();
                  ctx.arc(x, y, size, 0, Math.PI * 2);
                  ctx.fill();
              }
          });

          // 3. RENDER: APEX (Sovereign)
          const apexNodes = nodes.filter(n => n.layer === 'APEX_SOVEREIGN');
          const apexPulse = Math.sin(tick * 0.05) * 0.2 + 0.8;
          ctx.fillStyle = stage === ProcessingStage.PRISM_REFRACTION ? '#f43f5e' : (stage === ProcessingStage.SINGULARITY_FOCUS ? '#ef4444' : '#10b981'); // Red/Pink during Prism, Intense Red during Singularity
          
          apexNodes.forEach(node => {
             let x = cx + Math.cos(tick * 0.05 + node.phase!) * 10;
             let y = (node.y! * height) + Math.sin(tick * 0.05 + node.phase!) * 5;
             
             if (stage === ProcessingStage.SINGULARITY_FOCUS) {
                 x += (Math.random() - 0.5) * 15;
                 y += (Math.random() - 0.5) * 15;
             }
             
             ctx.globalAlpha = node.intensity * apexPulse;
             ctx.beginPath();
             ctx.arc(x, y, 2.5, 0, Math.PI * 2);
             ctx.fill();
          });

          // 4. RENDER: PRISM CORTEX (Visual Synthesis Mode)
          if (stage === ProcessingStage.PRISM_REFRACTION) {
              const prismNodes = nodes.filter(n => n.layer === 'PRISM_CORTEX');
              
              // CMYK Split Effect
              ['#06b6d4', '#d946ef', '#eab308'].forEach((color, i) => {
                  ctx.fillStyle = color;
                  const offset = (i - 1) * 20; // -20, 0, 20
                  
                  prismNodes.forEach(node => {
                      const scale = 1.5;
                      const x = cx + (Math.cos(tick * 0.02 + node.phase!) * 100) + offset;
                      const y = cy + (Math.sin(tick * 0.03 + node.phase!) * 100);
                      
                      // Lens Flare shape
                      ctx.globalAlpha = 0.6;
                      ctx.globalCompositeOperation = 'screen';
                      ctx.beginPath();
                      ctx.ellipse(x, y, 2 * scale, 15 * scale, tick * 0.1, 0, Math.PI * 2);
                      ctx.fill();
                  });
              });
              
              // Central Beams
              ctx.strokeStyle = '#fff';
              ctx.lineWidth = 1;
              ctx.globalAlpha = 0.5;
              ctx.beginPath();
              for(let i=0; i<8; i++) {
                  const angle = (tick * 0.05) + (i * Math.PI / 4);
                  ctx.moveTo(cx, cy);
                  ctx.lineTo(cx + Math.cos(angle) * 300, cy + Math.sin(angle) * 300);
              }
              ctx.stroke();
              ctx.globalCompositeOperation = 'source-over';
          }

          // --- STANDARD ANIMATION STAGE EFFECTS ---

          // A. ASCENSION
          if (stage === ProcessingStage.LAYER_ASCENSION || stage === ProcessingStage.HYPER_TESSERACT_SYNC) {
              ctx.globalCompositeOperation = 'screen';
              ctx.strokeStyle = 'rgba(129, 140, 248, 0.2)';
              ctx.lineWidth = 1;
              ctx.beginPath();
              for (let i = 0; i < 5; i++) {
                  const x = Math.random() * width;
                  ctx.moveTo(x, height);
                  ctx.lineTo(x, height * 0.5);
              }
              ctx.stroke();
              ctx.globalCompositeOperation = 'source-over';
          }

          // B. FOCUS
          const apexY = 0.15 * height;
          if (stage === ProcessingStage.SINGULARITY_FOCUS) {
              ctx.globalCompositeOperation = 'lighter';
              ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)'; // Intense Red
              ctx.lineWidth = 2;
              ctx.beginPath();
              quantumNodes.forEach((node, i) => {
                  if (i % 10 === 0) {
                      const rx = Math.cos(node.phase! + currentRotation) * 120;
                      const rz = Math.sin(node.phase! + currentRotation) * 120;
                      const scale = 800 / (800 - rz);
                      if (scale > 0) {
                        const x = cx + rx * scale;
                        const y = node.y! * height;
                        ctx.moveTo(x, y);
                        ctx.lineTo(cx + (Math.random() - 0.5) * 20, apexY + (Math.random() - 0.5) * 20); // Jitter
                      }
                  }
              });
              ctx.stroke();
              
              // Intense Glitch Lines
              ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
              if (Math.random() > 0.8) {
                  ctx.fillRect(0, Math.random() * height, width, 1 + Math.random() * 3);
              }
          }
          
          // C. REALITY PROJECTION
          if (stage === ProcessingStage.REALITY_PROJECTION) {
              ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
              ctx.fillRect(0, 0, width, height);
              
              // Matrix Rain Effect
              ctx.fillStyle = 'rgba(16, 185, 129, 0.5)';
              ctx.font = '10px monospace';
              for (let i = 0; i < 20; i++) {
                  const x = Math.random() * width;
                  const y = (tick * 10 + Math.random() * 100) % height;
                  ctx.fillText(String.fromCharCode(0x30A0 + Math.random() * 96), x, y);
              }
          }

          ctx.globalAlpha = 1;
          animationFrameId = requestAnimationFrame(render);
      };

      const resize = () => {
          canvas.width = canvas.offsetWidth;
          canvas.height = canvas.offsetHeight;
      };
      window.addEventListener('resize', resize);
      resize();
      render();

      return () => {
          window.removeEventListener('resize', resize);
          cancelAnimationFrame(animationFrameId);
      };
  }, [stage, nodes]);

  return (
    <div className="flex flex-col gap-0.5 w-full h-full select-none bg-[#02050b] rounded-lg overflow-hidden border border-[#1e1e2e] p-1 relative shadow-[inset_0_0_30px_rgba(0,0,0,1)]">
      
      {/* HUD HEADER */}
      <div className="h-8 border-b border-[#1e1e2e] flex items-center justify-between px-3 relative bg-[#050510] z-30">
          <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-500 uppercase tracking-widest z-10">
              <Crown size={10} />
              TESSERACT VIEW
          </div>
          <div className="flex gap-2">
              <div className="flex items-center gap-1 text-[8px] text-zinc-500 font-mono">
                  <Database size={8} /> BEDROCK
              </div>
              <div className="flex items-center gap-1 text-[8px] text-zinc-500 font-mono">
                  <Cpu size={8} /> LATTICE
              </div>
              <div className={`flex items-center gap-1 text-[8px] font-mono ${stage === ProcessingStage.PRISM_REFRACTION ? 'text-pink-500 font-bold' : 'text-zinc-500'}`}>
                  <Aperture size={8} /> PRISM
              </div>
          </div>
      </div>

      {/* MAIN VIEWPORT */}
      <div className="flex-1 bg-[#010103] relative overflow-hidden group z-10">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-10" />
          
          {/* Static Grid Overlay */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>
      
      {/* STATUS FOOTER */}
      <div className="h-6 border-t border-[#1e1e2e] bg-[#030305] flex items-center px-2 justify-between">
          <div className="flex items-center gap-2">
               <div className={`w-1.5 h-1.5 rounded-full ${stage !== ProcessingStage.IDLE ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-700'}`}></div>
               <span className="text-[9px] font-mono text-zinc-500 uppercase">
                   {stage === ProcessingStage.IDLE ? 'SYSTEM DORMANT' : stage.replace('_', ' ')}
               </span>
          </div>
          <div className="text-[9px] font-mono text-zinc-600">
              V-TESSERACT
          </div>
      </div>

    </div>
  );
};

export default NeuralGrid;
