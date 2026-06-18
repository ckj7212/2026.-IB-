import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Set large JSON payload body limits to support rich base64 uploads (PDFs, inline videos, images) safely
  app.use(express.json({ limit: "150mb" }));
  app.use(express.urlencoded({ limit: "150mb", extended: true }));

  // Path to save/retrieve user customizations in the workspace
  const STATE_FILE_PATH = path.join(process.cwd(), "src", "default_saved_state.json");

  // API endpoint to retrieve the currently persisted server state
  app.get("/api/state", (req, res) => {
    try {
      if (fs.existsSync(STATE_FILE_PATH)) {
        const fileContent = fs.readFileSync(STATE_FILE_PATH, "utf-8");
        return res.json(JSON.parse(fileContent));
      }
      return res.json(null);
    } catch (err) {
      console.error("Failed to read server state file:", err);
      return res.status(500).json({ error: "Failed to read server state" });
    }
  });

  // API endpoint to save state modifications permanently in the codebase
  app.post("/api/state", (req, res) => {
    try {
      const newState = req.body;
      if (!newState || Object.keys(newState).length === 0) {
        return res.status(400).json({ error: "No state data provided" });
      }
      fs.writeFileSync(STATE_FILE_PATH, JSON.stringify(newState, null, 2), "utf-8");
      console.log("Successfully persisted updated AppState to:", STATE_FILE_PATH);
      return res.json({ success: true });
    } catch (err) {
      console.error("Failed to write server state file:", err);
      return res.status(500).json({ error: "Failed to save server state" });
    }
  });

  // Setup Vite development middleware OR serve built static assets depending on active NODE_ENV
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server successfully booted and listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
