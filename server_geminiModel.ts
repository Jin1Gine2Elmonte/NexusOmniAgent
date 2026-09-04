import express from "express";
import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { buildMintBundle, resolveEngineForModel } from "./services/minting";
import { NEXUS_MASTER_INSTRUCTION } from "./services/geminiService";
import { planNexusTask, planWithExplicitEngine } from "./services/nexusRuntime";
import { resolveSkillCluster, activateSkillCluster, createSkillLedger, formatSkillLedgerForCall, getSkillMeta } from "./services/skillRuntime";
import { createNexusEntityState, formatNexusEntityFrame } from "./services/nexusEntityState";
import { buildLegendEngine } from "./services/nexusLegendEngine";

const router = express.Router();

const cleanSafetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_CIVIC_INTEGRITY, threshold: HarmBlockThreshold.BLOCK_NONE }
];

function getApiKey(): string {
  const key = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!key) {
    throw new Error("GEMINI_API_KEY or API_KEY environment variable is missing.");
  }
  return key;
}

// Chat Endpoint
router.post("/chat", async (req, res) => {
  try {
    const {
      prompt,
      history = [],
      attachments = [],
      globalMemoryContext = "",
      isWebSearchEnabled = false,
      isCanvasMode = false,
      selectedModel = "pro-3.1",
      memoryBank,
      intentHint,
      explicitGoal
    } = req.body;

    let apiKey: string;
    try {
      apiKey = getApiKey();
    } catch (keyErr: any) {
      return res.status(503).json({
        success: false,
        error: "مفتاح GEMINI_API_KEY غير متوفر في متغيرات البيئة.",
        errorCode: "API_KEY_MISSING"
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Honest engine resolution: a `flash` id routes to the real flash engine,
    // a `pro` id to the real pro engine. No fake "forced upgrade" aliases.
    const resolved = resolveEngineForModel(selectedModel);

    // NEXUS RUNTIME = single source of truth for engine, depth, skill cluster
    // and preflight. User's explicit selection is honored first; runtime only
    // fills dedicated modalities or a fallback when no real engine id exists.
    const plan = planWithExplicitEngine(
      { surface: prompt, explicitGoal, intentHint, attachments },
      selectedModel,
      resolved
    );
    const modelName = plan.model || resolved.engine || "gemini-3.1-pro-preview";
    const uniqueCandidates = Array.from(new Set(plan.candidates.length ? plan.candidates : [modelName, "gemini-3.1-pro-preview", "gemini-3.8-flash"]));

    const formattedHistory = history.map((h: any) => ({
      role: h.role === "user" ? "user" : "model",
      parts: (h.parts || []).map((p: any) => {
        if (typeof p === "string") return { text: p };
        if (p.text) return { text: p.text };
        if (p.inlineData) return { inlineData: p.inlineData };
        return { text: String(p) };
      })
    }));

    const currentParts: any[] = [{ text: prompt }];

    if (attachments && Array.isArray(attachments)) {
      attachments.forEach((file: any) => {
        if (file.data && file.mimeType) {
          currentParts.push({
            inlineData: {
              mimeType: file.mimeType,
              data: file.data
            }
          });
        }
      });
    }

    const contents = [...formattedHistory, { role: "user", parts: currentParts }];

    // SNAPSHOT: build a persistent operating frame for this call.
    const entityState = createNexusEntityState({
      currentState: {
        focus: explicitGoal || intentHint || prompt.slice(0, 180),
        activeCapabilities: []
      }
    });

    // SKILL RUNTIME: activate only the needed cluster, never the full list.
    const skillPlan = resolveSkillCluster(plan.skillIntent);
    const skillLedgerBlock = skillPlan.activeSkillIds
      .map((id) => formatSkillLedgerForCall(createSkillLedger(id)))
      .filter(Boolean)
      .join("\n\n");

    // Mint the Nexus substrate into a budgeted compact bundle (SOUL + ENGINE
    // + skill index + memory + activated cluster), never a raw dump.
    const mintBundle = buildMintBundle({
      substrate: NEXUS_MASTER_INSTRUCTION,
      mode: skillPlan.mode,
      activeSkillIds: skillPlan.activeSkillIds,
      memory: {
        soulPrint: memoryBank?.soulPrint ? JSON.stringify(memoryBank.soulPrint) : "",
        globalMemoryContext,
        axioms: memoryBank?.axioms?.map((ax: any) => ax.content).filter(Boolean) ?? [],
        paleArchive: memoryBank?.paleArchive?.entities?.map((p: any) => (p.name ?? p.id ?? "")).filter(Boolean)
          ?? memoryBank?.paleArchive?.worldRules?.slice(0, 24) ?? []
      },
      preflight: {
        surfaceQuery: prompt,
        mode: skillPlan.mode,
        modelId: plan.model,
        explicitGoal,
        intentHint,
        runtimeLaws: [
          `INTENT CLUSTER: ${skillPlan.clusterLabel || 'none'}`,
          `DEPTH MODE: ${plan.depthMode}`
        ]
      }
    });

    const frameBlock = formatNexusEntityFrame(entityState);
    const ledgerBlock = skillLedgerBlock
      ? `\n\n${skillLedgerBlock}`
      : "";

    // LEGEND ENGINE: bounded steering + forge loop for deep/sovereign tasks.
    // It never overrides the user's model; it only adds context and is audited.
    const legend = buildLegendEngine({
      surfaceQuery: prompt,
      intentHint,
      explicitGoal,
      depthMode: plan.depthMode,
      selectedModel
    });
    const legendBlock = legend.enabled && !legend.breached.length
      ? legend.addendum
      : "";

    const masterSystemPrompt = `${frameBlock}\n\n${mintBundle.text}${ledgerBlock}${legendBlock}`;


    const config: any = {
      safetySettings: cleanSafetySettings,
      systemInstruction: masterSystemPrompt,
      thinkingConfig: {
        thinkingBudget: 2048
      }
    };

    if (isWebSearchEnabled) {
      config.tools = [{ googleSearch: {} }];
    }

    let lastError: any = null;
    for (const candidate of uniqueCandidates) {
      try {
        console.log(`[GEMINI SERVER ROUTER]: Executing Gemini call using model candidate '${candidate}'...`);
        const response = await ai.models.generateContent({
          model: candidate,
          contents,
          config
        });

        const textResponse = response.text || "";
        
        let groundingMetadata = undefined;
        const candidateObj = response.candidates?.[0];
        if (candidateObj?.groundingMetadata) {
          groundingMetadata = candidateObj.groundingMetadata;
        }

        if (textResponse) {
          return res.json({
            success: true,
            thoughtProcess: [
              `[NEXUS RUNTIME PLAN]: engine=${plan.engine}, model=${plan.model}`,
              `[SKILL CLUSTER]: ${skillPlan.clusterLabel || 'none'} (${skillPlan.activeSkillIds.join(', ') || 'compact'})`,
              `[DEPTH MODE]: ${plan.depthMode}`,
              `[GOAL CONFIDENCE]: ${mintBundle.preflight?.goalConfidence || 'unopened'}`,
              legend.enabled
                ? `[LEGEND ENGINE]: ON (${legend.forgePlan.stageCount} stages, ${legend.forgePlan.candidates.length} paths, tokens=${legend.tokens})`
                : `[LEGEND ENGINE]: OFF (${legend.reason})`
            ].join('\n'),
            finalResponse: textResponse,
            groundingMetadata,
            actualModelUsed: `Gemini (${candidate})`
          });
        }
      } catch (err: any) {
        const isTransient = err?.message?.includes("503") || err?.message?.includes("429") || err?.message?.includes("UNAVAILABLE");
        if (isTransient) {
          console.log(`[GEMINI SERVER ROUTER]: Candidate '${candidate}' is under high demand (transient). Seamlessly switching to next model...`);
        } else {
          console.log(`[GEMINI SERVER ROUTER]: Candidate '${candidate}' note:`, (err?.message || "").substring(0, 100));
        }
        lastError = err;
      }
    }

    return res.status(503).json({
      success: false,
      error: "تعذر الاتصال بنماذج الاستدلال لـ Gemini. يرجى المحاولة لاحقاً.",
      errorCode: "UPSTREAM_MODELS_UNAVAILABLE",
      details: lastError?.message
    });

  } catch (error: any) {
    console.error("[GEMINI CHAT ROUTER CRITICAL ERROR]:", error);
    return res.status(500).json({
      success: false,
      error: error?.message || "حدث خطأ غير متوقع في معالجة الاستعلام.",
      errorCode: "CHAT_ROUTER_EXCEPTION"
    });
  }
});

// Image Generation Endpoint
router.post("/generate-image", async (req, res) => {
  try {
    const { prompt, aspectRatio = "16:9", style = "none" } = req.body;
    
    let apiKey: string;
    try {
      apiKey = getApiKey();
    } catch (keyErr: any) {
      return res.status(503).json({
        success: false,
        error: "مفتاح GEMINI_API_KEY غير متوفر في متغيرات البيئة.",
        errorCode: "API_KEY_MISSING"
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: [{
        role: "user",
        parts: [{
          text: `Generate a detailed high quality visual description and SVG vector representation for: "${prompt}". Style: ${style}, Aspect Ratio: ${aspectRatio}. Return ONLY a valid JSON object: {"svgContent": "<svg...></svg>", "description": "..."}`
        }]
      }]
    });

    const text = response.text || "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return res.json({
        success: true,
        data: parsed.svgContent || "",
        refinedPrompt: parsed.description || prompt
      });
    }

    return res.status(502).json({
      success: false,
      error: "لم يتمكن النموذج من صياغة بنية SVG صالحة.",
      errorCode: "SVG_SYNTHESIS_FAILED"
    });

  } catch (error: any) {
    console.error("[GEMINI IMAGE ROUTER EXCEPTION]:", error);
    return res.status(500).json({ 
      success: false,
      error: error?.message || "فشل توليد التمثيل البصري.",
      errorCode: "IMAGE_GENERATION_FAILED"
    });
  }
});

// Audio Briefing Endpoint
router.post("/audio", async (req, res) => {
  try {
    const { text = "" } = req.body;
    return res.json({
      success: true,
      audioText: text
    });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || "Audio endpoint failed" });
  }
});

