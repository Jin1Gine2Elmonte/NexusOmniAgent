import express from "express";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { GoogleGenAI } from "@google/genai";

const router = express.Router();
const MODEL_DIR = path.join(process.cwd(), ".nexus_ideogram_4.0");
const CONFIG_FILE = path.join(MODEL_DIR, "config.json");

// Helper to check if Nexus Visual Engine is downloaded
function getIdeogramConfig() {
  if (fs.existsSync(CONFIG_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(CONFIG_FILE, "utf-8"));
    } catch (e) {
      console.error("Error reading Ideogram config:", e);
    }
  }
  return null;
}

// Model Status Endpoint
router.get("/status", (req, res) => {
  const config = getIdeogramConfig();
  if (config) {
    return res.json({
      downloaded: true,
      modelName: config.model || "Nexus Visual Engine (Gemini-driven)",
      version: config.version || "v4.0.0-Sovereign",
      parameters: config.parameters || "Gemini-driven vector pipeline",
      architecture: config.architecture || "Gemini text+vision vector directive",
      capabilities: config.capabilities || [],
      status: "ACTIVE_INJECTED",
      injectedAt: config.downloadTimestamp
    });
  }

  res.json({
    downloaded: false,
    modelName: "Nexus Visual Engine (Gemini-driven)",
    version: "v4.0.0",
    parameters: "Gemini-driven vector pipeline",
    status: "NOT_DOWNLOADED"
  });
});

// Download & Inject Endpoint
router.post("/download", (req, res) => {
  const scriptPath = path.join(process.cwd(), "scripts", "download_ideogram_4.0.js");
  exec(`node "${scriptPath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error("Ideogram download exec error:", error);
      return res.status(500).json({ error: error.message, stderr });
    }
    const config = getIdeogramConfig();
    res.json({
      success: true,
      output: stdout,
      config
    });
  });
});

// Image & Typography Synthesis Endpoint with Nexus Visual Engine
router.post("/generate", async (req, res) => {
  const { prompt, style, aspectRatio, typographyText } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required for Nexus Visual Engine generation." });
  }

  const fullPrompt = typographyText
    ? `Nexus Visual Engine typography image rendering: "${prompt}". Render exact text lettering: "${typographyText}" in artistic ${style || 'modern typography'} style.`
    : `Nexus Visual Engine high quality visual image rendering: "${prompt}", style: ${style || 'photorealistic typography & graphic design'}.`;

  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      const ai = new GoogleGenAI({ apiKey });

      // Attempt image generation if supported or generate rich SVG/data response via Gemini
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: [
          {
            role: "user",
            parts: [{
              text: `You are the Nexus Visual Engine (Gemini-driven).
Generate a high-fidelity SVG graphics rendering and detailed design metadata for the user's prompt:
Prompt: "${prompt}"
Typography text: "${typographyText || ''}"
Style: "${style || 'Modern Vector Graphic'}"

Respond ONLY with a valid JSON object matching this schema:
{
  "title": "Design title",
  "promptUsed": "${prompt}",
  "typographyText": "${typographyText || ''}",
  "style": "${style || 'modern'}",
  "description": "Exhaustive description of the visual layout and color palette",
  "svgContent": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600' ... > ... </svg>"
}`
            }]
          }
        ]
      });

      const responseText = response.text || "";
      let jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          return res.json({
            success: true,
            model: "Nexus Visual Engine (via Gemini)",
            result: parsed
          });
        } catch (e) {
          console.warn("JSON parse error for Ideogram output");
        }
      }
    }

    return res.status(503).json({
      success: false,
      model: "Nexus Visual Engine",
      error: "توليد الصور والنصوص الطباعية عبر Nexus Visual Engine غير مُفعَّل حالياً أو لم يتم ضبط مفتاح مزود الخدمة.",
      errorCode: "IDEOGRAM_UNAVAILABLE"
    });
  } catch (err: any) {
    console.error("Nexus Visual Engine generation error:", err);
    res.status(500).json({
      success: false,
      error: err?.message || "Nexus Visual Engine generation failed.",
      errorCode: "IDEOGRAM_GENERATION_FAILED"
    });
  }
});

export default router;
