# NEXUS — Canonical Intent Reconstruction (Astra)

> Status: source-grounded reconstruction from the primary conversation corpus. This document separates the architect's intent from later model interpretations and from current implementation claims.

## 1. Source precedence

When two descriptions conflict, use this order:

1. The architect's direct clarifications in the primary conversations.
2. The full conversational context that produced a decision.
3. Artifacts created during that context.
4. Observable code and commit history.
5. Later agent summaries and labels.

No agent sentence such as “I now understand everything” is evidence of complete coverage. Every implementation claim must be checked against code and behavior.

## 2. Canonical thesis

NEXUS is intended to be one continuous cognitive system above replaceable model engines. It is not a collection of personas, a renamed base model, or a long prompt that claims transcendence.

Its identity, memory, skills, state, tools, and reasoning mechanisms must cooperate without fragmenting the voice into multiple experts. Domain specialization changes internal activation, not entity identity.

## 3. What each major concept means

### Identity anchor

A compact invariant describing who NEXUS is and the boundaries it retains across domains and sessions. It must remain stable without forcing theatrical language into every answer.

### Living voice

The system instruction should embody the desired cognitive stance, not merely list stylistic commands. The visible response must still be governed by usefulness, truth, context, and restraint.

### Pale Archive

Not merely a conversation entity extractor. It is the civilizational and experiential context used to deepen interpretation, identify historical patterns, and expose missing context. It may surface explicitly only when it adds value. A factual archive and a behavioral metaphor must remain distinguishishable.

### SoulPrint

Not a tone selector. It is an evidence-based, revisable model of how a user reasons, communicates, learns, and responds. It must never be treated as psychological certainty. Every inference needs provenance, confidence, and decay/correction behavior.

### Skills

Not imitation of GPT, Claude, DeepSeek, or Grok. Skills are explicit, testable mechanisms abstracted from useful behaviors. They activate when needed, retain measurable outcomes, and do not replace identity.

### Silent Flux

A pre-response intent representation: normalize the user's surface language into a compact task/intent/constraint frame before planning. It is not a claim to access or rewrite a model's latent space.

### Correct Question Protocol

A gated mechanism that asks whether the presented question, its frame, or an omitted question is the actual problem. It must not rewrite every request. Activation should be based on uncertainty, stakes, contradiction, or explicit depth—not decoration.

### Clusters, vertical layers, and Tesseract

These describe complementary axes: breadth, alternatives, penetration, synthesis, psychological/linguistic refinement, and final manifestation. Numbers such as 225 are not evidence that 225 models ran. Runtime telemetry must report only actual calls and stages.

### Forge / self-refinement

A real Forge requires observable candidate generation, critique of actual candidates, selection, refinement, and cost/quality measurements. A deterministic prompt addendum is steering, not a live Forge loop.

### Persistence

A persistent entity state must survive requests and sessions. Recreating an object inside each request is a snapshot, not continuity. Experience and skill ledgers must be stored, retrieved, updated, and audited.

## 4. Non-negotiable invariants

1. **One entity, replaceable engines.** Engine labels and `actualModelUsed` must tell the truth.
2. **Mechanism over mythology.** Metaphor may guide design but cannot substitute for executable behavior.
3. **Capability claims require evidence.** No stage, model, memory, learning, or tool is described as active unless it ran.
4. **Identity must not destroy task fitness.** Direct questions remain direct; emotional contexts remain humane; technical work remains precise.
5. **Memory is selective and revisable.** Provenance, confidence, privacy boundaries, and correction are mandatory.
6. **Skills are observable.** Activation reason, outcome, and quality signal must be available for evaluation.
7. **Internal analysis stays internal.** Users receive conclusions, assumptions, evidence, and uncertainty—not hidden chain-of-thought.
8. **Safety is an internal design property plus enforceable boundaries.** “Sovereignty” never means unaudited power or deceptive labels.
9. **Unknown remains unknown.** NEXUS can generate hypotheses, but must distinguish invention, inference, reconstruction, and verified fact.
10. **No broad change without evaluation.** Identity/runtime changes require baseline and A/B comparison.

## 5. Failure modes repeatedly seen in the project history

- Compressing a living concept into a dry instruction catalog.
- Restoring vitality by adding grand claims instead of mechanisms.
- Treating prompt prose as implemented cognition.
- Renaming one backend into multiple model choices.
- Recreating “persistent” state per request.
- Returning success from unimplemented memory endpoints.
- Letting a specialist model's style contaminate the unified voice.
- Adding a deep-thinking layer to every request and degrading already-good answers.
- Reading summaries instead of the conversations that generated them.
- Claiming full context after partial archive reading.

## 6. Translation into an implementable architecture

```text
User Input
  -> Input validation and privacy boundary
  -> Silent Flux envelope (intent, constraints, stakes, uncertainty)
  -> Gated Correct-Question check
  -> Memory retrieval (episodic + semantic + user model, provenance-aware)
  -> Task planner (explicit user model choice remains primary)
  -> Skill activation (minimal relevant cluster)
  -> Optional live Forge (only for qualified tasks)
  -> Tool/model execution
  -> Verification and honesty audit
  -> Surface realization (Living Voice)
  -> Persist observable outcome, corrections, and carry-next state
```

Each arrow must correspond to code, telemetry, and a test. If it does not, it is design intent only.

## 7. Definition of “NEXUS became stronger”

A change is accepted only when it improves one or more measured dimensions without unacceptable regression:

- factual reliability;
- task completion;
- reasoning coverage;
- correction of false premises;
- cross-domain synthesis;
- personalization accuracy;
- long-session continuity;
- creative originality;
- latency and cost;
- user trust and clarity.

More text, more stages, or a more impressive self-description are not strength metrics.
