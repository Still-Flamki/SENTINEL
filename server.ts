import express from "express";
import { createServer as createViteServer } from "vite";
import { WebSocketServer, WebSocket } from "ws";
import http from "http";
import { v4 as uuidv4 } from "uuid";

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const wss = new WebSocketServer({ server });
  const PORT = 3000;

  app.use(express.json());

  // --- Transaction Simulation Engine ---
  const clients = new Set<WebSocket>();
  wss.on("connection", (ws) => {
    clients.add(ws);
    ws.on("close", () => clients.delete(ws));
  });

  // Mock data generation logic
  const merchants = ["Amazon", "Uber", "Starbucks", "Apple", "Netflix", "Shell", "Walmart", "Target"];
  const countries = ["US", "GB", "IN", "DE", "FR", "CA", "SG", "NG"];

  setInterval(() => {
    if (clients.size === 0) return;

    const isSuspicious = Math.random() > 0.9;
    const amount = isSuspicious ? Math.random() * 5000 : Math.random() * 100;
    
    const transaction = {
      id: `TXN-${uuidv4().slice(0, 8).toUpperCase()}`,
      accountId: "ACC-001", // Default for demo
      date: new Date().toISOString(),
      amount: parseFloat(amount.toFixed(2)),
      currency: "USD",
      merchant: merchants[Math.floor(Math.random() * merchants.length)],
      category: "Shopping",
      location: {
        city: "New York",
        country: countries[Math.floor(Math.random() * countries.length)],
        lat: 40.7128,
        lng: -74.0060
      },
      riskScore: isSuspicious ? Math.floor(Math.random() * 60) + 40 : Math.floor(Math.random() * 20),
      status: isSuspicious ? "REVIEW" : "SAFE",
      riskLevel: isSuspicious ? "HIGH" : "LOW",
      flagReasons: isSuspicious ? ["Unusual Amount", "New Location"] : []
    };

    const message = JSON.stringify({ type: "NEW_TRANSACTION", data: transaction });
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }, 2000);

  // --- API Routes ---
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Proxy AI analysis (Mocked for now, will integrate Gemini later)
  app.post("/api/analyze", (req, res) => {
    const { transaction } = req.body;
    // Simulate SSE stream
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const agents = ['velocity', 'geo', 'behavior', 'pattern'];
    let count = 0;

    const interval = setInterval(() => {
      if (count >= agents.length) {
        res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
        clearInterval(interval);
        res.end();
        return;
      }

      const agent = agents[count];
      const result = {
        agent,
        riskScore: Math.floor(Math.random() * 100),
        confidence: 0.8 + Math.random() * 0.2,
        verdict: Math.random() > 0.5 ? 'HIGH' : 'LOW',
        headline: `${agent.toUpperCase()} Analysis Complete`,
        reasoning: `Detected unusual patterns in ${agent} data.`,
        flags: [`${agent}_anomaly`]
      };

      res.write(`data: ${JSON.stringify({ type: 'agent_result', data: result })}\n\n`);
      count++;
    }, 800);
  });

  // --- Vite Integration ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`SENTINEL Engine running on http://localhost:${PORT}`);
  });
}

startServer();
