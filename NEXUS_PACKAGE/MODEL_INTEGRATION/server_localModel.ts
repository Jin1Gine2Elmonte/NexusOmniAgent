import express from "express";
import path from "path";
import fs from "fs";
import { spawn, ChildProcess, execSync } from "child_process";
import https from "https";

const router = express.Router();
const LOCAL_MODELS_DIR = path.join(process.cwd(), "local_models");

// URLs
const BINARY_URL = "https://github.com/ggerganov/llama.cpp/releases/download/b4594/llama-b4594-bin-ubuntu-x64.zip";
const MODEL_URL = "https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct-GGUF/resolve/main/qwen2.5-0.5b-instruct-q4_k_m.gguf";

// Local file paths
const ZIP_PATH = path.join(LOCAL_MODELS_DIR, "llama-bin.zip");
const LLAMA_SERVER_PATH = path.join(LOCAL_MODELS_DIR, "llama-server");
const MODEL_PATH = path.join(LOCAL_MODELS_DIR, "qwen2.5-0.5b-instruct-q4_k_m.gguf");

interface Progress {
  loaded: number;
  total: number;
}

interface LocalModelStatus {
  status: "idle" | "downloading" | "ready" | "running" | "failed";
  progress: {
    binary: Progress;
    model: Progress;
    overallPercentage: number;
  };
  error?: string;
  modelName: string;
}

let status: LocalModelStatus = {
  status: "idle",
  progress: {
    binary: { loaded: 0, total: 0 },
    model: { loaded: 0, total: 0 },
    overallPercentage: 0
  },
  modelName: "Qwen 2.5 0.5B Instruct (GGUF)"
};

let serverProcess: ChildProcess | null = null;

// Helper to calculate total progress
function updateOverallPercentage() {
  const bTotal = status.progress.binary.total || 25396869; // default zip size
  const mTotal = status.progress.model.total || 491400032; // default gguf size
  const totalExpected = bTotal + mTotal;
  const currentLoaded = status.progress.binary.loaded + status.progress.model.loaded;
  status.progress.overallPercentage = Math.round((currentLoaded / totalExpected) * 100);
}

// Download function with redirect handling
function downloadFile(url: string, destPath: string, progressType: "binary" | "model"): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    
    function makeRequest(requestUrl: string) {
      https.get(requestUrl, (response) => {
        if (response.statusCode === 301 || response.statusCode === 302) {
          const redirectUrl = response.headers.location;
          if (redirectUrl) {
            makeRequest(redirectUrl);
            return;
          }
        }

        if (response.statusCode !== 200) {
          reject(new Error(`Server responded with status: ${response.statusCode} for ${url}`));
          return;
        }

        const totalBytes = parseInt(response.headers["content-length"] || "0", 10);
        status.progress[progressType].total = totalBytes;
        let receivedBytes = 0;

        response.on("data", (chunk) => {
          receivedBytes += chunk.length;
          status.progress[progressType].loaded = receivedBytes;
          updateOverallPercentage();
        });

        response.pipe(file);

        file.on("finish", () => {
          file.close();
          resolve();
        });
      }).on("error", (err) => {
        fs.unlink(destPath, () => {});
        reject(err);
      });
    }

    makeRequest(url);
  });
}

// Unzip helper using command line unzip
function unzipBinary(): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      execSync(`unzip -o "${ZIP_PATH}" -d "${LOCAL_MODELS_DIR}"`);
      // Find where llama-server is. In llama.cpp zip, it could be in the root or bin directory.
      const files = fs.readdirSync(LOCAL_MODELS_DIR);
      console.log("Files in local_models folder after unzip:", files);
      
      // Let's find llama-server
      let foundServer = false;
      const possiblePaths = [
        path.join(LOCAL_MODELS_DIR, "llama-server"),
        path.join(LOCAL_MODELS_DIR, "bin", "llama-server"),
        path.join(LOCAL_MODELS_DIR, "build", "bin", "llama-server")
      ];

      for (const p of possiblePaths) {
        if (fs.existsSync(p)) {
          fs.copyFileSync(p, LLAMA_SERVER_PATH);
          fs.chmodSync(LLAMA_SERVER_PATH, "755");
          foundServer = true;
          break;
        }
      }

      if (!foundServer) {
        // Try searching recursively
        const findAndCopy = (dir: string) => {
          const list = fs.readdirSync(dir);
          for (const file of list) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
              findAndCopy(filePath);
            } else if (file === "llama-server") {
              fs.copyFileSync(filePath, LLAMA_SERVER_PATH);
              fs.chmodSync(LLAMA_SERVER_PATH, "755");
              foundServer = true;
            } else if (file.endsWith(".so")) {
              fs.copyFileSync(filePath, path.join(LOCAL_MODELS_DIR, file));
            }
          }
        };
        findAndCopy(LOCAL_MODELS_DIR);
      } else {
        // Also copy any .so files from build/bin or subdirectories
        const copyLibs = (dir: string) => {
          if (!fs.existsSync(dir)) return;
          const list = fs.readdirSync(dir);
          for (const file of list) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
              copyLibs(filePath);
            } else if (file.endsWith(".so")) {
              fs.copyFileSync(filePath, path.join(LOCAL_MODELS_DIR, file));
            }
          }
        };
        copyLibs(LOCAL_MODELS_DIR);
      }

      if (foundServer) {
        // Cleanup ZIP and extracted extra files to save disk space
        try {
          fs.unlinkSync(ZIP_PATH);
        } catch (e) {}
        resolve();
      } else {
        reject(new Error("llama-server binary was not found inside the zip."));
      }
    } catch (err) {
      reject(err);
    }
  });
}

