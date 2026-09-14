# NEXUS — Execution Backlog and Acceptance Gates

## P0 — Truth before capability

### P0.1 Honest model routing

- Separate **runtime mode** from **actual provider model**.
- Preserve legacy UI IDs only for compatibility.
- Display the exact backend returned by the provider.
- If Pro is unavailable and Flash is used, expose `fallbackFrom`, `fallbackReason`, and the real model.
- Never describe two modes as two models when they share one backend.

**Acceptance tests**

- Selecting Foundation reports the actual Flash model.
- Selecting Deep Mode either runs a configured Pro model or visibly degrades to Flash.
- Automated test fails if UI model metadata contradicts router resolution.

### P0.2 No successful stubs

Replace successful placeholder responses for crystallize, memory retrieval, and entity extraction with either real implementations or explicit `501 NOT_IMPLEMENTED` responses.

**Acceptance tests**

- No endpoint returns `success: true` without an observable state change or result.
- Integration tests verify persisted output after crystallization.

### P0.3 Honest modality fallbacks

- Procedural audio must be labeled procedural local synthesis, not Lyria.
- Prompt-only image regeneration must not be labeled image editing.
- Runtime telemetry reports requested route, executed route, and fallback.

## P1 — Real continuity

### P1.1 Persistent entity state

Persist per-user/project state with versioning:

- identity version;
- current focus and open questions;
- active capabilities;
- carry-next state;
- experience records;
- last successful checkpoint.

Do not store hidden chain-of-thought. Store observable decisions, outcomes, corrections, and compact summaries.

### P1.2 Memory layers

Implement distinct stores:

1. Episodic: session events and outcomes.
2. Semantic: facts/axioms with provenance and confidence.
3. Relational: entities and relationships.
4. User model: SoulPrint hypotheses with evidence and correction.
5. Project state: goals, decisions, blockers, next actions.

### P1.3 Skill ledger persistence

- Resolve skill cluster.
- Record activation reason.
- Record task outcome and user correction.
- Update confidence from evidence, not self-assertion.
- Retrieve only relevant lessons next time.

## P1 — Fix broken execution paths

### P1.4 Visual refinement

- Distinguish text-to-image from image editing.
- If provider image editing is unavailable, disable edit claims and use prompt refinement as a separate mode.
- Verify each refinement result exists before continuing.
- Limit parallel candidates by cost budget.

### P1.5 Long-session compaction

- Track estimated context use.
- Compact old turns into provenance-linked summaries.
- Preserve decisions, corrections, unresolved questions, and user-authored constraints.
- Never silently discard the beginning of a session.

## P2 — Turn concepts into measured mechanisms

### P2.1 Silent Flux envelope

Create a typed internal envelope:

- surface request;
- inferred task;
- explicit constraints;
- assumptions;
- ambiguity;
- stakes;
- needed sources/tools;
- response contract.

Evaluate whether it improves task completion versus direct routing.

### P2.2 Correct Question gate

Activate only when one or more are true:

- conflicting premises;
- high stakes;
- low confidence in task interpretation;
- explicit request for deep reframing;
- repeated failure under the current frame.

### P2.3 Live Forge experiment

A live experiment must execute:

1. baseline one-pass response;
2. multiple genuinely distinct candidate plans or answers;
3. critic evaluation using an explicit rubric;
4. refined result;
5. blinded comparison against baseline;
6. latency/token/cost logging.

If these calls do not happen, name the feature `Steering Addendum`, not Forge.

## P2 — Evaluation suite

Build a fixed bilingual benchmark covering:

- direct factual requests;
- ambiguous user intent;
- false-premise correction;
- technical architecture;
- code generation and debugging;
- emotional sensitivity;
- creative opening;
- long-form plot coherence;
- cross-domain synthesis;
- long-session memory;
- user correction and state recovery;
- adversarial prompt attempts.

Score blindly on correctness, depth, relevance, originality, voice stability, restraint, cost, and latency.

## Merge policy

No architectural PR merges unless:

- checks run in GitHub;
- model labels are honest;
- no success stubs remain on touched paths;
- changed mechanisms have tests;
- documentation distinguishes implemented, experimental, and conceptual states;
- baseline comparison shows no critical regression.
