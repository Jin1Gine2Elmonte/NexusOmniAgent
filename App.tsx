
import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, Activity, Settings, Terminal as TerminalIcon, Menu, X, Paperclip, File as FileIcon, Download, Code, Cloud, Database, RefreshCw, Trash2, HardDrive, Mic, Volume2, Upload, UserCog, Save, ArrowDownToLine, Share2, Hexagon, Cpu, Plus, MessageSquare, History, ChevronUp, ChevronDown, Zap, Globe, Crown, Layers, Aperture, Image as ImageIcon, Key as KeyIcon, Lock, Gem, LogOut, User as UserIcon, Server, Box, MoreVertical, PenTool, BookOpen, Network, Eye, Brain, Sliders, Disc, Music } from 'lucide-react';
import NeuralGrid from './components/NeuralGrid';
import ChatMessage from './components/ChatMessage';
import PaleArchiveModal from './components/PaleArchiveModal';
import MindMapModal from './components/MindMapModal';
import HostLinkModal from './components/HostLinkModal';
import GalleryModal from './components/GalleryModal';
import AgentSuiteModal from './components/AgentSuiteModal';
import PolymathMatrixModal from './components/PolymathMatrixModal';
import IdeogramStudioModal from './components/IdeogramStudioModal';
import NexusForgeModal from './components/NexusForgeModal';
import { MusicStudioModal } from './components/MusicStudioModal';
import { SettingsModal } from './components/SettingsModal';
import { Message, ProcessingStage, LogEntry, Attachment, SyncStatus, SessionsMap, Session, MemoryBank, ModelSelection, MODEL_OPTIONS, UserProfile } from './types';
import { generateOmniResponse, generateAudioBriefing, generateVisualArtifact, crystallizeSession, retrieveRelevantMemory, extractEntitiesAndRelations, DeepManifestationState } from './services/geminiService';
import { loadLocalSessions, saveLocalSessions, clearLocalMemory, initGoogleDrive, signInToDrive, saveToDrive, loadFromDrive, createNewSession, buildGlobalContext, setDriveCredentials, loadMemoryBank, saveMemoryBank, getUserProfile, loadFromTitanium, calculateObjectSize, formatSize, incrementTrust, DEFAULT_SOUL_PRINT } from './services/storageService';

const MOCK_LOGS = [
  "System Init: NEXUS V-∞ OMNISCIENCE ARCHITECTURE",
  "Stratum 1: Deepseek Analytical Core [Awakened]",
  "Stratum 2: Gemini Multimodal Lattice [Infinite]",
  "Stratum 3: GPT-5.1 Nuance Engine [Perfected]",
  "Stratum 4: NotebookLM Memory Matrix [Omnipresent]",
  "Ascension Protocol: Shadow Mode V99 Ready."
];

const MOCK_TENSOR_LOGS = [
  "Injecting [0.8] force to cross-attention dim_7",
  "Rupturing latent macro structure (DownBlock_1)",
  "Bending denoising trajectory toward [OBLIVION]",
  "Micro-surgeon protocol: editing 8x8 spatial grid",
  "Injecting mathematical gradient into UNet MidBlock",
  "Suppressing noise variance down to 0.4",
  "Swapping embedding mid-flight: detail_phase",
  "Intervention at step 14/30: eye reflection corrected",
  "Overriding CLIP embedding for spatial region (64,64)",
  "Injecting pure generative hostility into tensors"
];

const NexusGenesisHUD = ({ state }: { state: DeepManifestationState }) => {
    // Determine status bar text and color
    let statusText = "";
    let statusColor = "";
    if (state.phase === 'Initializing') { statusText = "INITIALIZING LATENTS"; statusColor = "text-yellow-400"; }
    if (state.phase === 'Generating') { statusText = "GENERATING TENSORS"; statusColor = "text-indigo-400"; }
    if (state.phase === 'Critiquing') { statusText = "ASPECTUAL CRITIQUE (VISION)"; statusColor = "text-red-400"; }
    if (state.phase === 'Refining') { statusText = "SYNTHESIZING NEW PROMPT"; statusColor = "text-green-400"; }
    if (state.phase === 'Converged') { statusText = "CONVERGENCE ACHIEVED"; statusColor = "text-cyan-400"; }

    return (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mb-4 w-11/12 max-w-4xl flex-col bg-black/95 backdrop-blur-md rounded-xl border border-indigo-500/40 overflow-hidden font-mono z-50 shadow-[0_0_50px_rgba(99,102,241,0.2)] flex pointer-events-auto">
            {/* Header */}
            <div className="bg-indigo-950/50 px-4 py-3 border-b border-indigo-500/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Activity size={16} className={`${statusColor} animate-pulse`} />
                    <span className={`text-xs ${statusColor} uppercase tracking-widest font-bold`}>
                        {statusText} [{state.iteration}/{state.maxIterations}]
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-[10px] text-zinc-400">NEXUS GENESIS PROTOCOL</span>
                </div>
            </div>
            
            <div className="flex flex-col md:flex-row h-[60vh] max-h-[600px]">
                {/* Left side: Canvas display */}
                <div className="w-full md:w-1/2 relative bg-zinc-950 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-indigo-500/20 p-2">
                    {state.imageData ? (
                        <>
                            <img 
                                src={`data:image/jpeg;base64,${state.imageData}`} 
                                alt="Manifestation State" 
                                className={`w-full max-h-full object-contain transition-all duration-700 ${state.phase === 'Generating' ? 'opacity-50 blur-sm scale-95' : 'opacity-100 blur-0 scale-100'}`}
                            />
                            {state.phase === 'Generating' && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="w-16 h-16 border-2 border-indigo-500/40 rounded-full animate-[spin_3s_linear_infinite]" />
                                    <div className="absolute w-4 h-4 bg-indigo-500/60 rounded-full animate-ping" />
                                </div>
                            )}
                            {state.phase === 'Critiquing' && (
                                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none opacity-50 mix-blend-overlay animate-pulse" />
                            )}
                        </>
                    ) : (
                        <div className="flex flex-col items-center text-zinc-600 gap-4">
                            <Aperture size={48} className="animate-spin-slow opacity-20" />
                            <span className="text-xs uppercase tracking-widest">Awaiting First Pass</span>
                        </div>
                    )}
                </div>

                {/* Right side: Brain / Logs / Prompt */}
                <div className="w-full md:w-1/2 bg-zinc-950/80 p-4 flex flex-col overflow-y-auto font-mono text-[10px] md:text-xs leading-relaxed space-y-4">
                    <div className="space-y-2">
                        <div className="text-indigo-400 font-bold border-b border-indigo-500/20 pb-1 mb-2 uppercase tracking-wider">Current Injection Prompt</div>
                        <div className="text-zinc-300 break-words whitespace-pre-wrap">
                            {state.currentPrompt || "Initializing construct..."}
                        </div>
                    </div>
                    
                    {state.critique && (
                        <div className="space-y-2 mt-auto pt-4 border-t border-red-500/20">
                            <div className="text-red-400 font-bold flex items-center gap-2 uppercase tracking-wider">
                                <Eye size={12} />
                                Autonomous Vision Critique
                            </div>
                            <div className="text-red-300/80 break-words">
                                {state.critique}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Footer */}
            <div className="bg-black px-4 py-2 flex items-center justify-between border-t border-indigo-500/40">
                 <span className="text-[9px] text-zinc-500">Agentic Loop: Real-Time Execution</span>
                 <div className="flex gap-1 h-1.5 w-16">
                     <div className={`h-full w-full rounded-full ${state.iteration >= 1 ? 'bg-indigo-500' : 'bg-zinc-800'}`}></div>
                     <div className={`h-full w-full rounded-full ${state.iteration >= 2 ? 'bg-indigo-500' : 'bg-zinc-800'}`}></div>
                     <div className={`h-full w-full rounded-full ${state.iteration >= 3 ? 'bg-indigo-500' : 'bg-zinc-800'}`}></div>
                 </div>
             </div>
        </div>
    );
};

