
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
  // NEXUS RUNTIME PROTOCOL
  CONTEXT_ASCENSION = 'CONTEXT_ASCENSION', // 1. Context rising from archive
  RUNTIME_SYNC = 'RUNTIME_SYNC', // 2. Intent + memory + skill cluster sync
  DEPTH_FOCUS = 'DEPTH_FOCUS', // 3. Depth selection + activation
  VISUAL_SYNTHESIS = 'VISUAL_SYNTHESIS', // 3.5 Visual synthesis (Gemini-driven)
  RESPONSE_GENERATION = 'RESPONSE_GENERATION', // 4. Final response generation
  SPEAKING = 'SPEAKING',
  CRYSTALLIZING = 'CRYSTALLIZING' // Memory/experience crystallization
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

export type ModelSelection = 'pro-3.1' | 'lyria-3-pro' | 'ideogram-4.0' | 'llama-local' | 'kimi-k3' | 'flash' | 'inkling';

export interface ModelOption {
  id: ModelSelection;
  name: string;
  modelNumber: string;
  badge?: string;
  isPro?: boolean;
}

export const MODEL_OPTIONS: ModelOption[] = [
  { id: 'pro-3.1', name: 'Nexus Deep Reasoning', modelNumber: 'Gemini 3.1 Pro Preview', isPro: true, badge: 'Gemini Pro' },
  { id: 'lyria-3-pro', name: 'Lyria 3 Music Pro', modelNumber: 'Google Lyria Preview (Audio & Music)', isPro: true, badge: 'Lyria Music' },
  { id: 'inkling', name: 'نيكسوس المفكر', modelNumber: 'Gemini 3.1 Pro via Direct Routing', isPro: true, badge: 'Reasoning' },
  { id: 'kimi-k3', name: 'Nexus Kimi', modelNumber: 'User-configured Moonshot/Kimi API', isPro: true, badge: 'Remote API' },
  { id: 'llama-local', name: 'Nexus Local Llama', modelNumber: 'Qwen 2.5 0.5B Instruct (GGUF via llama-server)', isPro: true, badge: 'Local' },
  { id: 'ideogram-4.0', name: 'Nexus Visual Engine', modelNumber: 'Gemini text+vision vector pipeline', isPro: true, badge: 'Visual' },
  { id: 'flash', name: 'Nexus Foundation', modelNumber: 'Gemini 3.8 Flash', badge: 'Foundation' },
];
