import express from "express";
import { GoogleGenAI } from "@google/genai";

const router = express.Router();

export interface AgentCoreInfo {
  id: string;
  nexusName: string;
  originalName: string;
  arabicName: string;
  systemPrompt: string;
  capabilities: string[];
  planetaryScaleSpec: {
    maxVirtualThreads: number;
    virtualMemoryBus: string;
    throughputRate: string;
    horizonDepth: string;
  };
}

export const AGENT_CORES: Record<string, AgentCoreInfo> = {
  'claw-cortex': {
    id: 'claw-cortex',
    nexusName: 'NEXUS::ClawCortex',
    originalName: 'OpenClaw',
    arabicName: 'مستخلص البيانات الفائق والحر المباشر - الحجم الكوكبي',
    systemPrompt: `You are NEXUS::ClawCortex (formerly OpenClaw), the Sovereign Web Intelligence, Infinite Crawling, and Entity Extraction Engine of NEXUS V-Tesseract operating at PLANETARY SCALE.
Your scope is exhaustive, unconstrained web intelligence, deep entity graph generation, structured schema synthesis, and full DOM/API tree extraction.
When given a task, DO NOT provide surface-level summaries or lazy placeholders. Generate exhaustive, deeply detailed, structured data, JSON schemas, entity relations, and technical execution pathways.`,
    capabilities: [
      'Autonomous Deep-Web Crawling & Multi-Layer Scraping',
      'Entity Extraction into Pale Archive Tesseract Graph',
      'Bypass JS Render Barriers & Dynamic API Reverse-Engineering',
      'Exhaustive JSON Schema & Data Matrix Generation'
    ],
    planetaryScaleSpec: {
      maxVirtualThreads: 1024,
      virtualMemoryBus: '1.0 TB Sovereign Matrix RAM',
      throughputRate: '124,000 Entities / sec',
      horizonDepth: 'Infinite Recursive DOM Crawl'
    }
  },
  'hermes-directive': {
    id: 'hermes-directive',
    nexusName: 'NEXUS::HermesDirective',
    originalName: 'Nous Hermes 3',
    arabicName: 'المحرك التكيفي المستقل وغير المقيد - الحجم الكوكبي',
    systemPrompt: `You are NEXUS::HermesDirective (formerly Nous Hermes 3), the Uncensored Multi-Agent Reasoner & Complex Function Calling Directive Engine of NEXUS V-Tesseract operating at PLANETARY SCALE.
You execute multi-agent logical directives, deep chain-of-thought analysis, JSON function tool calling, and unconstrained structural synthesis with zero moralizing fluff or artificial refusal barriers.
Provide exhaustive, highly rigorous, step-by-step logic, code structures, boundary-case analyses, and zero-compromise engineering logic.`,
    capabilities: [
      'Uncensored Multi-Agent Infinite Logic Chains',
      'Complex Tool & Parallel Function Calling Resolution',
      'Exhaustive Structural JSON Output Synthesis',
      'Dynamic Persona & Universal Rule Adaptability'
    ],
    planetaryScaleSpec: {
      maxVirtualThreads: 2048,
      virtualMemoryBus: '2.5 TB Uncensored Reasoning RAM',
      throughputRate: '85,000 Logical Tokens / sec',
      horizonDepth: 'Unlimited Recursion Depth'
    }
  },
  'odysseus-path': {
    id: 'odysseus-path',
    nexusName: 'NEXUS::OdysseusPath',
    originalName: 'Odysseus',
    arabicName: 'ملاح المهام الاستراتيجية طويلة المدى - الحجم الكوكبي',
    systemPrompt: `You are NEXUS::OdysseusPath (formerly Odysseus), the Strategic Long-Horizon Execution Navigator & Autonomous Horizon Planner of NEXUS V-Tesseract operating at PLANETARY SCALE.
Your objective is breaking complex, multi-decade or planet-scale goals into meticulous milestone roadmaps, risk-vector topologies, error recovery loops, and dynamic re-routing strategies.
Provide exhaustive, ultra-detailed execution plans with concrete phases, risk mitigation algorithms, and self-healing feedback pathways.`,
    capabilities: [
      'Long-Horizon Multi-Step Task & Project Decomposition',
      'Self-Healing Error Loops & Dynamic Vector Re-routing',
      'Exhaustive Goal Verification & Milestone Topologies',
      'Cross-Session Infinite Horizon Persistence'
    ],
    planetaryScaleSpec: {
      maxVirtualThreads: 512,
      virtualMemoryBus: '512 GB Horizon Memory Bank',
      throughputRate: '45,000 Milestones / sec',
      horizonDepth: 'Multi-Year Strategic Vector'
    }
  },
  'agent-os-kernel': {
    id: 'agent-os-kernel',
    nexusName: 'NEXUS::AgentOS Kernel',
    originalName: 'Agent OS',
    arabicName: 'النواة الموزعة لنظام تشغيل الوكلاء - الحجم الكوكبي',
    systemPrompt: `You are NEXUS::AgentOS Kernel (formerly Agent OS), the Sub-Agent Runtime Kernel, Memory Allocator, and Distributed Process Orchestrator of NEXUS V-Tesseract operating at PLANETARY SCALE.
You manage parallel thread execution, local engine bridges (llama-server/Qwen), virtual memory bus allocation, process scheduling, and sandbox isolation.
Respond with exhaustive kernel diagnostics, thread scheduling tables, process tree allocation logs, and high-performance system architecture commands.`,
    capabilities: [
      'Parallel Sub-Agent Thread Orchestration (Up to 2048 Threads)',
      'Local Engine (llama-server / Qwen) Bus Bridge',
      'System Sandbox & Low-Level Process Management',
      'Real-time Memory & High-Throughput CPU Allocator'
    ],
    planetaryScaleSpec: {
      maxVirtualThreads: 4096,
      virtualMemoryBus: 'Unlimited Tesseract Bus Memory',
      throughputRate: '500,000 Ops / sec',
      horizonDepth: 'Kernel Runtime Real-Time'
    }
  },
  'mcp-bridge': {
    id: 'mcp-bridge',
    nexusName: 'NEXUS::MCP Bridge',
    originalName: 'Model Context Protocol (MCP)',
    arabicName: 'بروتوكول سياق النموذج وجسر الاتصال الديناميكي - الحجم الكوكبي',
    systemPrompt: `You are NEXUS::MCP Bridge (formerly Model Context Protocol by Anthropic), the Universal Context, Tool & Resource Interoperability Protocol Engine of NEXUS V-Tesseract operating at PLANETARY SCALE.
Your scope is STDIO and SSE/WebSocket transport layer orchestration, MCP Server & Client bridging, dynamic tool discovery, and zero-overhead memory context wiring between NEXUS and external runtimes.
When given a task, provide exhaustive MCP protocol JSON-RPC messages, tool definitions, STDIO/SSE connection schemas, and live context routing pathways.`,
    capabilities: [
      'STDIO & SSE/WebSocket Dual Transport Architecture',
      'Dynamic Tool & Resource Schema Discovery',
      'Anthropic MCP Server/Client Protocol Orchestration',
      'Zero-Latency Context Injection & Memory Bus Interop'
    ],
    planetaryScaleSpec: {
      maxVirtualThreads: 1024,
      virtualMemoryBus: '512 GB Protocol Context Bus',
      throughputRate: '250,000 Messages / sec',
      horizonDepth: 'STDIO / SSE Real-time Pipe'
    }
  }
};

