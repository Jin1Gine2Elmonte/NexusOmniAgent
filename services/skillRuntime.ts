/**
 * NEXUS SKILL RUNTIME — المهارات كقدرات حية تُدعى وتُدرب عبر البنية.
 *
 * This is not a "display catalog". It is:
 *   - a machine-readable map of the 30 Nexus skills,
 *   - cluster selection by intent (called when needed, never shown),
 *   - a per-skill ledger that grows from usage without touching weights.
 *
 * Hard rules:
 *   - Skills remain ARTIFACTS: only the needed stub/body is pulled.
 *   - Skills do NOT become a visible list.
 *   - No Hermes, no observer entity.
 *   - Ledger is data, not memory of an inner self.
 */

import { NexusSkillMeta, NexusSkillLedger } from "./skillTypes";
import { NEXUS_SKILL_CATALOG, SKILL_CLUSTERS } from "./skillCatalog";

export type {
  NexusSkillMeta,
  NexusSkillLedger
};

export interface SkillRuntimePlan {
  mode: 'compact' | 'activate';
  activeSkillIds: string[];
  clusterLabel: string;
  reason: string;
}

/** Resolve a cluster by intent key; returns skill ids to activate. */
export const resolveSkillCluster = (intent?: string): SkillRuntimePlan => {
  const key = (intent || '').toLowerCase().trim();

  // Intent keys deliberately avoid semantic Arabic guessing. They are
  // explicit call-site keys, not keyword classifiers.
  const clusterMap: Record<string, string[]> = Object.entries(SKILL_CLUSTERS as Record<string, readonly string[]>)
    .reduce((acc, [label, ids]) => {
      acc[label] = ids.slice();
      return acc;
    }, {} as Record<string, string[]>);

  const matched = Object.keys(clusterMap).find((label) => {
    const words = label.toLowerCase().split(/[\s-/]+/);
    return words.some((w) => w.length >= 4 && key.includes(w));
  });

  const ids = matched ? Array.from(SKILL_CLUSTERS[matched]) : [];

  return {
    mode: ids.length ? 'activate' : 'compact',
    activeSkillIds: ids,
    clusterLabel: matched || 'none',
    reason: matched
      ? `intent maps to cluster "${matched}" (only those skills pulled)`
      : 'no cluster needed; keep compact'
  };
};

/** Build a ledger entry for a skill. */
export const createSkillLedger = (id: string): NexusSkillLedger => ({
  id,
  usageCount: 0,
  successes: 0,
  failures: 0,
  lessons: [],
  corrections: [],
  userAdaptations: [],
  projectContexts: [],
  lastUsed: 0,
  confidence: 0.5
});

/** Record a real outcome and let the ledger update without weights. */
export const recordSkillOutcome = (
  ledger: NexusSkillLedger,
  outcome: 'success' | 'failure',
  lesson?: string,
  now = Date.now()
): NexusSkillLedger => {
  const next: NexusSkillLedger = {
    ...ledger,
    usageCount: ledger.usageCount + 1,
    successes: ledger.successes + (outcome === 'success' ? 1 : 0),
    failures: ledger.failures + (outcome === 'failure' ? 1 : 0),
    lastUsed: now
  };

  if (lesson) {
    next.lessons = [...next.lessons, lesson].slice(-24);
  }

  return next;
};

/** Render the small, actionable part of a ledger when the skill is activated. */
export const formatSkillLedgerForCall = (
  ledger: NexusSkillLedger
): string => {
  if (!ledger.usageCount) return '';
  const lessons = ledger.lessons.length
    ? `\nLESSONS:\n${ledger.lessons.map(l => `- ${l}`).join('\n')}`
    : '';
  const corr = ledger.corrections.length
    ? `\nCORRECTIONS:\n${ledger.corrections.map(c => `- ${c}`).join('\n')}`
    : '';
  return [
    `[SKILL LEDGER: ${ledger.id}]`,
    `USAGE: ${ledger.usageCount} | SUCCESS: ${ledger.successes} | FAILURE: ${ledger.failures}`,
    `CONFIDENCE: ${ledger.confidence.toFixed(2)}`,
    lessons,
    corr
  ].filter(Boolean).join('\n');
};

/** Return catalog metadata for a skill id (stub only, not body). */
export const getSkillMeta = (id: string): NexusSkillMeta | undefined =>
  NEXUS_SKILL_CATALOG.find(s => s.id === id);

/** Pull the full body of one skill from the substrate. */
export const activateSkillBody = (
  substrate: string,
  id: string
): string => {
  const raw = String(id || '').trim();
  const digits = raw.match(/\d{2}/)?.[0] ?? '';
  if (!digits) return '';

  const exact = new RegExp(`^## ◈ SKILL ${digits}\\s*[—\\-].*$`, 'm');
  const match = exact.exec(substrate);
  if (!match) return '';

  const start = match.index;
  const nextBlock = substrate.indexOf('\n## ◈ SKILL ', start + match[0].length);
  const tailStart = substrate.indexOf('## ◈ ملاحظة التطبيق', start + match[0].length);
  const candidates = [nextBlock, tailStart].filter(v => v > start);
  const end = candidates.length ? Math.min(...candidates) : substrate.length;
  return substrate.slice(start, end).trim();
};

/** Assemble the set of activated skill bodies (only chosen, never all). */
export const activateSkillCluster = (
  substrate: string,
  ids: string[]
): string => {
  const unique = Array.from(new Set(ids)).filter(Boolean);
  return unique
    .map(id => activateSkillBody(substrate, id))
    .filter(Boolean)
    .join('\n\n');
};
