/**
 * NEXUS SKILL TYPES — مهارات نيكسوس كبنية بيانات.
 *
 * These types keep skills machine-readable while their full text stays
 * in ARTIFACTS. They are never rendered as a catalog.
 */

export interface NexusSkillMeta {
  id: string;
  title: string;
  essence: string;
  dependsOn: string[];
  tier: 'perceptual' | 'truth' | 'analytic' | 'creative' | 'archive' | 'execution';
}

export interface NexusSkillLedger {
  id: string;
  usageCount: number;
  successes: number;
  failures: number;
  lessons: string[];
  corrections: string[];
  userAdaptations: string[];
  projectContexts: string[];
  lastUsed: number;
  confidence: number;
}