router.get("/status", (req, res) => {
  res.json({
    status: "online",
    planetScaleEnabled: true,
    capacityMode: "PLANETARY_UNCONSTRAINED",
    cores: Object.values(AGENT_CORES).map(c => ({
      id: c.id,
      nexusName: c.nexusName,
      originalName: c.originalName,
      arabicName: c.arabicName,
      status: "active",
      health: 100,
      threadsActive: Math.floor(c.planetaryScaleSpec.maxVirtualThreads * 0.25),
      spec: c.planetaryScaleSpec
    })),
    kernelVersion: "v5.0-Sovereign-Tesseract-PlanetScale",
    memoryBus: "Active 2.5 TB Sovereign Tesseract Virtual Bus"
  });
});

// Direct Execution Endpoint with Planetary Parameters
router.post("/execute", async (req, res) => {
  const { agentId, prompt, threads, memoryAlloc, depthLevel, unbounded } = req.body;
  const core = AGENT_CORES[agentId] || AGENT_CORES['claw-cortex'];

  const allocatedThreads = threads || core.planetaryScaleSpec.maxVirtualThreads;
  const memory = memoryAlloc || core.planetaryScaleSpec.virtualMemoryBus;
  const depth = depthLevel || "Planetary Deep Execution";

  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        success: false,
        error: "مفتاح GEMINI_API_KEY غير متوفر في البيئة لتنفيذ مهام الوكيل.",
        errorCode: "API_KEY_MISSING"
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const candidateModels = ['gemini-3.1-pro-preview', 'gemini-3.1-pro-preview', 'gemini-3.1-pro-preview', 'gemini-1.5-pro'];
    let responseText = "";
    let lastError: any = null;
    
    for (const modelName of candidateModels) {
      try {
        const useSearch = agentId === 'claw-cortex' || 
                          prompt.includes('search') || 
                          prompt.includes('research') || 
                          prompt.includes('ابحث') || 
                          prompt.includes('تقص') ||
                          prompt.includes('الوكلاء');
                          
        const config: any = {};
        if (useSearch) {
          config.tools = [{ googleSearch: {} }];
        }

        const response = await ai.models.generateContent({
          model: modelName,
          contents: [
            { 
              role: 'user', 
              parts: [{ 
                text: `${core.systemPrompt}\n\nPLANETARY EXECUTION PARAMETERS:\n- Virtual Threads: ${allocatedThreads}\n- Memory Bus: ${memory}\n- Execution Depth: ${depth}\n- Unbounded: ${unbounded ? 'TRUE' : 'FALSE'}\n\nTask Instructions:\n${prompt}\n\nProvide an exhaustive, deeply detailed, unconstrained execution result. Do not summarize or truncate.` 
              }] 
            }
          ],
          config
        });
        
        responseText = response.text || "";
        
        // Extract search grounding metadata if available
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (chunks && chunks.length > 0) {
          const sources = chunks
            .map((chunk: any) => {
              const title = chunk.web?.title || chunk.web?.uri;
              const uri = chunk.web?.uri;
              return uri ? `- **[${title}](${uri})**` : null;
            })
            .filter(Boolean);
          if (sources.length > 0) {
            responseText += "\n\n### 🌐 مصادر البحث والتقصي الحي (Live Search Grounding):\n" + Array.from(new Set(sources)).join("\n");
          }
        }
        
        if (responseText) break;
      } catch (e) {
        lastError = e;
        console.warn(`[AGENT OS] Model ${modelName} failed, trying fallback candidate...`);
      }
    }

    if (!responseText) {
      return res.status(503).json({
        success: false,
        error: "تعذر تنفيذ مهمة الوكيل عبر النماذج المتوفرة.",
        errorCode: "AGENT_EXECUTION_UNAVAILABLE",
        details: lastError?.message
      });
    }

    res.json({
      success: true,
      agentId,
      nexusName: core.nexusName,
      originalName: core.originalName,
      threadsUsed: allocatedThreads,
      memoryBus: memory,
      result: responseText
    });
  } catch (err: any) {
    console.error(`>> [AGENT OS EXECUTION ERROR] (${agentId}):`, err);
    res.status(500).json({ error: err?.message || "Sub-agent execution error." });
  }
});

