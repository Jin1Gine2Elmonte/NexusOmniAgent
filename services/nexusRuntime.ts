/**
 * NEXUS RUNTIME — task-mode planner above provider engines.
 *
 * `pro` and `flash` are logical runtime modes. They may share a provider model
 * while activating different depth, skill, and orchestration paths.
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
    model: 'gemini-3.8-flash',
    capability: 'deep runtime planning and synthesis on the configured Gemini backend',
    cost: 'medium',
    bestFor: ['deep', 'philosophical', 'complex', 'analysis', 'synthesis']
  },
  flash: {
    engine: 'flash',
    model: 'gemini-3.8-flash',
    capability: 'direct, fast runtime path on the configured Gemini backend',
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

const attachmentMimeHints = (attachments?: { mimeType?: string }[]): string =>
  (attachments ?? []).map(a => (a?.mimeType || '').toLowerCase()).filter(Boolean).join(' ');

export const planNexusTask = (req: NexusTaskRequest): NexusTaskPlan => {
  const surface = (req.surface || '').toLowerCase();
  const goal = (req.explicitGoal || '').toLowerCase();
  const hint = (req.intentHint || '').toLowerCase();
  const mimes = attachmentMimeHints(req.attachments).toLowerCase();

  if (mimes.includes('audio/') || mimes.includes('video/') || surface.includes('briefing')) {
    return plan('audio', 'voice briefing', req);
  }
  if (mimes.includes('image/') || surface.includes('svg') || surface.includes('visual')) {
    return plan('image', 'visual generation', req);
  }
  if (surface.includes('music') || surface.includes('melody') || surface.includes('song')) {
    return plan('music', 'music synthesis', req);
  }

  const wantsDeep = req.prefersDeep
    || goal.includes('deep')
    || goal.includes('synthesis')
    || goal.includes('analysis')
    || hint.includes('deep')
    || hint.includes('reasoning')
    || hint.includes('philosophical');

  return plan(wantsDeep ? 'pro' : 'flash', wantsDeep ? 'deep runtime route' : 'direct runtime route', req);
};

const plan = (
  engine: NexusEngine,
  reason: string,
  _req: NexusTaskRequest
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

const DEEP_SELECTIONS = new Set(['pro-3.1', 'pro', 'inkling']);

/**
 * User selection remains primary. Provider resolution and runtime mode are
 * separate: a legacy deep-mode id can share the provider backend with Flash
 * while still selecting the sovereign planning and skill path.
 */
export const planWithExplicitEngine = (
  req: NexusTaskRequest,
  selectedModel: string,
  explicit: { engine: string; candidates: string[] }
): NexusTaskPlan => {
  if (!explicit.engine) return planNexusTask(req);

  const runtimeMode: NexusEngine = explicit.engine.includes('lyria')
    ? 'music'
    : DEEP_SELECTIONS.has(selectedModel)
      ? 'pro'
      : 'flash';
  const selectedPlan = plan(runtimeMode, `user selected ${runtimeMode} runtime mode`, req);
  const candidates = Array.from(new Set([explicit.engine, ...explicit.candidates])).filter(Boolean);

  return {
    ...selectedPlan,
    model: explicit.engine,
    candidates: candidates.length ? candidates : selectedPlan.candidates
  };
};
