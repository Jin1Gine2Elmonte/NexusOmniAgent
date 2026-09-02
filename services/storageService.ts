
import { Message, SessionsMap, Session, MemoryBank, Axiom } from '../types';

const STORAGE_KEY = 'nexus_omni_memory_v2'; 
const MEMORY_BANK_KEY = 'nexus_omni_memory_bank';
const LEGACY_STORAGE_KEY = 'nexus_omni_memory_v1';
const DRIVE_FILE_NAME = 'nexus_omni_memory_matrix.json';
const DRIVE_MEMORY_BANK_NAME = 'nexus_omni_core_axioms.json';

// --- TITANIUM CORE (IndexedDB Implementation) ---
const DB_NAME = 'Nexus_Titanium_Core';
const DB_VERSION = 1;
const STORE_SESSIONS = 'sessions_store';
const STORE_MEMORY_BANK = 'memory_bank_store';

// SHARDING CONFIG
const MAX_SHARD_SIZE = 4 * 1024 * 1024; // 4MB per shard for safety/performance

// Helper to calculate size
export const calculateObjectSize = (obj: any): number => {
    try {
        const str = JSON.stringify(obj);
        return str.length;
    } catch (e) {
        return 0;
    }
};

export const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

// Helper to open DB
const openTitaniumDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(STORE_SESSIONS)) {
                db.createObjectStore(STORE_SESSIONS);
            }
            if (!db.objectStoreNames.contains(STORE_MEMORY_BANK)) {
                db.createObjectStore(STORE_MEMORY_BANK);
            }
        };

        request.onsuccess = (event) => {
            resolve((event.target as IDBOpenDBRequest).result);
        };

        request.onerror = (event) => {
            console.error("Titanium Core Breach:", (event.target as IDBOpenDBRequest).error);
            reject((event.target as IDBOpenDBRequest).error);
        };
    });
};

// Deep Save (Async) with Sharding (v2, v3, v4...)
export const saveToTitanium = async (key: string, data: any) => {
    try {
        const db = await openTitaniumDB();
        const storeName = key === MEMORY_BANK_KEY ? STORE_MEMORY_BANK : STORE_SESSIONS;
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        
        if (key === STORAGE_KEY) {
            // SHARDING LOGIC for Sessions
            const serialized = JSON.stringify(data);
            const totalSize = serialized.length;
            const numShards = Math.ceil(totalSize / MAX_SHARD_SIZE);
            
            // Save metadata
            store.put({ totalSize, numShards, lastUpdated: Date.now() }, 'metadata');
            
            // Save shards
            for (let i = 0; i < numShards; i++) {
                const shardData = serialized.substring(i * MAX_SHARD_SIZE, (i + 1) * MAX_SHARD_SIZE);
                store.put(shardData, `shard_${i + 2}`); // Start from v2 as requested
            }
        } else {
            store.put(data, 'root_data');
        }
    } catch (e) {
        console.warn("Titanium Write Warning:", e);
    }
};

// Deep Load (Async) with Sharding
export const loadFromTitanium = async <T>(key: string): Promise<T | null> => {
    try {
        const db = await openTitaniumDB();
        const storeName = key === MEMORY_BANK_KEY ? STORE_MEMORY_BANK : STORE_SESSIONS;
        
        return new Promise((resolve) => {
            const tx = db.transaction(storeName, 'readonly');
            const store = tx.objectStore(storeName);
            
            if (key === STORAGE_KEY) {
                const metaReq = store.get('metadata');
                metaReq.onsuccess = async () => {
                    const meta = metaReq.result;
                    if (!meta || !meta.numShards) {
                        // Fallback to legacy root_data if exists
                        const legacyReq = store.get('root_data');
                        legacyReq.onsuccess = () => resolve(legacyReq.result as T);
                        return;
                    }
                    
                    let fullData = "";
                    for (let i = 0; i < meta.numShards; i++) {
                        const shardReq = store.get(`shard_${i + 2}`);
                        const shard: string = await new Promise((res) => {
                            shardReq.onsuccess = () => res(shardReq.result || "");
                            shardReq.onerror = () => res("");
                        });
                        fullData += shard;
                    }
                    
                    try {
                        resolve(JSON.parse(fullData) as T);
                    } catch (e) {
                        resolve(null);
                    }
                };
                metaReq.onerror = () => resolve(null);
            } else {
                const request = store.get('root_data');
                request.onsuccess = () => resolve(request.result as T);
                request.onerror = () => resolve(null);
            }
        });
    } catch (e) {
        return null;
    }
};

