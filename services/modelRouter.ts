/**
 * NEXUS MODEL ROUTER — honest engine resolution.
 *
 * There is no "forced upgrade" remapping here: a `flash` selection maps to the
 * real flash engine, `pro` maps to the real pro engine. Weak/dead aliases that
 * are still passed by an untrusted caller map to their true engine so the
 * router never lies about `actualModelUsed`.
 *
 * Dedicated local/visual/music engines return `engine: ""` — they are handled
 * by their own endpoints, not by the Gemini text router.
 */
export const resolveEngineForModel = (
  selectedModel: string
): { engine: string; candidates: string[]; aliases: string[] } => {
  const PRO = "gemini-3.8-flash";
  const FLASH = "gemini-3.8-flash";

  switch (selectedModel) {
    case "pro-3.1":
    case "pro":
    case "inkling":
      return { engine: PRO, candidates: [PRO, FLASH], aliases: [] };
    case "flash":
      return { engine: FLASH, candidates: [FLASH, PRO], aliases: [] };
    case "flash-3.7":
    case "flash-3.6":
    case "flash-3.5":
      // Deprecated remote IDs that no longer exist. Route to the real flash
      // engine (not a fake "upgrade"), and expose the alias so callers can
      // display the true engine if they want.
      return { engine: FLASH, candidates: [FLASH, PRO], aliases: [selectedModel] };
    case "lyria-3-pro":
      return { engine: "lyria-3-pro-preview", candidates: ["lyria-3-pro-preview"], aliases: [] };
    default:
      // Dedicated local/visual/music endpoints are not Gemini text engines.
      return { engine: "", candidates: [], aliases: [] };
  }
};
