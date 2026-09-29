# NEXUS Boundary Map

## NEXUS
The core is the implementation that actually defines NEXUS state, processing and behavior.

## NEXUS project artifacts
Source, configuration, UI and architecture documents used to construct and present NEXUS.

## Agent environment
The agent harness, terminals, task runners, communication channels and operations room are the environment used by agents to work on NEXUS. They are not NEXUS merely because NEXUS is developed inside them.

## Historical archive
Historical conversations can preserve intent, decisions and lost requirements. They are evidence about the project's history, not automatic evidence of current runtime behavior.

## Host environment
Temporary files, secrets, platform internals and host-specific processes remain outside this package unless they are reproducible project dependencies.

## Rule
Never infer category from a filename alone. Check imports, loading, invocation, persistence, runtime paths and observed behavior.