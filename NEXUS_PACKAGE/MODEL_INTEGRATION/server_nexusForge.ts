import express from "express";
import fs from "fs";
import path from "path";
import { exec } from "child_process";

const router = express.Router();
const OUTPUT_SVG = path.join(process.cwd(), "nexus_forge_x_output.svg");
const ENGINE_SCRIPT = path.join(process.cwd(), "architecture", "nexus_genesis_engine.py");

router.post("/generate", async (req, res) => {
  const { concept, steps, useExternal } = req.body;

  if (!concept) {
    return res.status(400).json({ error: "Concept is required for Nexus Forge X." });
  }

  const sanitizedSteps = Math.min(Math.max(Number(steps) || 20, 5), 50);
  const useExternalStr = useExternal === false ? "false" : "true";

  // Build the command line execution string
  // Pass GEMINI_API_KEY environment variable if present
  const cmd = `python3 "${ENGINE_SCRIPT}" --concept "${concept.replace(/"/g, '\\"')}" --steps ${sanitizedSteps} --use_external ${useExternalStr}`;

  console.log(`[NEXUS KERNEL] Launching Nexus Forge X: ${cmd}`);

  exec(cmd, { env: { ...process.env } }, (error, stdout, stderr) => {
    // Collect all logs
    const logs = stdout.split("\n").filter(line => line.trim().length > 0);
    const errorLogs = stderr ? stderr.split("\n").filter(line => line.trim().length > 0) : [];

    if (error) {
      console.error("[NEXUS ERROR] Forge X script execution error:", error);
      return res.json({
        success: false,
        error: error.message,
        logs: [...logs, ...errorLogs, `[FATAL] Execution failed: ${error.message}`],
      });
    }

    // Read generated output SVG
    try {
      if (fs.existsSync(OUTPUT_SVG)) {
        const svgContent = fs.readFileSync(OUTPUT_SVG, "utf-8");
        return res.json({
          success: true,
          logs: [...logs, "[SUCCESS] Vector Canvas generated from latent grid.", `[NEXUS] Forge completed in matching timeline.`],
          svgContent: svgContent,
          title: `Sovereign Genesis: ${concept.substring(0, 30)}${concept.length > 30 ? "..." : ""}`
        });
      } else {
        throw new Error("Generated SVG file was not found.");
      }
    } catch (fsErr: any) {
      console.error("[NEXUS ERROR] Failed to read generated SVG file:", fsErr);
      return res.json({
        success: false,
        error: fsErr.message || "Output asset could not be recovered.",
        logs: [...logs, `[ERROR] Output asset read failure: ${fsErr.message}`]
      });
    }
  });
});

export default router;
