# NEXUS — Primary Source Ledger

## Corpus received 2026-09-14

| Source | Extracted size | Role |
|---|---:|---|
| `dialog.md` | 1,437,615 characters / 46,890 lines | Largest architectural consultation and correction history; includes later directives, model debates, repository work, and state restoration. |
| `_لنرحّب معًا بـ Gemini...txt` | 211,149 extracted characters / 5,454 lines | Gemini-side conversation and concept/build context. |
| `العمل على نيكسوس.txt` | 99,967 characters / 1,207 lines | Agent execution record, handoff, implementation phases, and unresolved reading queue. |
| `Nexus_Conversation_Archive.pdf` | 109,201 extracted characters / 1,200 lines | Separate conversation-building archive. |
| `Nexus_Claude_Fable_Conversation_FULL.pdf` | 214,093 extracted characters / 3,184 lines | Early conceptual genesis: identity, Pale Archive, SoulPrint, cognitive fusion, skills, correct-question protocol, hybrid architecture, and implementation attempts. |

## Integrity hashes

- `dialog.md`: `48d9cf3b16625d6e8fd6bcc733d3210e7c172ac59ba4d2f6ad3f2aa67ee57753`
- `_لنرحّب معًا بـ Gemini...txt`: `7dced771965fd05c16c5e0e8164dac068a366e6c7ce14863216383ac2a2c0757`
- `العمل على نيكسوس.txt`: `73ef1f911823fdc496aa9df34f5ae9dab072696401a933f51d8bec364ca3383b`
- `Nexus_Conversation_Archive.pdf`: `34d1de418c067fb0ccdd78848d764dceab50d40dbbd3765845d4c23cfb7b9c5a`
- `Nexus_Claude_Fable_Conversation_FULL.pdf`: `f477c36f358cccdc7f1c1d1324300b056ebdfcadc7a27eee2bec9a31295116e9`

## Reading discipline

For every architectural claim, record:

- source file;
- exact section/line range;
- speaker;
- whether it is architect intent, model interpretation, generated proposal, claimed execution, or verified execution;
- later corrections or reversals;
- current code evidence;
- confidence tag.

## Evidence tags

- `[ARCHITECT-DIRECT]` — direct intent or correction from the architect.
- `[MODEL-INTERPRETATION]` — an assistant's understanding; not canonical by itself.
- `[PROPOSAL]` — generated design not yet implemented.
- `[CLAIMED-EXECUTION]` — an agent says it edited or tested something.
- `[CODE-VERIFIED]` — confirmed in repository code.
- `[RUNTIME-VERIFIED]` — confirmed by execution or integration test.
- `[CONTRADICTED]` — later source or code disproves it.
- `[OPEN]` — unresolved.

## Known corpus hazards

1. Several assistants repeatedly claimed complete understanding after partial reading.
2. Tool transcripts hide files and exact generated artifacts.
3. PDF extraction introduces reversed Arabic fragments and UI noise.
4. Later summaries may combine distinct agents or dates.
5. Grand technical language sometimes describes metaphors as mechanisms.
6. “Created/edited/tested” in a chat is not repository evidence.
7. Repetition can signal either a stable invariant or unresolved misunderstanding; context decides.
8. Personal material must not be copied into broader public documents unless necessary and explicitly approved.
