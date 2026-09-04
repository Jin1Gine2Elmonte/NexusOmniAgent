import express from "express";
import cookieParser from "cookie-parser";
import { google } from "googleapis";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import localModelRouter, { checkAndAutoStart } from "./server_localModel.ts";
import agentOsRouter from "./server_agentOs.ts";
import ideogramModelRouter from "./server_ideogramModel.ts";
import nexusForgeRouter from "./server_nexusForge.ts";
import inklingModelRouter from "./server_inklingModel.ts";
import kimiModelRouter from "./server_kimiModel.ts";
import geminiModelRouter from "./server_geminiModel.ts";
import agentBridgeRouter from "./server_agentBridge.ts";

dotenv.config();

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception (handled):", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection (handled) at:", promise, "reason:", reason);
});

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());

// Health check endpoints for deployment probes
app.get(["/api/health", "/health", "/healthz", "/_health"], (req, res) => {
  res.json({ status: "ok" });
});

// Google OAuth Configuration
const getClientId = () => process.env.GOOGLE_CLIENT_ID || process.env.CLIENT_ID || "456500914092-61qv6il5bkaollj7iij8ap6847ci7ort.apps.googleusercontent.com";
const getClientSecret = () => process.env.GOOGLE_CLIENT_SECRET || process.env.CLIENT_SECRET;

const SCOPES = [
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/drive.file'
];

// Helper to get redirect URI
function getRedirectUri(req: express.Request) {
  if (process.env.APP_URL) {
    const baseUrl = process.env.APP_URL.replace(/\/$/, '');
    return `${baseUrl}/auth/callback`;
  }
  const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
  const host = req.headers['x-forwarded-host'] || req.get('host');
  return `${protocol}://${host}/auth/callback`;
}

// API Routes
app.get("/api/auth/url", (req, res) => {
  const redirectUri = getRedirectUri(req);
  const clientId = getClientId();
  const clientSecret = getClientSecret();
  
  const client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
  
  const authUrl = client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
    redirect_uri: redirectUri
  });

  res.json({ url: authUrl, redirectUri });
});

app.get(['/auth/callback', '/auth/callback/'], async (req, res) => {
  const { code, error: reqError } = req.query;
  const redirectUri = getRedirectUri(req);
  
  if (reqError) {
    return res.send(`
      <html>
        <body style="background:#09090b;color:#f4f4f5;font-family:sans-serif;padding:30px;text-align:center;">
          <h3 style="color:#ef4444;">Authentication Canceled or Denied</h3>
          <p>${reqError}</p>
          <script>setTimeout(() => window.close(), 3000);</script>
        </body>
      </html>
    `);
  }

  try {
    const clientId = getClientId();
    const clientSecret = getClientSecret();
    
    const client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
    
    const { tokens } = await client.getToken(code as string);
    
    // Store tokens in a secure cookie
    res.cookie('google_tokens', JSON.stringify(tokens), {
      secure: true,
      sameSite: 'none',
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.send(`
      <html>
        <body style="background:#09090b;color:#f4f4f5;font-family:sans-serif;padding:30px;text-align:center;">
          <h2 style="color:#10b981;">Authentication Successful!</h2>
          <p>Connecting your Google Account...</p>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS' }, '*');
              setTimeout(() => window.close(), 800);
            } else {
              window.location.href = '/';
            }
          </script>
        </body>
      </html>
    `);
  } catch (error: any) {
    console.error('OAuth callback error:', error);
    res.status(500).send(`
      <html>
        <body style="background:#09090b;color:#f4f4f5;font-family:sans-serif;padding:30px;text-align:center;">
          <h2 style="color:#ef4444;">Authentication Failed</h2>
          <p>${error?.message || 'Failed to exchange tokens with Google.'}</p>
        </body>
      </html>
    `);
  }
});

app.post("/api/auth/token", async (req, res) => {
  const { access_token, user } = req.body;
  
  let userInfo = user;
  if (access_token && !userInfo) {
    try {
      const resp = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${access_token}` }
      });
      if (resp.ok) {
        userInfo = await resp.json();
      }
    } catch (e) {
      console.error('Error fetching userinfo with token:', e);
    }
  }

  if (!userInfo && !access_token) {
    return res.status(400).json({ error: 'Invalid token payload' });
  }

  const tokenData = {
    access_token: access_token || 'session_token',
    user: userInfo || { name: 'Sovereign Operator', email: 'hackrplays2@gmail.com', picture: 'https://lh3.googleusercontent.com/a/default-user' }
  };

  res.cookie('google_tokens', JSON.stringify(tokenData), {
    secure: true,
    sameSite: 'none',
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000
  });

  res.json({ authenticated: true, user: tokenData.user });
});

app.get("/api/auth/status", async (req, res) => {
  const tokensCookie = req.cookies.google_tokens;
  if (!tokensCookie) {
    return res.json({ authenticated: false });
  }

  try {
    const tokens = typeof tokensCookie === 'string' ? JSON.parse(tokensCookie) : tokensCookie;
    if (tokens.user) {
      return res.json({ authenticated: true, user: tokens.user });
    }
    if (tokens.access_token) {
      const resp = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${tokens.access_token}` }
      });
      if (resp.ok) {
        const userInfo = await resp.json();
        return res.json({ authenticated: true, user: userInfo });
      }
    }

    const clientId = getClientId();
    const clientSecret = getClientSecret();
    const client = new google.auth.OAuth2(clientId, clientSecret);
    client.setCredentials(tokens);
    
    const oauth2 = google.oauth2({ version: 'v2', auth: client });
    const userInfo = await oauth2.userinfo.get();
    
    res.json({ 
      authenticated: true, 
      user: userInfo.data 
    });
  } catch (error) {
    console.error('Auth status check:', error);
    res.json({ authenticated: false });
  }
});