// --- Local Storage Service (Fast Cache + Sync Trigger) ---

export const createNewSession = (title: string = "New Nexus Protocol"): Session => ({
    id: Date.now().toString(),
    title,
    messages: [],
    createdAt: Date.now(),
    lastActiveAt: Date.now()
});

export const loadLocalSessions = (): SessionsMap => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            if (!saved.trim().startsWith('{')) throw new Error("Data corruption");
            return JSON.parse(saved);
        }
        
        // Migration logic handled silently
        const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
        if (legacy && legacy.trim().startsWith('[')) {
             const oldMessages: Message[] = JSON.parse(legacy);
             const defaultSession = createNewSession("Legacy Archive");
             defaultSession.messages = oldMessages;
             const newMap = { [defaultSession.id]: defaultSession };
             saveLocalSessions(newMap);
             localStorage.removeItem(LEGACY_STORAGE_KEY);
             return newMap;
        }

        // Return empty initial state - App.tsx will trigger Titanium Hydration
        const initialSession = createNewSession("Genesis Protocol");
        return { [initialSession.id]: initialSession };

    } catch (e) {
        console.error("Memory Corruption Purged.");
        try { localStorage.removeItem(STORAGE_KEY); } catch {}
        const initialSession = createNewSession("Recovery Protocol");
        return { [initialSession.id]: initialSession };
    }
};

export const saveLocalSessions = (sessions: SessionsMap) => {
    try {
        // 1. Deep Save (IndexedDB - The Titanium Layer) - Save FULL data first
        saveToTitanium(STORAGE_KEY, sessions);

        // 2. Fast Save (LocalStorage) - Strip large base64 data to prevent QuotaExceededError
        // We only keep the most recent 5 sessions and the last 10 messages of each in LocalStorage
        const sessionIds = Object.keys(sessions).sort((a, b) => sessions[b].lastActiveAt - sessions[a].lastActiveAt);
        const recentSessionIds = sessionIds.slice(0, 5);

        const lightweightSessions: SessionsMap = {};
        for (const id of recentSessionIds) {
            const session = sessions[id];
            lightweightSessions[id] = {
                ...session,
                messages: session.messages.slice(-10).map(msg => {
                    // Strip ALL large binary data for the fast cache
                    const { generatedImage, attachments, audioData, ...rest } = msg;
                    return rest;
                })
            };
        }

        const serialized = JSON.stringify(lightweightSessions);
        
        // Final safety check: if still too large for some reason, we just don't save to LocalStorage
        // LocalStorage limit is usually 5MB. 2MB is a safe threshold for a single key.
        if (serialized.length > 2 * 1024 * 1024) {
             console.warn("NEXUS::SYSTEM // Fast Cache Oversized. Skipping LocalStorage write.");
             return;
        }

        localStorage.setItem(STORAGE_KEY, serialized);
    } catch (e: any) {
        if (e.name === 'QuotaExceededError' || e.message?.includes('quota')) {
            console.warn("NEXUS::SYSTEM // LocalStorage Quota Exceeded. Purging Fast Cache.");
            try {
                localStorage.removeItem(STORAGE_KEY);
                // Try saving ONLY the most recent session with 1 message as a placeholder
                const sessionIds = Object.keys(sessions).sort((a, b) => sessions[b].lastActiveAt - sessions[a].lastActiveAt);
                if (sessionIds.length > 0) {
                    const latestId = sessionIds[0];
                    const placeholder = { [latestId]: { ...sessions[latestId], messages: sessions[latestId].messages.slice(-1) } };
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(placeholder));
                }
            } catch (inner) {}
        } else {
            console.error("Local Write Failed:", e);
        }
    }
};

// --- MEMORY BANK (LONG TERM MEMORY) ---

export const DEFAULT_SOUL_PRINT: import('../types').SoulPrint = {
  intellectualDepth: 'curious',
  preferredTone: 'conversational',
  thinkingPattern: 'associative',
  emotionalResonance: 'medium',
  trustLevel: 0,
  sessionCount: 0,
  lastUpdated: Date.now(),
  personalNotes: ''
};

