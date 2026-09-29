# NEXUS Project Package

This branch contains a dedicated NEXUS_PACKAGE path assembled from the existing Git objects of the NexusOmniAgent repository. No file content was fabricated or re-generated.

## Boundary

NEXUS is the system being built. The package separates its runtime-facing implementation from application/UI artifacts, agent operations, historical knowledge, and host/build resources.

NEXUS_PACKAGE/NEXUS_CORE = runtime/state/memory/skills/forge/legend/latent-fold services.
NEXUS_PACKAGE/MODEL_INTEGRATION = server and model adapters.
NEXUS_PACKAGE/APPLICATION = UI/application shell and visualization.
NEXUS_PACKAGE/ARCHITECTURE = design contracts, canonical documents and protocols.
NEXUS_PACKAGE/AGENT_OPERATIONS = agent bridge, operations room and swarm coordination.
NEXUS_PACKAGE/HISTORICAL_ARCHIVE = the important historical NEXUS conversations and archived source material.
NEXUS_PACKAGE/HOST_RESOURCES = local model binaries and host/build resources that may be needed to run/build the project but are not automatically NEXUS cognition.
NEXUS_PACKAGE/BUILD_AND_VERIFICATION = build/download/verification scripts.

Presence in this package is not itself proof of runtime activation. Runtime membership must be verified by imports, loading, invocation and behavioral tests.

Source: Jin1Gine2Elmonte/NexusOmniAgent@ca2fba48162b0895b41737d69ec59db2192cb2eb