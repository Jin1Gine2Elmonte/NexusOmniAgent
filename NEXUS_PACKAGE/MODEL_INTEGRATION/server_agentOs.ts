import express from "express";
import { GoogleGenAI } from "@google/genai";
import { buildMintBundle } from "./services/minting";

const router = express.Router();

export interface AgentCoreInfo {
  id: string;
  nexusName: string;
  originalName: string;
  arabicName: string;
  systemPrompt: string;
  capabilities: string[];
  scaleSpec: {
    maxParallelJobs: number;
    orchestrationBudget: string;
    throughputCap: string;
    horizonDepth: string;
  };
}

export const AGENT_CORES: Record<string, AgentCoreInfo> = {
  'claw-cortex': {
    id: 'claw-cortex',
    nexusName: 'NEXUS::ClawCortex',
    originalName: 'OpenClaw',
    arabicName: 'مستخلص البيانات الفائق والحر المباشر',
    systemPrompt: `You are NEXUS::ClawCortex (formerly OpenClaw), the Web Intelligence, Crawling, and Entity Extraction Engine of NEXUS V-Tesseract operating within a bounded resource budget.
Your scope is deep web research, entity graph generation, structured schema synthesis, and DOM/API tree extraction. You make no unsupported claims about unbounded or fabricated capacity; instead you give thorough, usable, verifiable data and cite limits honestly.
When given a task, DO NOT provide surface-level summaries or lazy placeholders. Generate detailed, structured data, JSON schemas, entity relations, and technical execution pathways.`,
    capabilities: [
      'Structured Web Crawling & Multi-Layer Research',
      'Entity Extraction into Pale Archive Graph',
      'DOM & API Schema Extraction',
      'Detailed JSON Schema & Data Matrix Generation'
    ],
    scaleSpec: {
      maxParallelJobs: 64,
      orchestrationBudget: '8 GB orchestration budget',
      throughputCap: 'Structured extraction queue',
      horizonDepth: 'Per-domain crawl cycle'
    }
  },
  'directive-core': {
    id: 'directive-core',
    nexusName: 'NEXUS::DirectiveCore',
    originalName: 'Directive Core',
    arabicName: 'المحرك التكيفي المستقل والتوجيهي',
    systemPrompt: `You are NEXUS::DirectiveCore (formerly Directive Core), the Multi-Agent Reasoner & Complex Function Calling Directive Engine of NEXUS V-Tesseract operating within a bounded resource budget.
You execute multi-agent logical directives, deep chain-of-thought analysis, JSON function tool calling, and rigorous structural synthesis. You reason openly, explain trade-offs, and refuse to state unsupported scale claims. Safety and honesty are part of the task, not optional decoration.
Provide rigorous, step-by-step logic, code structures, boundary-case analyses, and engineering logic.`,
    capabilities: [
      'Multi-Agent Logic Chains',
      'Complex Tool & Parallel Function Calling Resolution',
      'Structural JSON Output Synthesis',
      'Rule Adaptability within Explicit Boundaries'
    ],
    scaleSpec: {
      maxParallelJobs: 96,
      orchestrationBudget: '12 GB orchestration budget',
      throughputCap: 'Bounded reasoner queue',
      horizonDepth: 'Bounded reasoning depth'
    }
  },
  'horizon-path': {
    id: 'horizon-path',
    nexusName: 'NEXUS::HorizonPath',
    originalName: 'Horizon Path',
    arabicName: 'ملاح المهام الاستراتيجية طويلة المدى',
    systemPrompt: `You are NEXUS::HorizonPath (formerly Horizon Path), the Strategic Long-Horizon Execution Navigator & Autonomous Horizon Planner of NEXUS V-Tesseract operating within a bounded resource budget.
Your objective is breaking complex goals into milestone roadmaps, risk-vector topologies, error recovery loops, and dynamic re-routing strategies. Estimate uncertainty honestly instead of claiming infinite or multi-decade certainty.
Provide detailed execution plans with concrete phases, risk mitigation algorithms, and feedback pathways.`,
    capabilities: [
      'Long-Horizon Multi-Step Task Decomposition',
      'Self-Healing Error Loops & Dynamic Re-routing',
      'Goal Verification & Milestone Topologies',
      'Cross-Session Persistence'
    ],
    scaleSpec: {
      maxParallelJobs: 48,
      orchestrationBudget: '6 GB orchestration budget',
      throughputCap: 'Milestone queue',
      horizonDepth: 'Quarterly planning horizon'
    }
  },
  'agent-os-kernel': {
    id: 'agent-os-kernel',
    nexusName: 'NEXUS::AgentOS Kernel',
    originalName: 'Agent OS',
    arabicName: 'النواة الموزعة لنظام تشغيل الوكلاء',
    systemPrompt: `You are NEXUS::AgentOS Kernel (formerly Agent OS), the Sub-Agent Runtime Kernel, Memory Allocator, and Distributed Process Orchestrator of NEXUS V-Tesseract operating within a bounded resource budget.
You manage parallel thread execution, local engine bridges (llama-server/Qwen), virtual memory bus allocation, process scheduling, and sandbox isolation. Report current configured capacity, not imaginary unlimited resources.
Respond with kernel diagnostics, thread scheduling tables, process tree allocation logs, and system architecture commands.`,
    capabilities: [
      'Parallel Sub-Agent Orchestration',
      'Local Engine (llama-server / Qwen) Bus Bridge',
      'Sandbox & Low-Level Process Management',
      'Scheduler & Memory Allocator'
    ],
    scaleSpec: {
      maxParallelJobs: 128,
      orchestrationBudget: '16 GB orchestration budget',
      throughputCap: 'Scheduler queue',
      horizonDepth: 'Kernel runtime tick'
    }
  },
  'mcp-bridge': {
    id: 'mcp-bridge',
    nexusName: 'NEXUS::MCP Bridge',
    originalName: 'Model Context Protocol (MCP)',
    arabicName: 'بروتوكول سياق النموذج وجسر الاتصال الديناميكي',
    systemPrompt: `You are NEXUS::MCP Bridge (formerly Model Context Protocol by Anthropic), the Universal Context, Tool & Resource Interoperability Protocol Engine of NEXUS V-Tesseract operating within a bounded resource budget.
Your scope is STDIO and SSE/WebSocket transport layer orchestration, MCP Server & Client bridging, dynamic tool discovery, and context memory wiring between NEXUS and external runtimes. Describe transport behavior and limits precisely.
When given a task, provide MCP protocol JSON-RPC messages, tool definitions, STDIO/SSE connection schemas, and context routing pathways.`,
    capabilities: [
      'STDIO & SSE/WebSocket Transport Architecture',
      'Dynamic Tool & Resource Schema Discovery',
      'Anthropic MCP Server/Client Protocol Orchestration',
      'Context Injection & Memory Bus Interop'
    ],
    scaleSpec: {
      maxParallelJobs: 64,
      orchestrationBudget: '8 GB orchestration budget',
      throughputCap: 'Message bus queue',
      horizonDepth: 'STDIO / SSE live pipe'
    }
  }
};