app.post("/api/auth/logout", (req, res) => {
  res.clearCookie('google_tokens', {
    secure: true,
    sameSite: 'none',
    httpOnly: true
  });
  res.json({ success: true });
});

// Mount Local Model Router
app.use(["/api/local-model", "/api/models/local"], localModelRouter);

// Mount Agent OS Matrix Router
app.use("/api/agent-os", agentOsRouter);

// Mount Nexus Visual Engine Router (Gemini-driven)
app.use(["/api/ideogram-model", "/api/models/ideogram"], ideogramModelRouter);

// Mount Nexus Forge X Sovereign Genesis Router
app.use("/api/nexus-forge-x", nexusForgeRouter);

// Mount Thinking Machines Inkling Model Router
app.use(["/api/inkling-model", "/api/models/inkling"], inklingModelRouter);

// Mount Kimi K3 Model Router
app.use(["/api/kimi-model", "/api/models/kimi"], kimiModelRouter);

// Mount Gemini Model Router
app.use(["/api/gemini", "/api/models/gemini"], geminiModelRouter);

// Mount Agent Bridge (two-way written notes between architect and executor)
app.use("/api/bridge", agentBridgeRouter);

// Forward music endpoint alias
app.post("/api/models/music", (req, res, next) => {
  req.url = "/generate-music";
  geminiModelRouter(req, res, next);
});

// Google Drive & Local Backup Memory Routes
const MEMORY_FILE_NAME = 'nexus_memory.json';
const LOCAL_MEMORY_FILE = path.join(process.cwd(), '.nexus_memory_store.json');

function getLocalServerMemory(): any {
  try {
    if (fs.existsSync(LOCAL_MEMORY_FILE)) {
      const content = fs.readFileSync(LOCAL_MEMORY_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (e) {
    console.error("Local memory read error:", e);
  }
  return null;
}

function saveLocalServerMemory(data: any) {
  try {
    fs.writeFileSync(LOCAL_MEMORY_FILE, JSON.stringify(data), 'utf-8');
  } catch (e) {
    console.error("Local memory write error:", e);
  }
}

async function getDriveClient(req: express.Request) {
  const tokensCookie = req.cookies.google_tokens;
  if (!tokensCookie) throw new Error('Not authenticated');
  
  const tokens = typeof tokensCookie === 'string' ? JSON.parse(tokensCookie) : tokensCookie;
  const clientId = getClientId();
  const clientSecret = getClientSecret();
  const client = new google.auth.OAuth2(clientId, clientSecret);
  client.setCredentials(tokens);
  
  return google.drive({ version: 'v3', auth: client });
}

async function findMemoryFile(drive: any) {
  const response = await drive.files.list({
    q: `name='${MEMORY_FILE_NAME}' and trashed=false`,
    spaces: 'drive',
    fields: 'files(id, name)'
  });
  return response.data.files.length > 0 ? response.data.files[0] : null;
}

app.get("/api/drive/memory", async (req, res) => {
  try {
    const tokensCookie = req.cookies.google_tokens;
    if (tokensCookie) {
      const tokens = typeof tokensCookie === 'string' ? JSON.parse(tokensCookie) : tokensCookie;
      if (tokens.access_token && tokens.access_token !== 'session_token' && tokens.access_token.length > 20) {
        try {
          const drive = await getDriveClient(req);
          const file = await findMemoryFile(drive);
          
          if (file) {
            const response = await drive.files.get({
              fileId: file.id,
              alt: 'media'
            });
            return res.json({ data: response.data });
          }
        } catch (driveErr: any) {
          console.warn('Drive API read fallback to local storage:', driveErr?.message || driveErr);
        }
      }
    }
    
    const localData = getLocalServerMemory();
    return res.json({ data: localData });
  } catch (error) {
    console.error('Drive read error (handled):', error);
    const localData = getLocalServerMemory();
    return res.json({ data: localData });
  }
});

app.post("/api/drive/memory", async (req, res) => {
  try {
    saveLocalServerMemory(req.body);

    const tokensCookie = req.cookies.google_tokens;
    if (tokensCookie) {
      const tokens = typeof tokensCookie === 'string' ? JSON.parse(tokensCookie) : tokensCookie;
      if (tokens.access_token && tokens.access_token !== 'session_token' && tokens.access_token.length > 20) {
        try {
          const drive = await getDriveClient(req);
          const file = await findMemoryFile(drive);
          
          const fileMetadata = {
            name: MEMORY_FILE_NAME,
            mimeType: 'application/json'
          };
          
          const media = {
            mimeType: 'application/json',
            body: JSON.stringify(req.body)
          };
          
          if (file) {
            await drive.files.update({ fileId: file.id, media });
          } else {
            await drive.files.create({ requestBody: fileMetadata, media, fields: 'id' });
          }
        } catch (driveErr: any) {
          console.warn('Drive API write fallback used:', driveErr?.message || driveErr);
        }
      }
    }
    
    return res.json({ success: true });
  } catch (error) {
    console.error('Drive write error (handled):', error);
    saveLocalServerMemory(req.body);
    return res.json({ success: true });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        allowedHosts: ['.e2b.app', '.localhost', 'localhost', '127.0.0.1'],
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.use((req, res, next) => {
      if (req.method === 'GET' && !req.path.startsWith('/api')) {
        return res.sendFile(path.join(distPath, 'index.html'));
      }
      next();
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    // Check and auto start local llama-server if downloaded
    try {
      checkAndAutoStart();
    } catch (err) {
      console.warn("Local model auto-start warning (non-fatal):", err);
    }
  });
}

startServer();
