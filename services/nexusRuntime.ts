/**
 * NEXUS RUNTIME — موزّع التشغيل الذي يجعل نيكسوس بنية فوق كل نماذج جوجل.
 *
 * This layer intentionally treats Google's long-lived model family as a
 * swappable resource pool:
 *   PRO      -> deep reasoning / long-horizon synthesis
 *   FLASH    -> fast / wide / memory-light work
 *   AUDIO    -> TTS / voice briefing
 *   IMAGE    -> imagen visual generation
 *   MUSIC    -> lyria audio/music
 *
 * It does NOT replace `modelRouter` (which resolves an explicit UI selection).
 * It extends it: when the runtime is enabled it chooses the best engine for
 * the task, selects the right skill cluster, and yields an execution plan
 * that the existing minting pipeline can consume.
 *
 * Rules:
 *   - No Hermes, no observer.
 *   - No Arabic-regex intent guessing for semantic goals.
 *   - Engine selection is MODE selection, not identity selection.
 */

export type NexusEngine = 'pro' | 'flash' | 'audio' | 'image' | 'music';

export interface NexusEngineDeployment {
  engine: NexusEngine;
  model: string;
  capability: string;
  cost: 'high' | 'low' | 'medium';
  bestFor: string[];
}

export const NEXUS_ENGINE_CATALOG: Readonly<Record<NexusEngine, NexusEngineDeployment>> = {
  pro: {
    engine: 'pro',
    model: 'gemini-3.1-pro-preview',
    capability: 'deep reasoning, synthesis, long-horizon',
    cost: 'high',
    bestFor: ['deep', 'philosophical', 'complex', 'analysis', 'synthesis']
  },
  flash: {
    engine: 'flash',
    model: 'gemini-3.8-flash',
    capability: 'fast, broad, memory-light',
    cost: 'low',
    bestFor: ['fast', 'editing', 'summarize', 'memory', 'default']
  },
  audio: {
    engine: 'audio',
    model: 'gemini-3.1-flash-tts-preview',
    capability: 'speech synthesis / briefing',
    cost: 'low',
    bestFor: ['speech', 'voice', 'briefing', 'audio-output']
  },
  image: {
    engine: 'image',
    model: 'imagen-3.0-generate-002',
    capability: 'visual artifact generation',
    cost: 'medium',
    bestFor: ['visual', 'illustration', 'image', 'svg']
  },
  music: {
    engine: 'music',
    model: 'lyria-3-pro-preview',
    capability: 'music / melody synthesis',
    cost: 'high',
    bestFor: ['music', 'melody', 'score', 'song']
  }
};

export interface NexusTaskRequest {
  surface: string;
  explicitGoal?: string;
  intentHint?: string;
  attachments?: { mimeType?: string }[];
  contextLengthHint?: number;
  prefersDeep?: boolean;
}

export interface NexusTaskPlan {
  engine: NexusEngine;
  model: string;
  candidates: string[];
  reason: string;
  depthMode: 'surface' | 'deep' | 'sovereign';
  skillIntent: string;
  steps: string[];
}

const attachmentMimeHints = (attachments?: { mimeType?: string }[]): string => {
  const mimes = (attachments ?? []).map(a => (a?.mimeType || '').toLowerCase()).filter(Boolean);
  return mimes.join(' ');
};

/**
 * MODE selection, not intent semantics. Exact modality signals only:
 * attachment mime -> audio/image/music; otherwise depth hint/goal -> pro/flash.
 */
export const planNexusTask = (req: NexusTaskRequest): NexusTaskPlan => {
  const surface = (req.surface || '').toLowerCase();
  const goal = (req.explicitGoal || '').toLowerCase();
  const hint = (req.intentHint || '').toLowerCase();
  const mimes = attachmentMimeHints(req.attachments).toLowerCase();

  // Exact modality signals from attachments.
  if (mimes.includes('audio/') || mimes.includes('video/') || surface.includes('briefing')) {
    return plan('audio', 'voice briefing', req);
  }
  if (mimes.includes('image/') || surface.includes('svg') || surface.includes('visual')) {
    return plan('image', 'visual generation', req);
  }
  if (surface.includes('music') || surface.includes('melody') || surface.includes('song')) {
    return plan('music', 'music synthesis', req);
  }

  // Otherwise depth-mode selection, not semantic guessing.
  const wantsDeep = req.prefersDeep
    || goal.includes('deep')
    || goal.includes('synthesis')
    || goal.includes('analysis')
    || hint.includes('deep')
    || hint.includes('reasoning')
    || hint.includes('philosophical');

  return plan(wantsDeep ? 'pro' : 'flash', wantsDeep ? 'deep reasoning' : 'default fast route', req);
};

const plan = (
  engine: NexusEngine,
  reason: string,
  req: NexusTaskRequest
): NexusTaskPlan => {
  const dep = NEXUS_ENGINE_CATALOG[engine];
  const depthMode: NexusTaskPlan['depthMode'] = engine === 'pro' ? 'sovereign' : 'surface';
  const candidates = engine === 'pro'
    ? [dep.model, NEXUS_ENGINE_CATALOG.flash.model]
    : [dep.model, NEXUS_ENGINE_CATALOG.pro.model];

  return {
    engine,
    model: dep.model,
    candidates: Array.from(new Set(candidates)),
    reason,
    depthMode,
    skillIntent: engine === 'pro' ? 'analytic-depth' : 'perceptual-reading',
    steps: [
      'preflight-envelope',
      'engine-selection',
      'skill-cluster-selection',
      'model-execution',
      'postflight-carry'
    ]
  };
};

/** User selection stays primary. Runtime only fills dedicated modalities or
 *  a fallback when the explicit id does not map to a real engine. */
export const planWithExplicitEngine = (
  req: NexusTaskRequest,
  selectedModel: string,
  explicit: { engine: string; candidates: string[] }
): NexusTaskPlan => {
  const base = planNexusTask(req);

  // Honored user choice: explicit id routes to a real engine (pro/flash/music).
  if (explicit.engine) {
    const engine: NexusEngine = explicit.engine.includes('lyria')
      ? 'music'
      : explicit.engine.includes('pro')
        ? 'pro'
        : 'flash';
    return {
      ...base,
      engine,
      model: explicit.engine,
      candidates: Array.from(new Set([explicit.engine, ...explicit.candidates])).filter(Boolean).length
        ? Array.from(new Set([explicit.engine, ...explicit.candidates]))
        : base.candidates,
      reason: `user choice "${selectedModel}" honored as primary engine`
    };
  }

  // No real engine id: runtime decides by modality (image/audio/music) or depth.
  return base;
};
