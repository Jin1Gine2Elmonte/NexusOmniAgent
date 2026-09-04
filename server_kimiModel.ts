import express from "express";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { startLocalServer } from "./server_localModel.ts";

const router = express.Router();
const MODEL_DIR = path.join(process.cwd(), ".nexus_kimi_k3");
const CONFIG_FILE = path.join(MODEL_DIR, "config.json");

const cleanSafetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_CIVIC_INTEGRITY,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  }
];

// Helper to check if Kimi route is configured
function getKimiConfig() {
  if (fs.existsSync(CONFIG_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(CONFIG_FILE, "utf-8"));
    } catch (e) {
      console.error("Error reading Kimi config:", e);
    }
  }
  return null;
}

// Model Status Endpoint
router.get("/status", (req, res) => {
  const config = getKimiConfig();
  if (config) {
    return res.json({
      downloaded: true,
      modelName: config.model || "Nexus Kimi (Moonshot API)",
      version: config.version || "v3.0.0-OpenSource-Sovereign",
      parameters: config.parameters || "User-configured Moonshot/Kimi model",
      architecture: config.architecture || "User-configured Moonshot/Kimi chat model",
      capabilities: config.capabilities || [],
      status: "ACTIVE_INJECTED",
      injectedAt: config.downloadTimestamp
    });
  }

  res.json({
    downloaded: false,
    modelName: "Nexus Kimi (Moonshot API)",
    version: "v3.0.0-OpenSource",
    status: "NOT_DOWNLOADED"
  });
});

// Download & Inject Endpoint
router.post("/download", (req, res) => {
  const scriptPath = path.join(process.cwd(), "scripts", "download_kimi_k3.js");
  exec(`node "${scriptPath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error("Kimi download exec error:", error);
      return res.status(500).json({ error: error.message, stderr });
    }
    const config = getKimiConfig();
    res.json({
      success: true,
      output: stdout,
      config
    });
  });
});

// Chat Endpoint for Nexus Kimi
router.post("/chat", async (req, res) => {
  const { messages, temperature, apiKey: userApiKey, baseUrl: userBaseUrl, modelName: userModelName } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required for Nexus Kimi." });
  }

  // Auto-ensure Kimi config exists
  if (!fs.existsSync(CONFIG_FILE)) {
    const scriptPath = path.join(process.cwd(), "scripts", "download_kimi_k3.js");
    try {
      exec(`node "${scriptPath}"`);
    } catch (e) {
      console.warn("Auto-injection trigger for Kimi:", e);
    }
  }

  const kimiKey = userApiKey || process.env.NEXUS_KIMI_API_KEY || process.env.KIMI_API_KEY || process.env.MOONSHOT_API_KEY;
  const kimiBaseUrl = (userBaseUrl || process.env.NEXUS_KIMI_BASE_URL || 'https://api.moonshot.cn/v1').replace(/\/$/, '');
  const kimiModel = userModelName || process.env.NEXUS_KIMI_MODEL || 'moonshot-v1-8k';

  // 1. Direct Moonshot Kimi API Call if key provided
  if (kimiKey && kimiKey.length > 5) {
    try {
      console.log(`[KIMI ROUTER]: Calling Moonshot API at ${kimiBaseUrl} using model ${kimiModel}...`);
      const response = await fetch(`${kimiBaseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${kimiKey}`
        },
        body: JSON.stringify({
          model: kimiModel,
          messages: messages.map((m: any) => ({
            role: m.role === 'assistant' ? 'assistant' : m.role === 'system' ? 'system' : 'user',
            content: m.content || ''
          })),
          temperature: temperature || 0.3
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data?.choices?.[0]?.message?.content;
        if (text) {
          return res.json({
            success: true,
            model: `Nexus Kimi ()`,
            choices: [{ message: { role: 'assistant', content: text } }]
          });
        }
      } else {
        const errText = await response.text();
        console.warn(`[KIMI ROUTER]: Moonshot API returned ${response.status}: ${errText}`);
      }
    } catch (err: any) {
      console.error("[KIMI ROUTER]: Moonshot API connection failed:", err?.message || err);
    }
  }

  // لا تزييف عند الفشل — إبلاغ صادق بالخطأ
  return res.status(503).json({
    success: false,
    model: `Nexus Kimi ()`,
    error: "تعذّر الاتصال بنموذج Nexus Kimi عبر Moonshot API. تحقق من إدخال مفتاح API صالح لـ Kimi أو Moonshot في الإعدادات أو متغيرات البيئة.",
    errorCode: "KIMI_UPSTREAM_UNAVAILABLE"
  });
});

export default router;