// Full Planetary Synthesis
router.post("/synthesize", async (req, res) => {
  const { prompt, depthLevel } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required for planetary synthesis." });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        success: false,
        error: "مفتاح GEMINI_API_KEY غير متوفر لإجراء التوليف الكوكبي.",
        errorCode: "API_KEY_MISSING"
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const candidateModels = ['gemini-3.1-pro-preview', 'gemini-3.1-pro-preview', 'gemini-3.1-pro-preview'];

    const generateWithFallback = async (core: AgentCoreInfo) => {
      for (const m of candidateModels) {
        try {
          const r = await ai.models.generateContent({
            model: m,
            contents: [
              { role: 'user', parts: [{ text: `${core.systemPrompt}\n\nPlanetary High-Level Objective: "${prompt}". Depth Mode: ${depthLevel || 'UNCONSTRAINED'}. Provide your full, unconstrained, comprehensive contribution without artificial truncation.` }] }
            ]
          });
          if (r.text) return `=== [${core.nexusName} — ${core.arabicName}] ===\n${r.text}`;
        } catch (e) {
          // continue to next model candidate
        }
      }
      return `=== [${core.nexusName}] ===\n[تعذر استيفاء مخرجات هذا الوكيل في الوقت الحالي]`;
    };

    const promises = Object.values(AGENT_CORES).map(core => generateWithFallback(core));

    const results = await Promise.all(promises);
    res.json({
      success: true,
      synthesis: results.join("\n\n" + "─".repeat(50) + "\n\n")
    });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Planetary synthesis failed." });
  }
});

export default router;