// Start llama-server background daemon
export function startLocalServer() {
  if (serverProcess) {
    console.log(">> [LOCAL MODEL]: llama-server is already running.");
    status.status = "running";
    return;
  }

  if (!fs.existsSync(LLAMA_SERVER_PATH) || !fs.existsSync(MODEL_PATH)) {
    console.log(">> [LOCAL MODEL]: Files missing. Cannot start server yet.");
    status.status = "idle";
    return;
  }

  console.log(">> [LOCAL MODEL]: Spawning llama-server background daemon on port 3001...");
  try {
    status.status = "running";
    const binDir = path.join(LOCAL_MODELS_DIR, "build", "bin");
    const ldPath = `${LOCAL_MODELS_DIR}:${binDir}:${process.env.LD_LIBRARY_PATH || ''}`;
    serverProcess = spawn(LLAMA_SERVER_PATH, [
      "-m", MODEL_PATH,
      "-c", "2048",
      "--port", "3001",
      "--host", "127.0.0.1",
      "-t", "4",
      "--log-disable"
    ], {
      env: {
        ...process.env,
        LD_LIBRARY_PATH: ldPath
      }
    });

    serverProcess.stdout?.on("data", (data) => {
      console.log(`[llama-server]: ${data}`);
    });

    serverProcess.stderr?.on("data", (data) => {
      console.warn(`[llama-server-error]: ${data}`);
    });

    serverProcess.on("error", (err) => {
      console.error(">> [LOCAL MODEL]: llama-server process error:", err);
      serverProcess = null;
      status.status = "failed";
      status.error = err?.message || "Process error";
    });

    serverProcess.on("close", (code) => {
      console.log(`>> [LOCAL MODEL]: llama-server exited with code ${code}`);
      serverProcess = null;
      status.status = "ready";
    });
  } catch (err: any) {
    console.error(">> [LOCAL MODEL]: Failed to spawn llama-server:", err);
    status.status = "failed";
    status.error = err?.message || "Process spawn failure";
  }
}

// Stop local server helper
export function stopLocalServer() {
  if (serverProcess) {
    console.log(">> [LOCAL MODEL]: Terminating llama-server process...");
    serverProcess.kill();
    serverProcess = null;
    status.status = "ready";
  }
}

// Trigger automatic model initialization if downloaded
export function checkAndAutoStart() {
  if (fs.existsSync(LLAMA_SERVER_PATH) && fs.existsSync(MODEL_PATH)) {
    status.status = "ready";
    startLocalServer();
  } else {
    status.status = "idle";
  }
}

// Routes
router.get("/status", (req, res) => {
  // Update status dynamically based on file presence
  if (status.status !== "downloading" && status.status !== "failed") {
    if (fs.existsSync(LLAMA_SERVER_PATH) && fs.existsSync(MODEL_PATH)) {
      status.status = serverProcess ? "running" : "ready";
    } else {
      status.status = "idle";
    }
  }
  res.json(status);
});

router.post("/download", async (req, res) => {
  if (status.status === "downloading") {
    return res.json({ message: "Download is already in progress.", status });
  }

  status.status = "downloading";
  status.error = undefined;
  status.progress = {
    binary: { loaded: 0, total: 0 },
    model: { loaded: 0, total: 0 },
    overallPercentage: 0
  };

  if (!fs.existsSync(LOCAL_MODELS_DIR)) {
    fs.mkdirSync(LOCAL_MODELS_DIR, { recursive: true });
  }

  res.json({ message: "Download started successfully in background.", status });

  // Run the background downloader
  (async () => {
    try {
      console.log(">> [LOCAL MODEL DOWNLOADER]: Starting download of llama.cpp binary zip...");
      await downloadFile(BINARY_URL, ZIP_PATH, "binary");
      console.log(">> [LOCAL MODEL DOWNLOADER]: Binary zip downloaded. Unzipping...");
      await unzipBinary();
      console.log(">> [LOCAL MODEL DOWNLOADER]: llama.cpp binary unzipped successfully.");

      console.log(">> [LOCAL MODEL DOWNLOADER]: Starting download of Qwen 0.5B GGUF model...");
      await downloadFile(MODEL_URL, MODEL_PATH, "model");
      console.log(">> [LOCAL MODEL DOWNLOADER]: GGUF model downloaded successfully!");

      status.status = "ready";
      console.log(">> [LOCAL MODEL DOWNLOADER]: Engine and model fully provisioned! Booting...");
      startLocalServer();
    } catch (err: any) {
      console.error(">> [LOCAL MODEL DOWNLOADER ERROR]:", err);
      status.status = "failed";
      status.error = err?.message || "Failed to download local engine assets.";
    }
  })();
});

router.post("/chat", async (req, res) => {
  const { messages, temperature } = req.body;

  if (status.status !== "running" || !serverProcess) {
    // If not running, try to boot it on demand
    if (fs.existsSync(LLAMA_SERVER_PATH) && fs.existsSync(MODEL_PATH)) {
      startLocalServer();
      // Wait a moment for server to bind
      await new Promise(r => setTimeout(r, 1500));
    } else {
      return res.status(503).json({
        error: "Local engine is not downloaded or running. Please initialize it in System Config."
      });
    }
  }

  try {
    const response = await fetch("http://127.0.0.1:3001/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "qwen2.5-0.5b-instruct",
        messages,
        temperature: temperature || 0.3,
        stream: false
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`llama-server responded with status ${response.status}: ${errText}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (err: any) {
    console.error(">> [LOCAL CHAT ERROR]:", err);
    res.status(500).json({ error: err?.message || "Failed to communicate with local llama-server." });
  }
});

export default router;