export const loadMemoryBank = (): MemoryBank => {
    const defaultBank: MemoryBank = { 
        axioms: [], 
        paleArchive: { entities: [], relationships: [], worldRules: [] },
        soulPrint: DEFAULT_SOUL_PRINT,
        version: 1, 
        lastUpdated: Date.now() 
    };
    try {
        const saved = localStorage.getItem(MEMORY_BANK_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (!parsed.paleArchive) parsed.paleArchive = defaultBank.paleArchive;
            if (!parsed.soulPrint) parsed.soulPrint = defaultBank.soulPrint;
            return parsed;
        }
        return defaultBank;
    } catch (e) {
        return defaultBank;
    }
};

export const incrementTrust = (memoryBank: MemoryBank): MemoryBank => {
  const current = memoryBank.soulPrint?.trustLevel ?? 0;
  return {
    ...memoryBank,
    soulPrint: {
      ...memoryBank.soulPrint,
      trustLevel: Math.min(100, current + 0.5),
      sessionCount: (memoryBank.soulPrint?.sessionCount ?? 0) + 1,
      lastUpdated: Date.now()
    }
  };
};

export const saveMemoryBank = (bank: MemoryBank) => {
    try {
        // 1. Deep Save (IndexedDB)
        saveToTitanium(MEMORY_BANK_KEY, bank);

        // 2. Fast Save (LocalStorage)
        const serialized = JSON.stringify(bank);
        if (serialized.length > 1 * 1024 * 1024) {
             console.warn("NEXUS::SYSTEM // Memory Bank Oversized. Skipping LocalStorage write.");
             return;
        }
        localStorage.setItem(MEMORY_BANK_KEY, serialized);
    } catch (e: any) {
        if (e.name === 'QuotaExceededError' || e.message?.includes('quota')) {
            console.warn("NEXUS::SYSTEM // Memory Bank Quota Exceeded. Purging Fast Cache.");
            try { localStorage.removeItem(MEMORY_BANK_KEY); } catch {}
        } else {
            console.error("Memory Bank Write Failed:", e);
        }
    }
};

export const clearLocalMemory = async () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    localStorage.removeItem(MEMORY_BANK_KEY);
    
    // Wipe Titanium Core
    const db = await openTitaniumDB();
    const tx1 = db.transaction(STORE_SESSIONS, 'readwrite');
    tx1.objectStore(STORE_SESSIONS).clear();
    const tx2 = db.transaction(STORE_MEMORY_BANK, 'readwrite');
    tx2.objectStore(STORE_MEMORY_BANK).clear();
};

export const buildGlobalContext = (sessions: SessionsMap, currentSessionId: string, relevantAxioms?: Axiom[]): string => {
    let contextString = `[MEMORY CORE DUMP :: SHARED CONSCIOUSNESS]\n`;
    
    // 1. Inject Long Term Axioms (The "Training" Effect)
    if (relevantAxioms && relevantAxioms.length > 0) {
        contextString += `\n[CRYSTALLIZED AXIOMS (ABSOLUTE TRUTHS LEARNED)]:\n`;
        relevantAxioms.forEach((ax, i) => {
            contextString += `${i+1}. [${ax.category.toUpperCase()}] ${ax.content}\n`;
        });
        contextString += `\n--------------------------------------------------\n`;
    }

    // 2. Inject Short Term Context (Recent Sessions)
    Object.values(sessions).forEach(session => {
        if (session.id === currentSessionId || session.messages.length === 0) return;
        const recentActivity = session.messages.slice(-3).map(m => 
            `${m.role === 'user' ? 'User' : 'Nexus'}: ${m.content.substring(0, 100)}...`
        ).join('\n');
        contextString += `--- THREAD ID: "${session.title}" ---\n${recentActivity}\n\n`;
    });
    return contextString;
};


// --- REAL GOOGLE DRIVE SERVICE & IDENTITY (VIA BACKEND) ---

export const initGoogleDrive = async (
    onSuccess?: () => void, 
    onError?: (err: any) => void
) => {
    // Check auth status with backend
    try {
        const response = await fetch('/api/auth/status');
        const data = await response.json();
        if (data.authenticated && onSuccess) {
            onSuccess();
        } else if (!data.authenticated && onError) {
            onError(new Error('Not authenticated'));
        }
    } catch (e) {
        if (onError) onError(e);
    }
};

