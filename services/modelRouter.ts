/**
 * NEXUS MODEL ROUTER
 *
 * This module resolves the provider model only. Runtime depth is selected in
 * nexusRuntime, so two UI modes may intentionally share one provider model
 * while activating different planning and skill paths.
 *
 * Dedicated local/visual/music engines return their own route or an empty
 * engine when handled by another endpoint.
 */
export const resolveEngineForModel = (
  selectedModel: string
): { engine: string; candidates: string[]; aliases: string[] } => {
  const GEMINI_TEXT = "gemini-3.8-flash";

  switch (selectedModel) {
    case "pro-3.1":
    case "pro":
    case "inkling":
      return { engine: GEMINI_TEXT, candidates: [GEMINI_TEXT], aliases: [] };
    case "flash":
      return { engine: GEMINI_TEXT, candidates: [GEMINI_TEXT], aliases: [] };
    case "flash-3.7":
    case "flash-3.6":
    case "flash-3.5":
      return { engine: GEMINI_TEXT, candidates: [GEMINI_TEXT], aliases: [selectedModel] };
    case "lyria-3-pro":
      return { engine: "lyria-3-pro-preview", candidates: ["lyria-3-pro-preview"], aliases: [] };
    default:
      return { engine: "", candidates: [], aliases: [] };
  }
};