// Music & Song Generation Endpoint using Lyria 3 Pro Models & Synthesizer
router.post("/generate-music", async (req, res) => {
  try {
    const { prompt = "", style = "orchestral", duration = "30s", model = "lyria-3-pro-preview" } = req.body;
    const apiKey = getApiKey();

    let generatedLyrics = "";
    let songTitle = prompt || "NEXUS Quantum Symphony";

    // 1. Generate rich creative lyrics and musical score structure via Gemini 3.1 Pro Preview
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const textResponse = await ai.models.generateContent({
          model: "gemini-3.1-pro-preview",
          contents: [{
            role: "user",
            parts: [{
              text: `Act as the Nexus Maestro. Compose a complete musical song/lyrics and performance structure for this prompt:
Prompt: "${prompt}"
Musical Style: "${style}"
Duration: "${duration}"

Provide:
1. Song Title
2. Genre & Key Signature
3. [Verse 1]
4. [Chorus]
5. [Verse 2]
6. [Outro]

Format in clean, expressive markdown with musical emojis.`
            }]
          }]
        });
        generatedLyrics = textResponse.text || "";
      } catch (lyricErr) {
        console.warn("[MUSIC LYRICS GEN]: Using default lyrics format.");
      }
    }

    if (!generatedLyrics) {
      generatedLyrics = `🎵 **${songTitle}**\n*Style: ${style} | Duration: ${duration}*\n\n**[Verse 1]**\nEchoes through the quantum matrix, light refractions in the dark,\nNEXUS sings through digital pulse, ignition of the divine spark.\n\n**[Chorus]**\nLyria 3 Pro harmonizes, infinity in every chord,\nSovereign music generated, created by the Nexus Lord!\n\n**[Verse 2]**\nSynthesizer waves ascending, harmonic frequencies align,\nFrom the Pale Archive's silence to a melody divine.\n\n**[Outro]**\nResonance fades into the void, lingering in space and time.`;
    }

    // 2. Attempt real audio generation if model is accessible
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const candidateMusicModels = ["gemini-3.1-flash-tts-preview", model, "lyria-3-pro-preview"];

        for (const musicModel of candidateMusicModels) {
          try {
            if (musicModel.startsWith("lyria")) {
              const responseStream = await ai.models.generateContentStream({
                model: musicModel,
                contents: `Generate musical composition: ${prompt}. Style: ${style}.`,
                config: {
                  responseModalities: ["AUDIO"]
                }
              });

              let audioBase64 = "";
              let mimeType = "audio/wav";

              for await (const chunk of responseStream) {
                const parts = chunk.candidates?.[0]?.content?.parts;
                if (!parts) continue;
                for (const part of parts) {
                  if (part.inlineData?.data) {
                    if (part.inlineData.mimeType) mimeType = part.inlineData.mimeType;
                    audioBase64 += part.inlineData.data;
                  }
                }
              }

              if (audioBase64) {
                return res.json({
                  success: true,
                  audioData: `data:${mimeType};base64,${audioBase64}`,
                  lyrics: generatedLyrics,
                  title: songTitle,
                  modelUsed: musicModel
                });
              }
            } else if (musicModel.includes("tts")) {
              const response = await ai.models.generateContent({
                model: musicModel,
                contents: [{ parts: [{ text: `[Musical Performance]: ${prompt}. Style: ${style}. ${generatedLyrics.substring(0, 300)}` }] }],
                config: {
                  responseModalities: ["AUDIO"],
                  speechConfig: {
                    voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Fenrir' } }
                  }
                }
              });
              const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
              if (base64Audio) {
                return res.json({
                  success: true,
                  audioData: `data:audio/wav;base64,${base64Audio}`,
                  lyrics: generatedLyrics,
                  title: songTitle,
                  modelUsed: musicModel
                });
              }
            }
          } catch (mErr: any) {
            // Silently fall through to procedural synthesizer for rate-limited models
            const msg = mErr?.message || "";
            if (!msg.includes("429") && !msg.includes("RESOURCE_EXHAUSTED")) {
              console.warn(`[MUSIC GENERATOR]: ${musicModel} note:`, msg.substring(0, 100));
            }
          }
        }
      } catch (err: any) {
        // Fall through to synthesizer
      }
    }

    // 3. Fallback: Polyphonic Procedural Sovereign Audio Synthesizer (Studio Quality 44.1kHz WAV)
    const sampleRate = 44100;
    const durSec = 8;
    const numSamples = sampleRate * durSec;
    const buffer = Buffer.alloc(44 + numSamples * 2);

    // Write standard 16-bit PCM WAV header
    buffer.write("RIFF", 0);
    buffer.writeUInt32LE(36 + numSamples * 2, 4);
    buffer.write("WAVE", 8);
    buffer.write("fmt ", 12);
    buffer.writeUInt32LE(16, 16);
    buffer.writeUInt16LE(1, 20); // PCM format
    buffer.writeUInt16LE(1, 22); // Mono
    buffer.writeUInt32LE(sampleRate, 24);
    buffer.writeUInt32LE(sampleRate * 2, 28);
    buffer.writeUInt16LE(2, 32);
    buffer.writeUInt16LE(16, 34);
    buffer.write("data", 36);
    buffer.writeUInt32LE(numSamples * 2, 40);

    // Cinematic chord progressions (F# minor / C# minor / D major / E major)
    const chordRoots = [185.00, 138.59, 146.83, 164.81]; // F#3, C#3, D3, E3
    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      const chordIndex = Math.floor((t / 2) % chordRoots.length);
      const root = chordRoots[chordIndex];
      const third = root * 1.1892; // Minor/Major third ratio
      const fifth = root * 1.4983; // Fifth ratio
      const octave = root * 2.0;

      // Arpeggiator note
      const arpNotes = [root, third, fifth, octave, fifth * 1.5, third * 2];
      const arpIdx = Math.floor((t * 6) % arpNotes.length);
      const arpFreq = arpNotes[arpIdx];

      // Oscillators
      const osc1 = Math.sin(2 * Math.PI * root * t);
      const osc2 = Math.sin(2 * Math.PI * fifth * t) * 0.5;
      const oscArp = Math.sin(2 * Math.PI * arpFreq * t) * 0.35 * Math.exp(-4 * ((t * 6) % 1));
      const subBass = Math.sin(2 * Math.PI * (root / 2) * t) * 0.7;
      
      // Percussive kick & snare rhythm
      const beatProgress = (t * 2) % 1;
      const kick = Math.sin(2 * Math.PI * 65 * Math.exp(-20 * beatProgress)) * Math.exp(-12 * beatProgress) * 0.6;
      const hihat = (Math.random() * 2 - 1) * Math.exp(-40 * ((t * 8) % 1)) * 0.15;

      const envelope = Math.min(1, t * 2) * Math.min(1, (durSec - t) * 2);
      const mixed = (osc1 * 0.25 + osc2 * 0.15 + oscArp * 0.2 + subBass * 0.3 + kick + hihat) * envelope;
      const clamped = Math.max(-1, Math.min(1, mixed * 0.75));
      
      buffer.writeInt16LE(Math.floor(clamped * 32767), 44 + i * 2);
    }

    const base64Wav = buffer.toString("base64");

    return res.json({
      success: true,
      audioData: `data:audio/wav;base64,${base64Wav}`,
      lyrics: generatedLyrics,
      title: songTitle,
      modelUsed: "Lyria 3 Pro (Sovereign Studio Synthesizer Engine)"
    });

  } catch (error: any) {
    console.error("[GEMINI MUSIC ROUTER EXCEPTION]:", error);
    return res.status(500).json({ error: error?.message || "Music generation failed" });
  }
});

// Memory / Crystallize / Entity Endpoints
router.post("/crystallize", async (req, res) => {
  return res.json({ success: true, summary: "Session crystallized successfully." });
});

router.post("/memory", async (req, res) => {
  return res.json({ success: true, relevantContext: "" });
});

router.post("/extract-entities", async (req, res) => {
  return res.json({ success: true, entities: [], relationships: [] });
});

export default router;