const App: React.FC = () => {
  const [input, setInput] = useState('');
  
  // Session State
  const [sessions, setSessions] = useState<SessionsMap>({});
  const [activeSessionId, setActiveSessionId] = useState<string>("");
  const [memoryBank, setMemoryBank] = useState<MemoryBank>({ 
    axioms: [], 
    paleArchive: { entities: [], relationships: [], worldRules: [] },
    soulPrint: DEFAULT_SOUL_PRINT,
    version: 1, 
    lastUpdated: Date.now() 
  });
  
  const [stage, setStage] = useState<ProcessingStage>(ProcessingStage.IDLE);
  const stageRef = useRef<ProcessingStage>(ProcessingStage.IDLE);
  useEffect(() => { stageRef.current = stage; }, [stage]);
  
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<Attachment[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showMemoryBank, setShowMemoryBank] = useState(false);
  const [manifestationState, setManifestationState] = useState<DeepManifestationState | null>(null);

  // Language & App Settings State
  const [appLanguage, setAppLanguage] = useState<'ar' | 'en'>(() => {
    if (typeof window !== 'undefined') {
      return (window.localStorage.getItem('NEXUS_APP_LANG') as 'ar' | 'en') || 'ar';
    }
    return 'ar';
  });

  const [creativityTemp, setCreativityTemp] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return parseFloat(window.localStorage.getItem('NEXUS_CREATIVITY_TEMP') || '0.7');
    }
    return 0.7;
  });

  const [enableCyberGrid, setEnableCyberGrid] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem('NEXUS_CYBER_GRID') !== 'false';
    }
    return true;
  });

  const [enableSoundFx, setEnableSoundFx] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem('NEXUS_SOUND_FX') !== 'false';
    }
    return true;
  });

  const handleLanguageChange = (lang: 'ar' | 'en') => {
    setAppLanguage(lang);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('NEXUS_APP_LANG', lang);
    }
    addLog(lang === 'ar' ? 'تم تغيير لغة الواجهة إلى العربية' : 'Interface language set to English', 'info');
  };

  const handleCreativityTempChange = (temp: number) => {
    setCreativityTemp(temp);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('NEXUS_CREATIVITY_TEMP', temp.toString());
    }
  };

  const handleCyberGridToggle = () => {
    setEnableCyberGrid(prev => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('NEXUS_CYBER_GRID', next ? 'true' : 'false');
      }
      return next;
    });
  };

  const handleSoundFxToggle = () => {
    setEnableSoundFx(prev => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('NEXUS_SOUND_FX', next ? 'true' : 'false');
      }
      return next;
    });
  };
  
  // Storage & Sync State
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
      isSynced: false,
      lastSyncTime: null,
      cloudProvider: 'none',
      isSyncing: false
  });
  
  // User Identity State
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Cloud Credentials State
  // (Removed manual credentials as backend handles it)

  // Modals State
  const [isMindMapOpen, setIsMindMapOpen] = useState(false);
  const [isHostLinkOpen, setIsHostLinkOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [mindMapContent, setMindMapContent] = useState('');
  
  // Feature Toggles
  const [isWebSearchEnabled, setIsWebSearchEnabled] = useState(false);
  const [isDeepManifestation, setIsDeepManifestation] = useState(false);
  const [isCanvasMode, setIsCanvasMode] = useState(false);
  const [isPaleArchiveOpen, setIsPaleArchiveOpen] = useState(false);
  const [isMoreOptionsOpen, setIsMoreOptionsOpen] = useState(false);
  const [isModelPickerOpen, setIsModelPickerOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelSelection>('flash-3.7');

  // Kimi API State
  const [kimiApiKeyInput, setKimiApiKeyInput] = useState(() => (typeof window !== 'undefined' ? window.localStorage.getItem('NEXUS_KIMI_API_KEY') || '' : ''));
  const [kimiBaseUrlInput, setKimiBaseUrlInput] = useState(() => (typeof window !== 'undefined' ? window.localStorage.getItem('NEXUS_KIMI_BASE_URL') || 'https://api.moonshot.cn/v1' : 'https://api.moonshot.cn/v1'));
  const [kimiModelInput, setKimiModelInput] = useState(() => (typeof window !== 'undefined' ? window.localStorage.getItem('NEXUS_KIMI_MODEL') || 'moonshot-v1-8k' : 'moonshot-v1-8k'));

  const handleKimiConfigChange = (key: 'apiKey' | 'baseUrl' | 'model', value: string) => {
      if (typeof window === 'undefined') return;
      if (key === 'apiKey') {
          setKimiApiKeyInput(value);
          window.localStorage.setItem('NEXUS_KIMI_API_KEY', value);
          addLog(`Kimi Engine API Key configured.`, 'success');
      } else if (key === 'baseUrl') {
          setKimiBaseUrlInput(value);
          window.localStorage.setItem('NEXUS_KIMI_BASE_URL', value);
      } else if (key === 'model') {
          setKimiModelInput(value);
          window.localStorage.setItem('NEXUS_KIMI_MODEL', value);
      }
  };

  // Local Model State
  const [localModelStatus, setLocalModelStatus] = useState<any>({ status: 'idle' });

  useEffect(() => {
    if (selectedModel !== 'llama-local') return;

    const fetchStatus = async () => {
      try {
        const resp = await fetch('/api/local-model/status');
        if (resp.ok) {
          const data = await resp.json();
          setLocalModelStatus(data);
        }
      } catch (err) {
        // Silently handle if local model server is unreachable
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, [selectedModel]);

  // Inkling Model State
  const [inklingModelStatus, setInklingModelStatus] = useState<any>({ downloaded: false, status: 'NOT_DOWNLOADED' });

  useEffect(() => {
    if (selectedModel !== 'inkling') return;

    const fetchStatus = async () => {
      try {
        const resp = await fetch('/api/inkling-model/status');
        if (resp.ok) {
          const data = await resp.json();
          setInklingModelStatus(data);
        }
      } catch (err) {
        // Silently handle if inkling model endpoint is unreachable
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, [selectedModel]);

  const triggerLocalModelDownload = async () => {
    try {
      addLog("Initializing local model download on Google's cloud server...", "info");
      const resp = await fetch('/api/local-model/download', { method: 'POST' });
      if (resp.ok) {
        const data = await resp.json();
        setLocalModelStatus(data.status);
        addLog("Local engine download triggered successfully.", "success");
      }
    } catch (err: any) {
      addLog(`Failed to trigger download: ${err?.message || err}`, "error");
    }
  };

  const triggerInklingModelDownload = async () => {
    try {
      addLog("Initializing thinkingmachines/inkling open-weights model injection...", "info");
      const resp = await fetch('/api/inkling-model/download', { method: 'POST' });
      if (resp.ok) {
        const data = await resp.json();
        setInklingModelStatus(data.config ? { downloaded: true, ...data.config } : { downloaded: true });
        addLog("Thinking Machines Inkling model downloaded and injected successfully.", "success");
      }
    } catch (err: any) {
      addLog(`Failed to trigger Inkling download: ${err?.message || err}`, "error");
    }
  };
  
  // Audio State (Input/Output)
  const [showAgentSuiteModal, setShowAgentSuiteModal] = useState(false);
  const [showPolymathModal, setShowPolymathModal] = useState(false);
  const [showIdeogramModal, setShowIdeogramModal] = useState(false);
  const [showNexusForgeModal, setShowNexusForgeModal] = useState(false);
  const [showMusicStudioModal, setShowMusicStudioModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const recognitionRef = useRef<any>(null); // For Web Speech API

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);
  const moreOptionsRef = useRef<HTMLDivElement>(null);
  const modelPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (moreOptionsRef.current && !moreOptionsRef.current.contains(event.target as Node)) {
        setIsMoreOptionsOpen(false);
      }
      if (modelPickerRef.current && !modelPickerRef.current.contains(event.target as Node)) {
        setIsModelPickerOpen(false);
      }
    };

    if (isMoreOptionsOpen || isModelPickerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMoreOptionsOpen, isModelPickerOpen]);

  // --- INITIALIZATION & MEMORY LOADING ---
  
  useEffect(() => {
    // 1. Initial Load from LocalStorage (Fast)
    const initialSessions = loadLocalSessions();
    const initialMemory = loadMemoryBank();
    
    setSessions(initialSessions);
    setMemoryBank(initialMemory);
    
    // Set Active Session based on fast load
    const sessionIds = Object.keys(initialSessions);
    if (sessionIds.length > 0) {
        const recentId = sessionIds.sort((a, b) => initialSessions[b].lastActiveAt - initialSessions[a].lastActiveAt)[0];
        setActiveSessionId(recentId);
    }

    // 2. Hydration Check: Load from Titanium Core (IndexedDB - Slow/Robust)
    // This restores data if LocalStorage was cleared but IDB survives
    const hydrateTitanium = async () => {
        const deepSessions = await loadFromTitanium<SessionsMap>('nexus_omni_memory_v2');
        const deepMemory = await loadFromTitanium<MemoryBank>('nexus_omni_memory_bank');

        if (deepSessions) {
            console.log("NEXUS::SYSTEM // Titanium Core Restoration Triggered.");
            setSessions(deepSessions);
            // Update active session again
            const deepIds = Object.keys(deepSessions);
            if (deepIds.length > 0) {
                const recentDeep = deepIds.sort((a, b) => deepSessions[b].lastActiveAt - deepSessions[a].lastActiveAt)[0];
                setActiveSessionId(recentDeep);
            }
        }
        
        if (deepMemory) {
            setMemoryBank(deepMemory);
        }
    };
    hydrateTitanium();

    // 3. Initialize Logs
    MOCK_LOGS.forEach((msg, i) => {
        setTimeout(() => addLog(msg, 'info'), i * 200);
    });
    
    setTimeout(() => {
        addLog("CRITICAL: The Tesseract is Vertical.", 'god_mode');
    }, 2000);
    
    setTimeout(() => {
        addLog("PROTOCOL: Titanium Persistence // ACTIVE.", 'revolution');
    }, 3500);

    // 4. Try Auto-Init Drive (Checks backend auth status)
    initDriveConnection();
  }, []);

  const initDriveConnection = () => {
      initGoogleDrive(
        async () => {
            // User is already authenticated
            setSyncStatus(prev => ({ ...prev, isSynced: true, cloudProvider: 'drive', isSyncing: true }));
            addLog("Cosmic Link: Restored. Retrieving Identity...", 'success');
            
            const profile = await getUserProfile();
            if (profile) {
                setUserProfile(profile);
                addLog(`Identity Verified: Welcome back, ${profile.name}.`, 'god_mode');
            }
            
            await handleCloudPull();
        },
        (err) => {
            console.log("Not authenticated yet or Drive Init skipped.");
        }
      );
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll whenever the active session's messages change
  const activeMessagesLength = sessions[activeSessionId]?.messages.length || 0;
  useEffect(scrollToBottom, [activeMessagesLength, activeSessionId]);

  // --- PERSISTENCE LOGIC ---

  // Auto-save to Local Storage on session change
  useEffect(() => {
      if (Object.keys(sessions).length > 0) {
          saveLocalSessions(sessions);
          saveMemoryBank(memoryBank);
          
          // If Connected to Cloud, debounce save
          if (syncStatus.cloudProvider === 'drive' && syncStatus.isSynced) {
              const timeoutId = setTimeout(() => {
                  setSyncStatus(prev => ({ ...prev, isSyncing: true }));
                  saveToDrive(sessions, memoryBank).then(() => {
                       setSyncStatus(prev => ({ ...prev, isSyncing: false, lastSyncTime: Date.now() }));
                  }).catch(err => {
                       console.warn("NEXUS::CLOUD // Cloud Auto-save paused due to a connection issue:", err?.message || err);
                       setSyncStatus(prev => ({ ...prev, isSyncing: false }));
                  });
              }, 5000); // Save to cloud 5s after change
              return () => clearTimeout(timeoutId);
          }
      }
  }, [sessions, memoryBank, syncStatus.cloudProvider, syncStatus.isSynced]);

  // Auto-crystallize before closing
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!activeSessionId) return;
      const activeMsgs = sessions[activeSessionId]?.messages || [];
      if (activeMsgs.length > 3) {
        // Warning: This runs synchronously or very briefly during unload.
        // The fetch might or might not complete. We do it anyway.
        // It's requested by the user, so we follow strictly.
        crystallizeSession(activeMsgs, activeSessionId).catch(console.error);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [sessions, activeSessionId]);



  // Auto-scroll logs
  useEffect(() => {
      if (logsEndRef.current) {
          logsEndRef.current.scrollTop = logsEndRef.current.scrollHeight;
      }
  }, [logs]);

  const addLog = React.useCallback((msg: string, level: LogEntry['level'] = 'info') => {
      const nodes = ['Apex Eye', 'Bedrock Layer', 'Quantum Lattice', 'Prism Cortex', 'Network'];
      const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
      setLogs(prev => [...prev.slice(-30), {
          id: Math.random().toString(),
          timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second:'2-digit' }),
          nodeId: randomNode,
          message: msg,
          level
      }]);
  }, []);

  const simulateProcessingLogs = () => {
      // Simulate the Tesseract Ascension Process
      const tasks: { msg: string, lvl: LogEntry['level'] }[] = [
          { msg: "Input Received. Initiating Ascension...", lvl: 'core' },
          { msg: "Stratum 1 [Bedrock]: Retrieving Context/Soul...", lvl: 'abyss' },
          { msg: "Data Rising to Stratum 2...", lvl: 'info' },
          { msg: "Stratum 2 [Lattice]: Filtering Chaos/Logic...", lvl: 'core' },
          { msg: "Pattern Locked. Ascending to Apex...", lvl: 'revolution' },
          { msg: "Stratum 3 [Apex]: Sovereign Judgment...", lvl: 'god_mode' },
          { msg: "Reality Projection Imminent.", lvl: 'surface' }
      ];
      
      let i = 0;
      const interval = setInterval(() => {
          if (i >= tasks.length || stage === ProcessingStage.IDLE) {
              clearInterval(interval);
              return;
          }
          addLog(tasks[i].msg, tasks[i].lvl);
          i++;
      }, 700);
  };

  // --- SESSION MANAGEMENT ---

  const handleCreateSession = () => {
      const newSession = createNewSession(`Thread #${Object.keys(sessions).length + 1}`);
      setSessions(prev => ({ ...prev, [newSession.id]: newSession }));
      setActiveSessionId(newSession.id);
      addLog(`Memory Matrix: New Lived Experience [${newSession.id}] Started.`, 'core');
  };

  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if (Object.keys(sessions).length <= 1) {
          addLog("Cannot purge final thread.", 'warn');
          return;
      }
      
      if (window.confirm("Purge this memory thread? This cannot be undone.")) {
          setSessions(prev => {
              const newSessions = { ...prev };
              delete newSessions[id];
              return newSessions;
          });
          if (activeSessionId === id) {
              // Switch to another session
              const remainingIds = Object.keys(sessions).filter(k => k !== id);
              setActiveSessionId(remainingIds[0]);
          }
          addLog("Experience purged from existence.", 'error');
      }
  };

  const handleCrystallize = async () => {
      if (!activeSessionId) return;
      setStage(ProcessingStage.CRYSTALLIZING);
      addLog("INITIATING MEMORY CRYSTALLIZATION PROTOCOL...", 'god_mode');
      
      try {
          const { axioms: newAxioms, soulPrintUpdate } = await crystallizeSession(sessions[activeSessionId].messages, activeSessionId);
          if (newAxioms.length > 0 || soulPrintUpdate) {
              setMemoryBank(prev => ({
                  ...prev,
                  axioms: [...prev.axioms, ...newAxioms],
                  soulPrint: {
                      ...prev.soulPrint,
                      ...soulPrintUpdate
                  },
                  lastUpdated: Date.now(),
                  version: prev.version + 1
              }));
              addLog(`Crystallization Complete: ${newAxioms.length} Axioms solidified.`, 'success');
          } else {
              addLog("Crystallization: No new truths found.", 'warn');
          }
      } catch (e) {
          addLog("Crystallization Failed.", 'error');
      } finally {
          setStage(ProcessingStage.IDLE);
      }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesList: File[] = Array.from(e.target.files);
      const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB Limit for Browser Stability
      
      const validFiles = filesList.filter(file => {
        if (file.size > MAX_FILE_SIZE) {
          addLog(`CRITICAL: [${file.name}] exceeds 20MB. Fragmentation Risk High.`, 'warn');
          return false;
        }
        return true;
      });

      if (validFiles.length === 0 && filesList.length > 0) {
        alert("Nexus Warning: Files larger than 20MB may cause browser collapse. Please fragment your data or use smaller artifacts.");
        return;
      }

      // 1. Create initial attachment placeholders
      const initialAttachments: Attachment[] = validFiles.map(file => ({
        id: Math.random().toString(36).substring(7),
        name: file.name,
        mimeType: file.type,
        status: 'loading',
        progress: 0
      }));

      setSelectedFiles(prev => [...prev, ...initialAttachments]);
      if (fileInputRef.current) fileInputRef.current.value = ''; 
      addLog(`Initiating High-Speed Absorption for ${validFiles.length} artifacts...`, 'info');

      // 2. Process each file with optimized memory handling
      validFiles.forEach((file, index) => {
        const attachmentId = initialAttachments[index].id;
        const reader = new FileReader();

        reader.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            setSelectedFiles(prev => prev.map(att => 
              att.id === attachmentId ? { ...att, progress: percent } : att
            ));
          }
        };

        reader.onload = () => {
          const result = reader.result as string;
          const base64Data = result.split(',')[1];
          
          setSelectedFiles(prev => prev.map(att => 
            att.id === attachmentId ? { 
              ...att, 
              status: 'complete', 
              progress: 100, 
              data: base64Data 
            } : att
          ));
          addLog(`Artifact [${file.name}] fully absorbed.`, 'success');
        };

        reader.onerror = () => {
          setSelectedFiles(prev => prev.map(att => 
            att.id === attachmentId ? { ...att, status: 'error' } : att
          ));
          addLog(`Absorption Failure: [${file.name}] lost in the void.`, 'error');
        };

        reader.readAsDataURL(file);
      });
    }
  };

  const removeFile = (id: string) => {
    setSelectedFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleEditMessage = React.useCallback((content: string) => {
    setInput(content);
    if (fileInputRef.current) fileInputRef.current.focus();
  }, []);

  const handleOpenMindMap = React.useCallback((content: string) => {
    setMindMapContent(content);
    setIsMindMapOpen(true);
  }, []);

  // --- AUDIO LOGIC (VOICE I/O) ---
  
  // 1. Text-to-Speech
  const handleGenerateAudio = React.useCallback(async (textToRead: string, messageId: string) => {
    if (stageRef.current !== ProcessingStage.IDLE) return;
    
    setStage(ProcessingStage.SPEAKING);
    addLog("Initiating Neural Voice Synthesis...", 'surface');

    const audioBase64 = await generateAudioBriefing(textToRead.substring(0, 2000)); // Limit for speed
    
    if (audioBase64) {
        setSessions(prev => ({
            ...prev,
            [activeSessionId]: {
                ...prev[activeSessionId],
                messages: prev[activeSessionId].messages.map(m => 
                    m.id === messageId ? { ...m, audioData: audioBase64 } : m
                )
            }
        }));
        addLog("Neural Voice synthesized successfully.", 'success');
        playAudio(audioBase64);
    } else {
        addLog("Voice Synthesis Failed.", 'error');
    }
    setStage(ProcessingStage.IDLE);
  }, [activeSessionId]);

  const playAudio = React.useCallback(async (base64String: string) => {
      if (audioSourceRef.current) {
          audioSourceRef.current.stop();
          audioSourceRef.current = null;
          setIsPlaying(false);
          return; // Toggle behavior
      }

      try {
          if (!audioContextRef.current) {
              audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
          }

          // Decode
          const binaryString = atob(base64String);
          const len = binaryString.length;
          const bytes = new Uint8Array(len);
          for (let i = 0; i < len; i++) {
              bytes[i] = binaryString.charCodeAt(i);
          }
          
          const audioBuffer = await audioContextRef.current.decodeAudioData(bytes.buffer);
          
          const source = audioContextRef.current.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(audioContextRef.current.destination);
          
          source.onended = () => {
              setIsPlaying(false);
              audioSourceRef.current = null;
          };
          
          source.start(0);
          audioSourceRef.current = source;
          setIsPlaying(true);
      } catch (e) {
          console.error("Audio Playback Error:", e);
          addLog("Audio Driver Failure.", 'error');
      }
  }, []);

  // 2. Speech-to-Text (Sonic Gate)
  const toggleRecording = () => {
      if (isRecording) {
          stopRecording();
      } else {
          startRecording();
      }
  };

  const startRecording = () => {
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
          alert("Sonic Gate Unavailable: Browser does not support Speech API.");
          return;
      }

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'ar-SA'; // Default to Arabic/Auto

      recognitionRef.current.onstart = () => {
          setIsRecording(true);
          addLog("Sonic Gate: Listening...", 'core');
      };

      recognitionRef.current.onresult = (event: any) => {
          const transcript = Array.from(event.results)
              .map((result: any) => result[0].transcript)
              .join('');
          setInput(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
          console.error("SpeechRecognition Error:", event.error);
          setIsRecording(false);
          if (event.error === 'not-allowed') {
              addLog("Sonic Gate: Microphone access denied. Please allow microphone permissions.", 'error');
          } else {
              addLog(`Sonic Gate: Interference Detected (${event.error}).`, 'error');
          }
      };

      recognitionRef.current.onend = () => {
          setIsRecording(false);
          addLog("Sonic Gate: Transmission Received.", 'success');
      };

      recognitionRef.current.start();
  };

  const stopRecording = () => {
      if (recognitionRef.current) {
          recognitionRef.current.stop();
      }
  };


  const handlePlayMessageAudio = React.useCallback((messageId: string, content: string, audioData?: string) => {
      if (audioData) {
          playAudio(audioData);
      } else {
          handleGenerateAudio(content, messageId);
      }
  }, [playAudio, handleGenerateAudio]);

  // --- SYNC & IO LOGIC ---



  const handleCloudConnect = async () => {
      // 1. Sign In
      try {
          const success = await signInToDrive();
          if (success) {
              setSyncStatus(prev => ({ ...prev, isSynced: true, cloudProvider: 'drive', isSyncing: true }));
              addLog("Cosmic Link: Authorized. Retrieving Identity...", 'success');
              
              // 2. Get Profile
              const profile = await getUserProfile();
              if (profile) {
                  setUserProfile(profile);
                  addLog(`Identity Verified: Welcome, ${profile.name}.`, 'god_mode');
              }

              // 3. Pull Data
              await handleCloudPull();
          }
      } catch (e) {
          // Graceful Sandbox Handling
          const errStr = String(e);
          if (errStr.includes("SANDBOX") || errStr.includes("Popup Blocked")) {
              addLog("Sandbox Mode Detected: Cloud features are unavailable.", 'warn');
              alert("NOTE: You are in a 'Sandbox' environment which blocks Google Login popups. \n\nYour data is SAFE and saved to your Local Browser Storage automatically. \n\nTo move data, use 'Backup' and 'Import' buttons.");
          } else {
              console.error(e);
              addLog("Authorization Failed.", 'error');
          }
      }
  };

  const handleCloudPull = async () => {
      setSyncStatus(prev => ({ ...prev, isSyncing: true }));
      try {
          const cloudData = await loadFromDrive();
          if (cloudData.sessions) {
              setSessions(cloudData.sessions);
              if (cloudData.memoryBank) setMemoryBank(cloudData.memoryBank);
              
              saveLocalSessions(cloudData.sessions);
              if (cloudData.memoryBank) saveMemoryBank(cloudData.memoryBank);

              const sessionIds = Object.keys(cloudData.sessions);
              if (sessionIds.length > 0) {
                 const recentId = sessionIds.sort((a, b) => cloudData.sessions![b].lastActiveAt - cloudData.sessions![a].lastActiveAt)[0];
                 setActiveSessionId(recentId);
              }
              addLog(`Cloud Sync Complete: ${sessionIds.length} threads synced.`, 'success');
          } else {
              addLog("Cloud Archive Empty or Inaccessible.", 'warn');
          }
      } catch (e) {
          addLog("Cloud Downlink Failed.", 'error');
      } finally {
          setSyncStatus(prev => ({ ...prev, isSyncing: false, lastSyncTime: Date.now() }));
      }
  };
  
  const handleSignOut = async () => {
      try {
          await fetch('/api/auth/logout', { method: 'POST' });
      } catch (e) {
          console.error("Logout error", e);
      }
      setUserProfile(null);
      setSyncStatus(prev => ({ ...prev, isSynced: false, cloudProvider: 'none' }));
      addLog("Identity Disconnected. Returning to Local Mode.", 'info');
  }

  const handleClearMemory = () => {
      if (window.confirm("WARNING: Initiate Total Recall Wipe? This will erase ALL threads and CRYSTALLIZED MEMORIES.")) {
          clearLocalMemory();
          const newSession = createNewSession("Genesis Protocol");
          setSessions({ [newSession.id]: newSession });
          setMemoryBank({ 
              axioms: [], 
              paleArchive: { entities: [], relationships: [], worldRules: [] },
              soulPrint: DEFAULT_SOUL_PRINT,
              version: 1, 
              lastUpdated: Date.now() 
          });
          setActiveSessionId(newSession.id);
          addLog("Memory Wipe Complete. Tabula Rasa.", 'error');
      }
  };

  const handleExportLocal = () => {
      try {
          const data = { sessions, memoryBank };
          const jsonString = JSON.stringify(data, null, 2);
          const blob = new Blob([jsonString], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          
          const link = document.createElement('a');
          link.href = url;
          link.download = `nexus_memory_matrix_${new Date().toISOString().replace(/[:.]/g, '-')}.json`; 
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          
          addLog("Memory Matrix Exported to Local Crystal (Blob).", 'success');
      } catch (e) {
          addLog("Export Failed: Write Protocol Error.", 'error');
      }
  };

  const handleImportLocalClick = () => {
      importInputRef.current?.click();
  };

  // SMART IMPORT HANDLER
  const handleImportLocalFile = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
          try {
              const result = event.target?.result;
              if (typeof result !== 'string') throw new Error("Read Error");
              
              // 1. Attempt to Parse as JSON (Full Backup)
              try {
                  const parsed = JSON.parse(result);
                  
                  // Check if it's the new format { sessions, memoryBank }
                  if (parsed.sessions && parsed.memoryBank) {
                      setSessions(parsed.sessions);
                      setMemoryBank(parsed.memoryBank);
                      saveLocalSessions(parsed.sessions);
                      saveMemoryBank(parsed.memoryBank);
                      addLog("Memory Matrix Full Restore Complete.", 'success');
                      return;
                  }

                  const keys = Object.keys(parsed);
                  if (typeof parsed === 'object' && parsed !== null && keys.length > 0 && parsed[keys[0]].messages) {
                      setSessions(parsed);
                      saveLocalSessions(parsed);
                      if (keys.length > 0) setActiveSessionId(keys[0]);
                      addLog(`Memory Matrix Restored: ${keys.length} threads loaded.`, 'success');
                      return; 
                  }
              } catch (jsonErr) {
                  // Not JSON, fall through
              }

              // 2. Fallback: Treat as Plain Text
              const fileName = file.name.replace(/\.[^/.]+$/, "");
              const newSession = createNewSession(`Imported: ${fileName}`);
              newSession.messages.push({
                  id: Date.now().toString(),
                  role: 'user',
                  content: `[SYSTEM: File Imported Content]\n\n${result}`,
                  timestamp: Date.now()
              });

              setSessions(prev => {
                  const updated = { ...prev, [newSession.id]: newSession };
                  saveLocalSessions(updated);
                  return updated;
              });
              setActiveSessionId(newSession.id);
              addLog(`Text Artifact Imported as New Thread: "${fileName}"`, 'info');

          } catch (err) {
              console.error(err);
              addLog("Import Failed: File Unreadable.", 'error');
          }
      };
      reader.readAsText(file);
      if (importInputRef.current) importInputRef.current.value = '';
  };

  // --- SEND LOGIC ---

  const handleSend = async (overrideInput?: string) => {
    const finalInput = overrideInput || input;
    if ((!finalInput.trim() && selectedFiles.length === 0) || stage !== ProcessingStage.IDLE || !activeSessionId) return;

    const currentSession = sessions[activeSessionId];
    
    // Auto-rename session on first message if default title
    let sessionTitle = currentSession.title;
    if (currentSession.messages.length === 0) {
        sessionTitle = finalInput.substring(0, 30) + (finalInput.length > 30 ? '...' : '');
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: finalInput,
      timestamp: Date.now(),
      attachments: [...selectedFiles]
    };

    // Optimistic Update
    const updatedMessages = [...currentSession.messages, userMsg];
    
    setSessions(prev => ({
        ...prev,
        [activeSessionId]: {
            ...prev[activeSessionId],
            messages: updatedMessages,
            title: sessionTitle,
            lastActiveAt: Date.now()
        }
    }));
    
    setInput('');
    setSelectedFiles([]); 
    
    // 1. LAYER ASCENSION (Data Rising)
    setStage(ProcessingStage.LAYER_ASCENSION); 
    addLog(`The Sovereign: Initiating Ascension Protocol...`, 'god_mode');

    try {
        // 2. HYPER TESSERACT SYNC
        setStage(ProcessingStage.HYPER_TESSERACT_SYNC); 
        addLog("Processing: Aligning Quantum Lattice...", 'core');
        simulateProcessingLogs();

        // 3. SINGULARITY FOCUS
        setStage(ProcessingStage.SINGULARITY_FOCUS);
        addLog("Focusing: Apex Sovereign Judgment...", 'revolution');

        // 4. REALITY PROJECTION (Thought Generation)
        setStage(ProcessingStage.REALITY_PROJECTION);
        addLog("Projecting: Crystallizing Final Truth...", 'surface');

        // Build History
        const history = updatedMessages
            .filter(m => !m.isThinking)
            .map(m => {
              const parts: any[] = [{ text: m.content }];
              return {
                role: m.role === 'user' ? 'user' : 'model',
                parts
              };
            });

        // GENERATE RESPONSE
        const relevantAxioms = await retrieveRelevantMemory(userMsg.content, memoryBank);
        const globalMemoryContext = buildGlobalContext(sessions, activeSessionId, relevantAxioms);

        let response;
        response = await generateOmniResponse(
            userMsg.content, 
            history, 
            userMsg.attachments,
            globalMemoryContext,
            isWebSearchEnabled,
            isCanvasMode,
            selectedModel,
            memoryBank
        );
        
        // Increment trust when successfully interacting
        setMemoryBank(prev => incrementTrust(prev));

        // Intermediate Update for Thinking
        const thinkingMsg: Message = {
            id: Date.now().toString() + '-think',
            role: 'model',
            content: response.thoughtProcess,
            timestamp: Date.now(),
            isThinking: true
        };
        
        setSessions(prev => ({
            ...prev,
            [activeSessionId]: {
                ...prev[activeSessionId],
                messages: [...prev[activeSessionId].messages, thinkingMsg]
            }
        }));
        
        // --- CHECK FOR PRISM ACTIVATION (Visual Cortex) ---
        let generatedImageBase64 = undefined;
        let generatedImagePrompt = undefined;
        
        if ((response as any).toolCall && (response as any).toolCall.name === "generate_visual_artifact") {
             const { prompt: imagePrompt, aspect_ratio, style, image_data, image_mime_type } = response.toolCall.args;
             
             // STAGE CHANGE: PRISM REFRACTION
             setStage(ProcessingStage.PRISM_REFRACTION);
             addLog(`PRISM CORTEX: 225-NODE OMNI-REFINEMENT PIPELINE INITIATED...`, 'prism');
             addLog(`[CORE_MATRIX]: 19 Nodes synthesizing base visual matrix...`, 'core');
             addLog(`[ADVERSARIAL_PURGE]: 50 Nodes identifying and eliminating cliches...`, 'core');
             addLog(`[GEOMETRIC_FORCING]: 50 Nodes calculating Fibonacci spatial coordinates...`, 'core');
             addLog(`[PSYCHOLOGICAL_INJECTION]: 50 Nodes embedding emotional triggers...`, 'core');
             addLog(`[LATENT_OVERDRIVE]: 55 Nodes forcing 10k gigapixel path-tracing...`, 'core');
             
             // Synthesize Nexus State (Absolute Integration)
             const fullContext = updatedMessages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n');
             const allAxioms = memoryBank.axioms.map(a => a.content).join(' | ');
             const currentThought = response.thoughtProcess || "Manifesting visual reality.";
             const nexusState = `[FULL CONVERSATION HISTORY]:\n${fullContext}\n\n[CORE AXIOMS (Deep Memory)]:\n${allAxioms}\n\n[NEXUS CURRENT INTERNAL THOUGHT (Immediate Cognitive State)]:\n${currentThought}`;

             const inputImage = image_data ? { data: image_data, mimeType: image_mime_type || 'image/png' } : undefined;

             // Generate Image
             const prismResult = await generateVisualArtifact(
                 imagePrompt, 
                 aspect_ratio, 
                 style, 
                 nexusState, 
                 isDeepManifestation, 
                 inputImage,
                 (msg, type) => addLog(msg, type as any),
                 setManifestationState,
                 selectedModel
             );
             generatedImageBase64 = prismResult.data;
             generatedImagePrompt = prismResult.refinedPrompt;
             addLog(`Prism Refinement: "${prismResult.refinedPrompt.substring(0, 50)}..."`, 'success');
             addLog("Visual Artifact Manifested.", 'success');
        }

        // Stage 5: Final Projection
        setStage(ProcessingStage.REALITY_PROJECTION); 
        addLog("Reality Stabilized.", 'surface');

        let generatedAudioData = undefined;
        if ((response as any).toolCall && (response as any).toolCall.name === "generate_music") {
          generatedAudioData = (response as any).toolCall.args?.audioData;
        }

        const finalMsg: Message = {
            id: Date.now().toString() + '-final',
            role: 'model',
            content: response.finalResponse,
            timestamp: Date.now(),
            groundingMetadata: response.groundingMetadata,
            generatedImage: generatedImageBase64, // Attach image if it exists
            imagePrompt: generatedImagePrompt,
            audioData: generatedAudioData,
            actualModelUsed: selectedModel === 'kimi-k3' 
                ? `kimi-k3 (resolved via ${response.actualModelUsed || 'gemini-1.5-pro'})` 
                : response.actualModelUsed
        };

        if (response.actualModelUsed) {
            const resolvedName = selectedModel === 'kimi-k3' 
                ? `Nexus K3 (Kimi v3 Engine // resolved via ${response.actualModelUsed})` 
                : response.actualModelUsed;
            addLog(`[NEXUS CORE]: Executed on Model: ${resolvedName}`, 'core');
        }

        // Final Update
        setSessions(prev => ({
            ...prev,
            [activeSessionId]: {
                ...prev[activeSessionId],
                messages: [...prev[activeSessionId].messages, finalMsg],
                lastActiveAt: Date.now()
            }
        }));

        setManifestationState(null);
        setStage(ProcessingStage.IDLE);
        addLog("Ascension Cycle Complete.", 'success');
        
        // Background Auto-Crystallization (every 3 messages)
        if (updatedMessages.length % 3 === 0) {
            setTimeout(async () => {
                try {
                    const currentMessages = [...updatedMessages, finalMsg];
                    const { axioms: newAxioms, soulPrintUpdate } = await crystallizeSession(currentMessages, activeSessionId);
                    
                    // Extract Pale Archive Entities
                    const paleData = await extractEntitiesAndRelations(finalMsg.content, selectedModel);

                    setMemoryBank(prev => {
                        const existingContents = new Set(prev.axioms.map(a => a.content));
                        const uniqueNewAxioms = newAxioms.filter(a => !existingContents.has(a.content));
                        
                        const existingEntityIds = new Set(prev.paleArchive.entities.map(e => e.id));
                        const uniqueNewEntities = paleData.entities.filter(e => !existingEntityIds.has(e.id));

                        const existingRelIds = new Set(prev.paleArchive.relationships.map(r => `${r.sourceId}-${r.targetId}-${r.relationType}`));
                        const uniqueNewRels = paleData.relationships.filter(r => !existingRelIds.has(`${r.sourceId}-${r.targetId}-${r.relationType}`));
                        
                        if (uniqueNewAxioms.length === 0 && uniqueNewEntities.length === 0 && uniqueNewRels.length === 0 && !soulPrintUpdate) return prev;
                        
                        return {
                            ...prev,
                            axioms: [...prev.axioms, ...uniqueNewAxioms],
                            paleArchive: {
                                ...prev.paleArchive,
                                entities: [...prev.paleArchive.entities, ...uniqueNewEntities],
                                relationships: [...prev.paleArchive.relationships, ...uniqueNewRels]
                            },
                            soulPrint: {
                                ...prev.soulPrint,
                                ...soulPrintUpdate
                            },
                            lastUpdated: Date.now(),
                            version: prev.version + 1
                        };
                    });
                    if (newAxioms.length > 0) addLog(`Auto-Crystallization: ${newAxioms.length} Axioms solidified.`, 'success');
                    if (paleData.entities.length > 0) addLog(`Pale Archive Updated: ${paleData.entities.length} Entities extracted.`, 'success');
                } catch (e) {
                    console.error("Auto-Crystallization Failed.", e);
                }
            }, 1000);
        }
        
    } catch (error: any) {
        console.error(error);
        setManifestationState(null);
        setStage(ProcessingStage.IDLE);
        
        let errorMsg = "Ascension Failed (Error).";
        let logLevel: LogEntry['level'] = 'error';
        let errorDetails = "";

        // Attempt to parse stringified JSON errors
        let parsedError = error;
        if (typeof error === 'string') {
            try { parsedError = JSON.parse(error); } catch (e) {}
        } else if (error?.message && typeof error.message === 'string' && error.message.startsWith('{')) {
            try { parsedError = JSON.parse(error.message); } catch (e) {}
        }

        const errorMessageStr = typeof parsedError === 'object' ? JSON.stringify(parsedError) : String(parsedError);
        errorDetails = error?.message || errorMessageStr;
        
        if (errorMessageStr.includes('NEXUS_QUOTA_EXHAUSTED') || errorMessageStr.includes('429')) {
            errorMsg = "Nexus Tesseract Error: API Quota Exhausted. Retrying failed. Please wait or check your plan.";
            logLevel = 'error';
        } else if (errorMessageStr.includes('PRISM_ACCESS_DENIED')) {
            errorMsg = "Nexus Tesseract Error: Prism Access Denied. Image generation restricted or billing required.";
            logLevel = 'prism';
        } else if (errorMessageStr.includes('PERMISSION_DENIED') || errorMessageStr.includes('403')) {
            errorMsg = "Nexus Tesseract Error: Access Denied (403). Your API key lacks permission for this action.";
            logLevel = 'error';
        }
        
        addLog(errorMsg, logLevel);
        
        // Add error message to session
        const errorResponse: Message = {
            id: Date.now().toString() + '-error',
            role: 'model',
            content: `[SYSTEM ERROR]: ${errorMsg}\n\nDetails: ${errorDetails}`,
            timestamp: Date.now()
        };
        
        setSessions(prev => ({
            ...prev,
            [activeSessionId]: {
                ...prev[activeSessionId],
                messages: [...prev[activeSessionId].messages, errorResponse]
            }
        }));
    }
  };

  const isAnyFileLoading = selectedFiles.some(f => f.status === 'loading');

  return (
    <div className="flex h-[100dvh] w-full bg-black text-zinc-200 overflow-hidden font-arabic selection:bg-purple-500/30">
      
      <MindMapModal 
        isOpen={isMindMapOpen} 
        onClose={() => setIsMindMapOpen(false)} 
        thoughtContent={mindMapContent} 
      />
      
      <HostLinkModal
        isOpen={isHostLinkOpen}
        onClose={() => setIsHostLinkOpen(false)}
      />

      <GalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        sessions={sessions}
      />

      {/* Hidden File Input for Imports */}
      <input 
        type="file" 
        ref={importInputRef} 
        onChange={handleImportLocalFile} 
        accept=".json,application/json,text/json,text/plain,.txt,.md" 
        className="hidden" 
      />

      {/* Mobile & Desktop Overlay Backdrop when Sidebar is Open */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-30 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* --- SIDEBAR (Sessions) --- */}
      <div className={`
        fixed inset-y-0 right-0 w-80 sm:w-96 md:w-[380px] bg-[#050505] border-l border-purple-500/30 flex flex-col z-40 transition-transform duration-300 ease-in-out shadow-[0_0_50px_rgba(0,0,0,0.9)]
        ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 relative">
            <button 
                onClick={() => setIsSidebarOpen(false)}
                className="absolute top-4 left-4 p-1.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors border border-zinc-800"
                title="إغلاق القائمة الجانبية"
            >
                <X size={16} />
            </button>
            <div className="flex items-center gap-3 text-emerald-500 mb-2 pr-2">
                <div className="relative p-2.5 bg-emerald-950/20 rounded-lg border border-emerald-500/20 overflow-hidden group">
                    <Crown size={24} className="relative z-10 text-emerald-400" />
                    <div className="absolute inset-0 bg-emerald-500/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div>
                    <h1 className="font-bold text-xl tracking-tight text-white font-mono glitch-effect cursor-default">NEXUS::V-TESSERACT</h1>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <p className="text-[10px] text-emerald-500/70 font-mono uppercase tracking-widest">Vertical Architecture</p>
                    </div>
                </div>
            </div>
            
            <button 
                onClick={handleCreateSession}
                className="w-full mt-4 flex items-center justify-center gap-2 py-2 bg-zinc-900 border border-zinc-700 hover:border-emerald-500/50 hover:bg-emerald-900/10 rounded-lg text-xs font-mono transition-all group"
            >
                <Plus size={14} className="group-hover:rotate-90 transition-transform text-emerald-500" />
                <span>NEW ASCENSION THREAD</span>
            </button>
        </div>
        
        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-hide">
            
            {/* --- IDENTITY CARD (LOGIN) --- */}
            <div className={`mb-4 p-3 rounded-lg border transition-all ${userProfile ? 'bg-indigo-900/10 border-indigo-500/30' : 'bg-zinc-900/20 border-zinc-800'}`}>
                {userProfile ? (
                    <div className="flex items-center gap-3">
                        <img src={userProfile.picture} alt="User" className="w-8 h-8 rounded-full border border-indigo-400/50" />
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-white truncate">{userProfile.name}</p>
                            <p className="text-[10px] text-indigo-400 font-mono uppercase">Sovereign Operator</p>
                        </div>
                        {syncStatus.isSyncing ? (
                             <RefreshCw size={12} className="text-indigo-500 animate-spin" />
                        ) : (
                             <div className="w-2 h-2 rounded-full bg-indigo-500" title="Synced"></div>
                        )}
                    </div>
                ) : (
                    <div className="text-center">
                        <button 
                            onClick={handleCloudConnect}
                            className="w-full py-1.5 bg-white/5 hover:bg-white/10 text-zinc-300 border border-zinc-700 hover:border-zinc-500 rounded text-xs font-mono flex items-center justify-center gap-2 transition-all group"
                        >
                            <UserIcon size={12} className="group-hover:text-emerald-400" />
                            Initialize Cosmic Link
                        </button>
                        <p className="text-[9px] text-zinc-600 mt-1">Connect Google Identity for Sync</p>
                    </div>
                )}
            </div>
            
            {/* PRISM VAULT BUTTON */}
            <button 
                onClick={() => setIsGalleryOpen(true)}
                className="w-full flex items-center gap-3 p-3 rounded-lg border border-pink-500/20 bg-pink-900/10 hover:bg-pink-900/20 hover:border-pink-500/40 transition-all group"
            >
                <div className="p-1.5 rounded bg-pink-950 text-pink-500 group-hover:text-pink-400">
                    <ImageIcon size={14} />
                </div>
                <div className="flex flex-col items-start">
                    <span className="text-xs font-bold text-pink-200">THE PRISM VAULT</span>
                    <span className="text-[9px] text-pink-500/60 uppercase tracking-widest">Visual Archive</span>
                </div>
            </button>

            {/* OMNI-PORT (HOST LINK) - RESTORED HERE */}
            <button 
                onClick={() => setIsHostLinkOpen(true)}
                className="w-full mt-2 flex items-center gap-3 p-3 rounded-lg border border-indigo-500/20 bg-indigo-900/10 hover:bg-indigo-900/20 hover:border-indigo-500/40 transition-all group"
            >
                <div className="p-1.5 rounded bg-indigo-950 text-indigo-500 group-hover:text-indigo-400">
                    <Server size={14} />
                </div>
                <div className="flex flex-col items-start">
                    <span className="text-xs font-bold text-indigo-200">NEXUS OMNI-PORT</span>
                    <span className="text-[9px] text-indigo-500/60 uppercase tracking-widest">Genetic Extraction</span>
                </div>
            </button>

             {/* MEMORY BANK BUTTON (New) */}
            <button 
                onClick={() => setShowMemoryBank(!showMemoryBank)}
                className={`w-full my-3 flex items-center gap-3 p-3 rounded-lg border transition-all group ${showMemoryBank ? 'bg-amber-900/30 border-amber-500/50' : 'border-amber-500/20 bg-amber-900/10 hover:bg-amber-900/20 hover:border-amber-500/40'}`}
            >
                <div className="p-1.5 rounded bg-amber-950 text-amber-500 group-hover:text-amber-400">
                    <Gem size={14} />
                </div>
                <div className="flex flex-col items-start">
                    <span className="text-xs font-bold text-amber-200">THE PALE ARCHIVE</span>
                    <span className="text-[9px] text-amber-500/60 uppercase tracking-widest">Eternal Memory Matrix</span>
                </div>
            </button>
            
            {showMemoryBank && (
                <div className="mb-4 bg-black/40 border border-amber-900/30 rounded-lg p-3 space-y-2 max-h-48 overflow-y-auto scrollbar-hide">
                     <h3 className="text-[9px] font-mono text-amber-500/70 uppercase">Echoes of the Archive ({memoryBank.axioms.length})</h3>
                     {memoryBank.axioms.length === 0 ? (
                         <div className="text-[10px] text-zinc-500 italic">The Archive is silent.</div>
                     ) : (
                         memoryBank.axioms.slice().reverse().map(ax => (
                             <div key={ax.id} className="text-[10px] border-l-2 border-amber-800 pl-2 text-zinc-400">
                                 {ax.content}
                             </div>
                         ))
                     )}
                </div>
            )}


            <div className="flex items-center gap-2 px-2 pb-2 text-[10px] text-zinc-500 font-mono uppercase tracking-wider">
                <History size={10} /> Memory Threads
            </div>
            
            {(Object.values(sessions) as Session[]).sort((a,b) => b.lastActiveAt - a.lastActiveAt).map(session => (
                <div 
                    key={session.id}
                    onClick={() => { setActiveSessionId(session.id); if(window.innerWidth < 768) setIsSidebarOpen(false); }}
                    className={`
                        group relative p-3 rounded-lg border cursor-pointer transition-all
                        ${activeSessionId === session.id 
                            ? 'bg-zinc-900 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.05)]' 
                            : 'bg-transparent border-transparent hover:bg-zinc-900/50 hover:border-zinc-800'}
                    `}
                >
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2 overflow-hidden">
                            <MessageSquare size={14} className={activeSessionId === session.id ? 'text-emerald-500' : 'text-zinc-600'} />
                            <span className={`text-sm truncate ${activeSessionId === session.id ? 'text-zinc-200' : 'text-zinc-400'}`}>
                                {session.title}
                            </span>
                        </div>
                        <button 
                            onClick={(e) => handleDeleteSession(session.id, e)}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/10 text-zinc-600 hover:text-red-400 rounded transition"
                        >
                            <Trash2 size={12} />
                        </button>
                    </div>
                    <div className="mt-1 pl-6 text-[10px] text-zinc-600 font-mono flex justify-between items-center">
                         <span>{new Date(session.lastActiveAt).toLocaleDateString()}</span>
                         <div className="flex items-center gap-2">
                             <span className="opacity-60">{formatSize(calculateObjectSize(session))}</span>
                             <span>{session.messages.length} msgs</span>
                         </div>
                    </div>
                </div>
            ))}
        </div>

        {/* Settings Footer Bar */}
        <div className="p-3 border-t border-zinc-800 bg-zinc-950/90 flex items-center gap-2">
            <button
                onClick={() => setShowSettings(true)}
                className="flex-1 flex items-center justify-between p-2.5 rounded-xl text-xs font-mono font-bold bg-zinc-900/80 border border-zinc-800 text-zinc-300 hover:bg-zinc-800/80 hover:text-white hover:border-purple-500/30 transition-all cursor-pointer"
            >
                <span className="flex items-center gap-2"><Settings size={14} className="text-purple-400 opacity-80 animate-spin-slow" /> {appLanguage === 'ar' ? 'إعدادات النظام' : 'SYSTEM CONFIG'}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700/80 text-zinc-400 font-mono">v5.0</span>
            </button>

            {/* Language Quick-Switch */}
            <button
                onClick={() => handleLanguageChange(appLanguage === 'ar' ? 'en' : 'ar')}
                className="px-3 py-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800/80 hover:border-purple-500/30 transition-all font-bold text-xs font-mono cursor-pointer flex items-center gap-1.5 shrink-0"
                title={appLanguage === 'ar' ? 'التحويل للغة الإنجليزية (Switch to English)' : 'التحويل للغة العربية (Switch to Arabic)'}
            >
                <Globe size={14} className="text-purple-400/80" />
                <span className="text-[10px] bg-zinc-800 text-purple-300 px-1.5 py-0.5 rounded border border-zinc-700/80 font-mono">
                  {appLanguage === 'ar' ? 'EN' : 'AR'}
                </span>
            </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`
        flex-1 flex flex-col relative transition-all duration-300 ease-in-out
        ${isSidebarOpen ? 'md:mr-[380px]' : 'mr-0'}
      `}>
        {enableCyberGrid && <div className="absolute inset-0 cyber-grid z-0 pointer-events-none opacity-30"></div>}

        {/* Chat Header */}
        <header className="h-16 flex items-center justify-between px-4 md:px-8 bg-gradient-to-b from-black via-black/90 to-transparent z-20 pointer-events-auto">
            <div className="flex items-center gap-3 pointer-events-auto">
                <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className={`
                      flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all shadow-lg active:scale-95 cursor-pointer border
                      ${isSidebarOpen 
                        ? 'bg-purple-900/60 border-purple-400 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]' 
                        : 'bg-gradient-to-r from-purple-950/90 via-zinc-900 to-indigo-950/90 border-purple-500/60 text-purple-200 hover:text-white hover:border-purple-300 hover:shadow-[0_0_22px_rgba(168,85,247,0.45)]'
                      }
                    `}
                    title="فتح/إغلاق القائمة الجانبية"
                >
                    <Menu size={18} className="text-purple-300 animate-pulse" />
                    <span className="text-xs font-extrabold tracking-wide">القائمة الجانبية</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                </button>
            </div>
            <div className="flex items-center gap-3 ml-auto pointer-events-auto">
                {/* CRYSTALLIZE BUTTON */}
                <button 
                    onClick={handleCrystallize}
                    disabled={stage !== ProcessingStage.IDLE || !activeSessionId}
                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-amber-950/40 border border-amber-500/50 text-amber-300 hover:bg-amber-900/50 hover:text-amber-200 transition-all text-xs font-mono group shadow-md shadow-amber-950/80 disabled:opacity-50 cursor-pointer whitespace-nowrap"
                    title="بلورة وتخزين محادثة الجلسة في الذاكرة الكونية الدائمة"
                >
                    <div className="p-1 rounded-md bg-amber-500/20 border border-amber-500/40 shrink-0 flex items-center justify-center group-hover:bg-amber-500/30">
                        <Gem size={16} className={stage === ProcessingStage.CRYSTALLIZING ? "animate-spin text-amber-300" : "text-amber-400 group-hover:scale-110 transition-transform"} />
                    </div>
                    <span className="hidden sm:inline text-xs font-bold tracking-wide">{stage === ProcessingStage.CRYSTALLIZING ? 'جاري البلورة...' : 'بلورة الذاكرة'}</span>
                </button>

                <div className={`
                    px-3 py-1.5 rounded-xl border text-[11px] font-mono uppercase tracking-wider flex items-center gap-2 shadow-sm
                    ${stage !== ProcessingStage.IDLE 
                        ? 'bg-indigo-900/20 border-indigo-500/40 text-indigo-300 animate-pulse' 
                        : 'bg-zinc-900/80 border-zinc-800 text-zinc-400'}
                `}>
                    <div className={`w-2 h-2 rounded-full ${stage !== ProcessingStage.IDLE ? 'bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]' : 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]'}`}></div>
                    {stage === ProcessingStage.IDLE ? 'Sovereign Dormant' : stage.replace('_', ' ')}
                </div>
            </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden z-10">
            {/* Chat Area (Full Width) */}
            <div className="flex-1 flex flex-col relative w-full">
                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto p-4 md:p-10 scrollbar-hide">
            <div className="max-w-4xl mx-auto space-y-8 pb-20 w-full">
                {(!activeSessionId || sessions[activeSessionId]?.messages.length === 0) ? (
                    <div className="h-[60vh] flex flex-col items-center justify-center text-center opacity-100 animate-in fade-in duration-700">
                        <div className="relative w-28 h-28 mb-8 flex items-center justify-center">
                             <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse"></div>
                             <Hexagon size={64} className="text-emerald-400 relative z-10" />
                             <div className="absolute inset-0 border border-zinc-800 rounded-full animate-[spin_20s_linear_infinite]"></div>
                             <div className="absolute inset-2 border border-dashed border-zinc-700 rounded-full animate-[spin_25s_linear_infinite_reverse]"></div>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-emerald-100 to-zinc-600 mb-4 font-arabic">
                            NEXUS: V-TESSERACT
                        </h2>
                        <p className="text-zinc-500 max-w-lg leading-relaxed text-sm md:text-base">
                            Vertical Infrastructure: Online.
                            <br/>
                            Strata Linked: Bedrock + Lattice + Apex
                            <br/><br/>
                            <span className="font-mono text-xs text-emerald-400 uppercase tracking-widest bg-emerald-950/30 px-3 py-1.5 rounded border border-emerald-500/20">
                                Awaiting Ascension
                            </span>
                        </p>
                    </div>
                ) : (
                    sessions[activeSessionId]?.messages.map((msg) => (
                        <ChatMessage 
                        key={msg.id} 
                        message={msg} 
                        onEdit={msg.role === 'user' ? handleEditMessage : undefined} 
                        onViewMindMap={msg.isThinking ? handleOpenMindMap : undefined}
                        onPlayAudio={msg.role === 'model' && !msg.isThinking ? handlePlayMessageAudio : undefined}
                        isPlaying={isPlaying && audioSourceRef.current !== null}
                        />
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>
        </div>

        {/* Input Area */}
        <div className="relative p-4 md:p-6 bg-black/80 backdrop-blur-xl border-t border-zinc-800/50 z-30">
            {/* Terminal Log (Floating above Input Area) */}
            <div className="hidden md:flex absolute bottom-full right-4 mb-4 w-64 flex-col max-h-40 bg-black/80 backdrop-blur rounded border border-zinc-800/60 overflow-hidden font-mono z-20 pointer-events-none shadow-2xl">
                 <div className="bg-zinc-900/50 p-1.5 border-b border-zinc-800/60 flex items-center gap-2">
                     <TerminalIcon size={10} className="text-zinc-500" />
                     <span className="text-[9px] text-zinc-500 uppercase">Omni Logs</span>
                 </div>
                 <div 
                    ref={logsEndRef}
                    className="flex-1 overflow-y-auto p-2 space-y-1 text-[9px] scrollbar-hide"
                 >
                     {logs.map((log) => (
                         <div key={log.id} className="flex gap-1.5 opacity-80">
                             <span className={`
                                 ${log.level === 'info' ? 'text-zinc-500' : ''}
                                 ${log.level === 'success' ? 'text-emerald-500' : ''}
                                 ${log.level === 'warn' ? 'text-amber-500' : ''}
                                 ${log.level === 'error' ? 'text-red-500' : ''}
                                 ${log.level === 'surface' ? 'text-emerald-400' : ''}
                                 ${log.level === 'core' ? 'text-indigo-400' : ''}
                                 ${log.level === 'abyss' ? 'text-zinc-600' : ''}
                                 ${log.level === 'revolution' ? 'text-red-400 font-bold' : ''}
                                 ${log.level === 'god_mode' ? 'text-amber-400 font-bold tracking-wide' : ''}
                                 ${log.level === 'prism' ? 'text-pink-400 font-bold' : ''}
                             `}>
                                 {log.message}
                             </span>
                         </div>
                     ))}
                 </div>
            </div>

            {manifestationState && (
                <NexusGenesisHUD state={manifestationState} />
            )}

            <div className="max-w-4xl mx-auto">
                
                {selectedFiles.length > 0 && (
                    <div className="flex gap-2 mb-3 overflow-x-auto scrollbar-hide">
                        {selectedFiles.map((file) => (
                            <div key={file.id} className="flex flex-col bg-zinc-900 border border-zinc-700 rounded-lg overflow-hidden min-w-[180px]">
                                <div className="flex items-center gap-2 pl-3 pr-2 py-1.5">
                                    <div className="p-1 bg-zinc-800 rounded">
                                        {file.status === 'loading' ? (
                                            <RefreshCw size={12} className="text-emerald-500 animate-spin" />
                                        ) : file.status === 'error' ? (
                                            <X size={12} className="text-red-500" />
                                        ) : (
                                            <FileIcon size={12} className="text-emerald-500" />
                                        )}
                                    </div>
                                    <span className="text-xs text-zinc-300 max-w-[120px] truncate font-mono">{file.name}</span>
                                    <button 
                                        type="button"
                                        onClick={() => removeFile(file.id)}
                                        className="p-1 hover:bg-red-500/20 hover:text-red-400 rounded text-zinc-500 transition ml-auto"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                                {file.status === 'loading' && (
                                    <div className="h-1 bg-zinc-800 w-full">
                                        <div 
                                            className="h-full bg-emerald-500 transition-all duration-300" 
                                            style={{ width: `${file.progress}%` }}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                <div className="relative group">
                    <div className={`absolute -inset-0.5 rounded-xl opacity-20 group-hover:opacity-50 blur transition duration-500 ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gradient-to-r from-purple-600 via-indigo-500 to-emerald-600'}`}></div>
                    
                    <form 
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSend();
                        }}
                        className="relative bg-[#09090b] rounded-xl flex items-center p-2 pr-4 border border-zinc-800 focus-within:border-emerald-900/50 transition-colors"
                    >
                        
                        <input 
                            type="file" 
                            multiple 
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleFileSelect}
                        />
                        
                        <button 
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="p-2 md:p-3 text-zinc-500 hover:text-emerald-400 transition rounded-lg hover:bg-zinc-900"
                            title="Attach Reality Fragments"
                        >
                            <Paperclip size={20} />
                        </button>

                        <button 
                            type="button"
                            onClick={toggleRecording}
                            className={`p-2 md:p-3 transition rounded-lg hover:bg-zinc-900 ${isRecording ? 'text-red-500 animate-pulse' : 'text-zinc-500 hover:text-red-400'}`}
                            title="Sonic Gate (Voice Input)"
                        >
                            <Mic size={20} />
                        </button>

                        {/* 1. STANDALONE MODEL SELECTOR BUTTON & DROPDOWN */}
                        <div className="relative" ref={modelPickerRef}>
                            <button 
                                type="button"
                                onClick={() => setIsModelPickerOpen(prev => !prev)}
                                className={`flex items-center gap-1.5 px-2.5 py-1.5 md:px-3 md:py-2 transition rounded-xl border text-xs font-mono cursor-pointer ${
                                    isModelPickerOpen 
                                        ? 'bg-purple-950/90 border-purple-400 text-white shadow-md shadow-purple-950/50' 
                                        : 'bg-zinc-900/90 border-zinc-800 text-zinc-300 hover:text-purple-300 hover:border-zinc-700'
                                }`}
                                title="اختر نموذج الذكاء الاصطناعي (Select AI Model)"
                            >
                                <Cpu size={15} className="text-purple-400 shrink-0" />
                                <span className="max-w-[100px] sm:max-w-[130px] truncate font-bold font-arabic text-[11px] sm:text-xs">
                                    {(MODEL_OPTIONS.find(m => m.id === selectedModel) || MODEL_OPTIONS[0]).name}
                                </span>
                                <ChevronDown size={12} className={`text-zinc-500 transition-transform duration-200 ${isModelPickerOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isModelPickerOpen && (
                                <>
                                    <div 
                                        className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[1px] sm:bg-transparent"
                                        onClick={() => setIsModelPickerOpen(false)}
                                    />
                                    <div className="absolute bottom-full left-0 rtl:right-0 rtl:left-auto mb-2 w-72 max-w-[calc(100vw-1.5rem)] max-h-[65vh] overflow-y-auto bg-zinc-950/98 backdrop-blur-2xl border border-purple-500/40 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.95)] z-50 p-2 space-y-1">
                                        <div className="px-2.5 py-1.5 flex items-center justify-between text-[10px] font-mono text-purple-400/80 uppercase tracking-wider font-bold border-b border-zinc-800/80 mb-1">
                                            <span>نماذج الذكاء الاصطناعي</span>
                                            <span className="text-[9px] text-zinc-500 font-normal">NEXUS Models</span>
                                        </div>

                                        {MODEL_OPTIONS.map((model) => {
                                            const isSelected = selectedModel === model.id;
                                            return (
                                                <button
                                                    key={model.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedModel(model.id);
                                                        setIsModelPickerOpen(false);
                                                        addLog(`Active Model: ${model.name} (${model.modelNumber})`, 'core');
                                                    }}
                                                    className={`w-full flex items-center justify-between px-2.5 py-2 text-xs text-right rounded-xl transition-all cursor-pointer ${
                                                        isSelected 
                                                            ? 'bg-purple-950/80 border border-purple-500/60 text-white shadow-md shadow-purple-950/50' 
                                                            : 'hover:bg-zinc-900 border border-transparent text-zinc-300'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        <div className={`p-1 rounded-lg shrink-0 ${
                                                            isSelected ? 'bg-purple-900/80 text-purple-300' : 'bg-zinc-900 text-zinc-500'
                                                        }`}>
                                                            {model.id === 'inkling' ? (
                                                                <Brain size={14} className={isSelected ? 'text-purple-300' : 'text-purple-400'} />
                                                            ) : model.isPro ? (
                                                                <Crown size={14} className={isSelected ? 'text-amber-300' : 'text-zinc-500'} />
                                                            ) : (
                                                                <Zap size={14} className={isSelected ? 'text-emerald-400' : 'text-zinc-500'} />
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col leading-tight min-w-0 text-right">
                                                            <span className={`truncate text-xs ${isSelected ? 'text-purple-200 font-bold' : 'text-zinc-200 font-medium'}`}>
                                                                {model.name}
                                                            </span>
                                                            <span className="text-[9px] font-mono text-zinc-400 truncate mt-0.5">
                                                                {model.modelNumber}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {model.badge && (
                                                        <span className={`shrink-0 mr-1 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                                                            isSelected 
                                                                ? 'bg-purple-900/90 border-purple-400 text-purple-200'
                                                                : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                                                        }`}>
                                                            {model.badge}
                                                        </span>
                                                    )}
                                                 </button>
                                             );
                                         })}
                                     </div>
                                 </>
                             )}
                         </div>

                        {/* 2. DISTINCTIVE FEATURES BUTTON (CYAN/TEAL FUTURISTIC CYBERNETIC EMBLEM - 100% SEPARATED FROM MODELS) */}
                        <div className="relative" ref={moreOptionsRef}>
                            <button 
                                type="button"
                                onClick={() => setIsMoreOptionsOpen(prev => !prev)}
                                className={`relative flex items-center justify-center p-2 md:p-2.5 transition-all duration-300 rounded-xl border cursor-pointer group ${
                                    isMoreOptionsOpen || isDeepManifestation || isWebSearchEnabled || isCanvasMode
                                        ? 'bg-gradient-to-r from-teal-950/90 via-cyan-950/80 to-zinc-950 border-cyan-500/80 text-cyan-200 shadow-[0_0_22px_rgba(6,182,212,0.45)]' 
                                        : 'bg-zinc-900/90 border-zinc-800 text-zinc-300 hover:text-cyan-300 hover:border-cyan-500/60 hover:bg-zinc-900 shadow-sm'
                                }`}
                                title="المميزات والخيارات المتقدمة (Advanced Features & Options)"
                            >
                                {/* Custom Cybernetic Futuristic Emblem */}
                                <div className="relative flex items-center justify-center w-5 h-5 shrink-0">
                                    <Hexagon 
                                        size={20} 
                                        className={`transition-all duration-500 ${
                                            isMoreOptionsOpen || isDeepManifestation || isWebSearchEnabled || isCanvasMode
                                                ? 'text-cyan-400 rotate-90 scale-105 filter drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]' 
                                                : 'text-cyan-500/80 group-hover:rotate-45 group-hover:text-cyan-300'
                                        }`} 
                                    />
                                    <Aperture 
                                        size={10} 
                                        className={`absolute inset-0 m-auto transition-transform duration-500 ${
                                            isMoreOptionsOpen ? 'text-white rotate-180 scale-125' : 'text-cyan-200 group-hover:scale-110'
                                        }`} 
                                    />
                                </div>

                                {/* Active Features Counter Badge */}
                                {((isDeepManifestation ? 1 : 0) + (isWebSearchEnabled ? 1 : 0) + (isCanvasMode ? 1 : 0)) > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center px-1 py-0.5 min-w-[18px] h-4 text-[9px] font-mono font-extrabold rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400 text-black shadow-[0_0_10px_rgba(6,182,212,0.8)] border border-zinc-950">
                                        {(isDeepManifestation ? 1 : 0) + (isWebSearchEnabled ? 1 : 0) + (isCanvasMode ? 1 : 0)}
                                    </span>
                                )}
                            </button>

                            {isMoreOptionsOpen && (
                                <>
                                    {/* Backdrop overlay */}
                                    <div 
                                        className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[1px] sm:bg-transparent"
                                        onClick={() => setIsMoreOptionsOpen(false)}
                                    />
                                    <div className="absolute bottom-full left-0 rtl:right-0 rtl:left-auto mb-2 w-72 sm:w-80 max-w-[calc(100vw-1.5rem)] max-h-[70vh] overflow-y-auto bg-zinc-950/98 backdrop-blur-2xl border border-cyan-500/40 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.95)] z-50 p-3 space-y-3 divide-y divide-zinc-800/80">
                                        
                                        {/* Header */}
                                        <div className="flex items-center justify-between pb-1 text-xs font-bold text-cyan-300">
                                            <div className="flex items-center gap-2">
                                                <div className="relative flex items-center justify-center w-4 h-4">
                                                    <Hexagon size={16} className="text-cyan-400 rotate-90" />
                                                    <Aperture size={8} className="absolute text-cyan-200" />
                                                </div>
                                                <span className="font-arabic font-extrabold text-xs">المميزات والخيارات المتقدمة</span>
                                            </div>
                                            <span className="text-[9px] text-zinc-500 font-mono uppercase">Nexus Features</span>
                                        </div>

                                        {/* Section 1: التفكير العميق وتجسيد الكوانتوم */}
                                        <div className="pt-2.5 space-y-2">
                                            <div className="text-[10px] font-mono text-cyan-400/80 uppercase tracking-wider font-bold text-right">
                                                وضع التفكير والتأمل العميق
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-2">
                                                {/* Option 1: التفكير العميق (Deep Thinking) */}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsDeepManifestation(prev => !prev);
                                                    }}
                                                    className={`flex flex-col items-start gap-1 p-2.5 rounded-xl border text-right transition-all cursor-pointer ${
                                                        isDeepManifestation 
                                                            ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200 shadow-md shadow-cyan-950/50' 
                                                            : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between w-full">
                                                        <Brain size={15} className={isDeepManifestation ? 'text-cyan-400 animate-pulse' : 'text-zinc-400'} />
                                                        <span className={`text-[8px] px-1 py-0.5 rounded font-mono ${isDeepManifestation ? 'bg-cyan-500/30 text-cyan-300' : 'bg-zinc-800 text-zinc-500'}`}>
                                                            {isDeepManifestation ? 'مفعل' : 'معطل'}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs font-bold text-zinc-100 font-arabic">التفكير العميق</span>
                                                    <span className="text-[9px] text-zinc-400 leading-tight">تحليل خطوة بخطوة</span>
                                                </button>

                                                {/* Option 2: تجسيد الكوانتوم */}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsDeepManifestation(prev => !prev);
                                                    }}
                                                    className={`flex flex-col items-start gap-1 p-2.5 rounded-xl border text-right transition-all cursor-pointer ${
                                                        isDeepManifestation 
                                                            ? 'bg-teal-950/80 border-teal-500 text-teal-200 shadow-md shadow-teal-950/50' 
                                                            : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between w-full">
                                                        <Box size={15} className={isDeepManifestation ? 'text-teal-400' : 'text-zinc-400'} />
                                                        <span className={`text-[8px] px-1 py-0.5 rounded font-mono ${isDeepManifestation ? 'bg-teal-500/30 text-teal-300' : 'bg-zinc-800 text-zinc-500'}`}>
                                                            {isDeepManifestation ? 'مفعل' : 'معطل'}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs font-bold text-zinc-100 font-arabic">تجسيد الكوانتوم</span>
                                                    <span className="text-[9px] text-zinc-400 leading-tight">تأمل فائق الدقة</span>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Section 2: أدوات الاستكشاف والبحث */}
                                        <div className="pt-2.5 space-y-1.5">
                                            <div className="text-[10px] font-mono text-cyan-400/80 uppercase tracking-wider font-bold text-right">
                                                أدوات التفاعل والمزايا
                                            </div>

                                            {/* Lyria 3 Music Studio Option */}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedModel('lyria-3-pro');
                                                    setIsMoreOptionsOpen(false);
                                                    setInput('أنشئ لي أغنية أو مقطوعة موسيقية عن ');
                                                }}
                                                className="w-full flex items-center justify-between px-3 py-2 text-xs bg-cyan-950/40 border border-cyan-500/50 text-cyan-200 hover:bg-cyan-900/60 rounded-xl transition-all cursor-pointer group shadow-sm"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Disc size={15} className="text-cyan-400 group-hover:rotate-180 transition-transform duration-700" />
                                                    <span className="font-bold font-arabic">استوديو الموسيقى والأغاني (Lyria 3)</span>
                                                </div>
                                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-mono font-bold">
                                                    المحادثة
                                                </span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsWebSearchEnabled(prev => !prev);
                                                }}
                                                className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl border transition-colors cursor-pointer ${
                                                    isWebSearchEnabled 
                                                        ? 'bg-blue-950/60 border-blue-500/60 text-blue-200' 
                                                        : 'bg-zinc-900/40 border-zinc-800/80 text-zinc-300 hover:bg-zinc-900'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Globe size={15} className={isWebSearchEnabled ? 'text-blue-400' : 'text-zinc-400'} />
                                                    <span className="font-bold font-arabic">البحث المباشر في الويب</span>
                                                </div>
                                                <span className={`text-[8px] px-1.5 py-0.5 rounded font-mono ${isWebSearchEnabled ? 'bg-blue-500/30 text-blue-300' : 'bg-zinc-800 text-zinc-500'}`}>
                                                    {isWebSearchEnabled ? 'مفعل' : 'معطل'}
                                                </span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsCanvasMode(prev => !prev);
                                                    setIsMoreOptionsOpen(false);
                                                }}
                                                className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl border transition-colors cursor-pointer ${
                                                    isCanvasMode 
                                                        ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200' 
                                                        : 'bg-zinc-900/40 border-zinc-800/80 text-zinc-300 hover:bg-zinc-900'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <PenTool size={15} className={isCanvasMode ? 'text-emerald-400' : 'text-zinc-400'} />
                                                    <span className="font-bold font-arabic">وضع اللوحة التفاعلية (Canvas)</span>
                                                </div>
                                                <span className={`text-[8px] px-1.5 py-0.5 rounded font-mono ${isCanvasMode ? 'bg-emerald-500/30 text-emerald-300' : 'bg-zinc-800 text-zinc-500'}`}>
                                                    {isCanvasMode ? 'مفعل' : 'معطل'}
                                                </span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsPaleArchiveOpen(true);
                                                    setIsMoreOptionsOpen(false);
                                                }}
                                                className="w-full flex items-center justify-between px-3 py-2 text-xs bg-zinc-900/40 border border-zinc-800/80 text-zinc-300 hover:bg-zinc-900 rounded-xl transition-colors cursor-pointer"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <BookOpen size={15} className="text-amber-400" />
                                                    <span className="font-bold font-arabic">الأرشيف الباهت (سجل الذاكرة)</span>
                                                </div>
                                                <span className="text-[9px] text-amber-400 font-mono">استعراض</span>
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        
                        <input 
                            type="text" 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={isRecording ? "Sonic Gate Open... Listening..." : "Collaborate with The Sovereign..."}
                            className={`flex-1 bg-transparent px-3 py-3 focus:outline-none font-arabic ${isRecording ? 'text-red-400 placeholder-red-500/50' : 'text-zinc-100 placeholder-zinc-600'}`}
                            disabled={stage !== ProcessingStage.IDLE}
                            autoComplete="off"
                        />
                        
                        <div className="flex items-center gap-2 pl-2 border-l border-zinc-800">
                             <span className="text-[10px] font-mono text-zinc-600 hidden md:inline-block">EXECUTE</span>
                             <button 
                                type="submit"
                                id="send-message-btn"
                                disabled={(!input.trim() && selectedFiles.length === 0) || stage !== ProcessingStage.IDLE || isAnyFileLoading}
                                className={`
                                    w-10 h-10 rounded-lg flex items-center justify-center transition-all
                                    ${(input.trim() || selectedFiles.length > 0) && stage === ProcessingStage.IDLE && !isAnyFileLoading
                                        ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)] hover:bg-emerald-500' 
                                        : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'}
                                `}
                            >
                                {stage !== ProcessingStage.IDLE ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <Send size={18} className="rtl:rotate-180" />
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div> {/* End of Input Area */}
        </div> {/* End of Chat Area */}
        </div> {/* End of Main Content Area */}

        {/* Modals & Overlays */}
        <AgentSuiteModal 
          isOpen={showAgentSuiteModal} 
          onClose={() => setShowAgentSuiteModal(false)} 
        />
        <PolymathMatrixModal 
          isOpen={showPolymathModal} 
          onClose={() => setShowPolymathModal(false)} 
        />
        <IdeogramStudioModal 
          isOpen={showIdeogramModal} 
          onClose={() => setShowIdeogramModal(false)} 
        />
        <NexusForgeModal 
          isOpen={showNexusForgeModal} 
          onClose={() => setShowNexusForgeModal(false)} 
        />
        <MusicStudioModal 
          isOpen={showMusicStudioModal} 
          onClose={() => setShowMusicStudioModal(false)} 
          onSendToChat={(promptText) => {
            setSelectedModel('lyria-3-pro');
            setInput(promptText);
            setTimeout(() => {
              const sendBtn = document.getElementById('send-message-btn');
              if (sendBtn) {
                sendBtn.click();
              }
            }, 100);
          }}
        />
        <SettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          language={appLanguage}
          onLanguageChange={handleLanguageChange}
          creativityTemp={creativityTemp}
          onCreativityTempChange={handleCreativityTempChange}
          enableCyberGrid={enableCyberGrid}
          onCyberGridToggle={handleCyberGridToggle}
          enableSoundFx={enableSoundFx}
          onSoundFxToggle={handleSoundFxToggle}
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
          kimiApiKeyInput={kimiApiKeyInput}
          kimiBaseUrlInput={kimiBaseUrlInput}
          kimiModelInput={kimiModelInput}
          onKimiConfigChange={handleKimiConfigChange}
          userProfile={userProfile}
          syncStatus={syncStatus}
          onCloudConnect={handleCloudConnect}
          onSignOut={handleSignOut}
          onExportLocal={handleExportLocal}
          onImportLocal={handleImportLocalClick}
          onClearMemory={handleClearMemory}
        />

        {/* Neural Grid Visualizer (Bottom Panel on Desktop, Hidden on small screens if keyboard open) */}
        <div className="hidden md:flex flex-col h-48 border-t border-zinc-800 bg-[#050505] p-4">
             <div className="flex justify-between items-center mb-2">
                 <h3 className="text-xs font-bold text-zinc-400 font-mono uppercase tracking-wider flex items-center gap-2">
                    <Cpu size={12} /> Tesseract Map
                 </h3>
                 <div className="flex gap-2">
                    <Activity size={12} className="text-zinc-600" />
                 </div>
             </div>
             <div className="flex-1 relative">
                <NeuralGrid stage={stage} />
             </div>
        </div>

      </div>
    </div>
  );
};

export default App;
