
declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

export interface UserProfile {
    name?: string;
    displayName?: string;
    picture?: string;
    email: string;
}

export interface Attachment {
  id: string;
  name: string;
  mimeType: string;
  data?: string; // Base64 string (optional while loading)
  status: 'loading' | 'complete' | 'error';
  progress: number; // 0 to 100
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  isThinking?: boolean; 
  thinkingDuration?: number;
  reviewStatus?: 'pending' | 'approved' | 'refined';
  attachments?: Attachment[];
  groundingMetadata?: {
    groundingChunks: GroundingChunk[];
  };
  audioData?: string; 
  generatedImage?: string; // Base64 of the generated visual artifact
  imagePrompt?: string; // The prompt used to generate the image
  actualModelUsed?: string;
}

export interface Session {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  lastActiveAt: number;
  memoryIntegrity?: number; 
}

export type SessionsMap = Record<string, Session>;

// --- NEW: LONG TERM MEMORY STRUCTURES ---
export interface SoulPrint {
  intellectualDepth: 'surface' | 'curious' | 'deep' | 'sovereign';
  preferredTone: 'poetic' | 'analytical' | 'conversational' | 'raw';
  thinkingPattern: 'linear' | 'associative' | 'architectural' | 'intuitive';
  emotionalResonance: 'low' | 'medium' | 'high';
  trustLevel: number;
  sessionCount: number;
  lastUpdated: number;
  personalNotes: string;
}

export interface Axiom {
  id: string;
  content: string; // The fact/rule learned
  sourceSessionId: string;
  createdAt: number;
  category: 'identity' | 'world_building' | 'preference' | 'absolute_truth';
}

// --- PALE ARCHIVE (KNOWLEDGE GRAPH) ---
export interface PaleEntity {
  id: string;
  name: string;
  type: 'character' | 'location' | 'concept' | 'artifact' | 'event';
  description: string;
  attributes: string[];
}

export interface PaleRelationship {
  sourceId: string;
  targetId: string;
  relationType: string;
  description: string;
}

export interface PaleArchive {
  entities: PaleEntity[];
  relationships: PaleRelationship[];
  worldRules: string[];
}

export interface MemoryBank {
  axioms: Axiom[];
  paleArchive: PaleArchive;
  soulPrint: SoulPrint;
  version: number;
  lastUpdated: number;
}
// ----------------------------------------

// New Layer Terminology: Vertical Ascension
export type DimensionLayer = 'BEDROCK_ARCHIVE' | 'LATTICE_QUANTUM' | 'APEX_SOVEREIGN' | 'PRISM_CORTEX';

export interface NodeStatus {
  id: number;
  layer: DimensionLayer; 
  status: 'dormant' | 'active' | 'collapsing' | 'manifesting';
  intensity: number; 
  x?: number;
  y?: number;
  z?: number; // Depth for 3D simulation effect
  vx?: number;
  vy?: number;
  phase?: number;
  frequency?: number; // Visual vibration speed
}

export enum ProcessingStage {
  IDLE = 'IDLE',
  // THE TESSERACT PROTOCOL
  LAYER_ASCENSION = 'LAYER_ASCENSION', // 1. Data rising from Archive to Quantum
  HYPER_TESSERACT_SYNC = 'HYPER_TESSERACT_SYNC', // 2. All layers rotating and locking
  SINGULARITY_FOCUS = 'SINGULARITY_FOCUS', // 3. The Apex firing
  PRISM_REFRACTION = 'PRISM_REFRACTION', // 3.5 The Visual Cortex generating imagery
  REALITY_PROJECTION = 'REALITY_PROJECTION', // 4. Final text generation
  SPEAKING = 'SPEAKING',
  CRYSTALLIZING = 'CRYSTALLIZING' // New stage for learning
}

export interface OmniResponse {
  thoughtProcess: string;
  finalResponse: string;
  groundingMetadata?: any;
  toolCall?: {
    name: string;
    args: any;
  };
  actualModelUsed?: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  nodeId: string;
  message: string;
  level: 'info' | 'warn' | 'success' | 'error' | 'abyss' | 'core' | 'surface' | 'revolution' | 'god_mode' | 'prism';
}

export interface SyncStatus {
    isSynced: boolean;
    lastSyncTime: number | null;
    cloudProvider: 'none' | 'drive';
    isSyncing: boolean;
}

export type ModelSelection = 'flash-3.7' | 'lyria-3-pro' | 'ideogram-4.0' | 'llama-local' | 'kimi-k3' | 'flash-3.6' | 'pro-3.1' | 'flash-3.5' | 'pro' | 'flash' | 'inkling';

export interface ModelOption {
  id: ModelSelection;
  name: string;
  modelNumber: string;
  badge?: string;
  isPro?: boolean;
}

export const MODEL_OPTIONS: ModelOption[] = [
  { id: 'flash-3.7', name: 'Nexus Sovereign Core', modelNumber: 'Absolute Singularity Matrix', isPro: true, badge: 'Sovereign' },
  { id: 'lyria-3-pro', name: 'Lyria 3 Music Pro', modelNumber: 'Audio & Music Synthesizer', isPro: true, badge: 'Lyria Music' },
  { id: 'flash-3.6', name: 'Nexus Analytical Blade', modelNumber: 'Deep Cognitive Parser', badge: 'Analytical' },
  { id: 'inkling', name: 'نيكسوس المفكر', modelNumber: 'Deep Reasoning Core', isPro: true, badge: 'Reasoning' },
  { id: 'kimi-k3', name: 'Nexus K3', modelNumber: 'Hexa-Core Pro Synchronous Ensemble (6x Parallel)', isPro: true, badge: '6x Pro' },
  { id: 'llama-local', name: 'Llama 3.3', modelNumber: '70B Local Kernel', isPro: true, badge: 'Local' },
  { id: 'ideogram-4.0', name: 'Ideogram 4.0', modelNumber: 'Visual Engine', isPro: true, badge: 'Visual' },
  { id: 'pro-3.1', name: 'Nexus 3.1 Pro', modelNumber: 'Flagship Intelligence', isPro: true, badge: 'Flagship' },
  { id: 'flash-3.5', name: 'Nexus Sentinel', modelNumber: 'Rapid Falsification Engine', badge: 'Sentinel' },
  { id: 'pro', name: 'Nexus 3.1 Pro', modelNumber: 'Pro Studio Engine', isPro: true, badge: 'Pro' },
  { id: 'flash', name: 'Nexus Foundation', modelNumber: 'Base Axiom Engine', badge: 'Foundation' },
];