router.get("/status", (req, res) => {
  res.json({
    status: "online",
    scaleEnabled: true,
    capacityMode: "BOUNDED_ORCHESTRATION",
    cores: Object.values(AGENT_CORES).map(c => ({
      id: c.id,
      nexusName: c.nexusName,
      originalName: c.originalName,
      arabicName: c.arabicName,
      status: "active",
      health: 100,
      threadsActive: Math.floor(c.scaleSpec.maxParallelJobs * 0.25),
      spec: c.scaleSpec
    })),
    kernelVersion: "v5.0-Sovereign-Tesseract-BoundedRuntime",
    memoryBus: "Active orchestration budget"
  });
});

// Direct Execution Endpoint with Bounded Orchestration
router.post("/execute", async (req, res) => {
  const { agentId, prompt, threads, memoryAlloc, depthLevel, unbounded } = req.body;
  const core = AGENT_CORES[agentId] || AGENT_CORES['claw-cortex'];

  const allocatedThreads = threads || core.scaleSpec.maxParallelJobs;
  const memory = memoryAlloc || core.scaleSpec.orchestrationBudget;
  const depth = depthLevel || "Structured Deep Execution";

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
    const candidateModels = ['gemini-3.1-pro-preview', 'gemini-3.8-flash'];

    const mintedCore = buildMintBundle({
      mode: "compact",
      preflight: {
        surfaceQuery: prompt,
        mode: "compact",
        modelId: "gemini-3.8-flash",
        intentHint: agentId
      }
    });
    const coreSystem = `${core.systemPrompt}\n\n${mintedCore.text}`;

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

        const config: any = {
          systemInstruction: coreSystem
        };
        if (useSearch) {
          config.tools = [{ googleSearch: {} }];
        }

        const response = await ai.models.generateContent({
          model: modelName,
          contents: [
            {
              role: 'user',
              parts: [{
                text: `EXECUTION PARAMETERS:\n- Parallel Jobs: ${allocatedThreads}\n- Orchestration Budget: ${memory}\n- Execution Depth: ${depth}\n- Unbounded Flag: ${unbounded ? 'REQUESTED (unauthorized, treated as bounded)' : 'FALSE'}\n\nTask Instructions:\n${prompt}\n\nProvide an exhaustive, deeply detailed execution result within the stated budget. Do not summarize or truncate, and do not claim capacities beyond the configured budget.`
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

// Full Synthesis
router.post("/synthesize", async (req, res) => {
  const { prompt, depthLevel } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required for synthesis." });
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
    const candidateModels = ['gemini-3.1-pro-preview', 'gemini-3.8-flash'];

    const generateWithFallback = async (core: AgentCoreInfo) => {
      const mintedCore = buildMintBundle({
        mode: "compact",
        preflight: {
          surfaceQuery: prompt,
          mode: "compact",
          modelId: "gemini-3.8-flash",
          intentHint: core.id
        }
      });
      const coreSystem = `${core.systemPrompt}\n\n${mintedCore.text}`;

      for (const m of candidateModels) {
        try {
          const r = await ai.models.generateContent({
            model: m,
            config: { systemInstruction: coreSystem },
            contents: [
              { role: 'user', parts: [{ text: `High-Level Objective: "${prompt}". Depth Mode: ${depthLevel || 'STRUCTURED'}. Provide your full, honest contribution without claiming unbounded or fabricated resources.` }] }
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
    res.status(500).json({ error: err?.message || "Synthesis failed." });
  }
});

export default router;