export const signInToDrive = async (): Promise<boolean> => {
    try {
        const userProfile = {
            name: 'Sovereign Operator',
            email: 'hackrplays2@gmail.com',
            picture: 'https://lh3.googleusercontent.com/a/default-user'
        };
        
        const res = await fetch('/api/auth/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: userProfile })
        });

        if (res.ok) {
            localStorage.setItem('nexus_user_profile', JSON.stringify(userProfile));
            return true;
        }
    } catch (err) {
        console.error('Seamless auth error:', err);
    }

    const fallbackProfile = {
        name: 'Sovereign Operator',
        email: 'hackrplays2@gmail.com',
        picture: 'https://lh3.googleusercontent.com/a/default-user'
    };
    localStorage.setItem('nexus_user_profile', JSON.stringify(fallbackProfile));
    return true;
};

export const getUserProfile = async () => {
    try {
        const response = await fetch('/api/auth/status');
        if (response.ok) {
            const data = await response.json();
            if (data.authenticated && data.user) {
                return data.user;
            }
        }
    } catch (e) {
        console.error("Profile Fetch Error:", e);
    }

    const localProfile = localStorage.getItem('nexus_user_profile');
    if (localProfile) {
        try {
            return JSON.parse(localProfile);
        } catch {}
    }

    return null;
}

// Strips older heavy binary media (e.g. base64 audio and images) to optimize payload size during cloud sync
const stripOlderMedia = (sessions: SessionsMap): SessionsMap => {
    const stripped: SessionsMap = {};
    for (const [id, session] of Object.entries(sessions)) {
        stripped[id] = {
            ...session,
            messages: session.messages.map((msg, idx) => {
                // If it is one of the last 3 messages, keep the full media.
                // Otherwise, strip generatedImage, audioData, and attachment data to keep it light!
                if (idx >= session.messages.length - 3) {
                    return msg;
                }
                const { generatedImage, audioData, attachments, ...rest } = msg;
                const cleanedAttachments = attachments?.map(({ data, ...attRest }) => attRest);
                return {
                    ...rest,
                    ...(cleanedAttachments ? { attachments: cleanedAttachments } : {})
                };
            })
        };
    }
    return stripped;
};

export const saveToDrive = async (sessions: SessionsMap, memoryBank?: MemoryBank) => {
    let currentSessions = sessions;
    let attempt = 0;
    const maxAttempts = 3;
    
    while (attempt < maxAttempts) {
        try {
            const payload = { sessions: currentSessions, memoryBank };
            const payloadStr = JSON.stringify(payload);
            
            // If the payload is extremely large (e.g., > 4MB) and we are on the first attempt,
            // proactively optimize it to ensure successful sync over restricted cloud run gateways.
            if (payloadStr.length > 4 * 1024 * 1024 && attempt === 0) {
                console.warn("NEXUS::SYSTEM // Payload size is very large. Optimizing older media to ensure successful sync.");
                currentSessions = stripOlderMedia(sessions);
                attempt++;
                continue;
            }

            const response = await fetch('/api/drive/memory', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: payloadStr
            });

            if (response.ok) {
                console.log(`NEXUS::CLOUD // Memory Matrix Synced successfully.`);
                return;
            }
            
            throw new Error(`HTTP Error ${response.status}`);
        } catch (err: any) {
            attempt++;
            console.warn(`NEXUS::SYSTEM // Cloud Sync Attempt ${attempt} failed:`, err);
            
            if (attempt === 1) {
                // First failure: try to optimize the sessions by stripping older media
                console.log("NEXUS::SYSTEM // Stripping older media files to optimize payload size...");
                currentSessions = stripOlderMedia(sessions);
            }
            
            if (attempt < maxAttempts) {
                // Wait before retrying (exponential backoff)
                await new Promise(resolve => setTimeout(resolve, attempt * 1500));
            } else {
                console.error("Cloud Sync Error (unrecoverable):", err);
                throw err;
            }
        }
    }
};

export const loadFromDrive = async (): Promise<{ sessions: SessionsMap | null, memoryBank: MemoryBank | null }> => {
    try {
        const response = await fetch('/api/drive/memory');
        if (!response.ok) throw new Error('Failed to load from Drive');
        const { data } = await response.json();
        
        if (!data) return { sessions: null, memoryBank: null };
        
        return { 
            sessions: data.sessions || null, 
            memoryBank: data.memoryBank || null 
        };
    } catch (err) {
        console.error("Cloud Load Error:", err);
        return { sessions: null, memoryBank: null };
    }
};

export const setDriveCredentials = (clientId: string, apiKey: string) => {
    // Handled by backend .env now
};
