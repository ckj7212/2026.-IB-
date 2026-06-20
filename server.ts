import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { getPortalStateFromFirestore, savePortalStateToFirestore } from "./src/server_firebase.js";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Set large JSON payload body limits to support rich base64 uploads (PDFs, inline videos, images) safely
  app.use(express.json({ limit: "150mb" }));
  app.use(express.urlencoded({ limit: "150mb", extended: true }));

  // Path to save/retrieve user customizations in the workspace
  const STATE_FILE_PATH = path.join(process.cwd(), "src", "default_saved_state.json");

  // API endpoint to retrieve the currently persisted server state
  app.get("/api/state", async (req, res) => {
    // Prevent mobile browsers (iOS/Android/Safari/Chrome) from aggressively caching state GET requests
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    try {
      // 1. Try reading from Firestore first
      const firestoreState = await getPortalStateFromFirestore();
      if (firestoreState) {
        return res.json(firestoreState);
      }

      // 2. If Firestore is empty/fresh or not initialized, fallback to reading the local JSON file
      console.log("Firestore state empty. Loading default state file fallback...");
      if (fs.existsSync(STATE_FILE_PATH)) {
        const fileContent = fs.readFileSync(STATE_FILE_PATH, "utf-8");
        const localState = JSON.parse(fileContent);

        // Auto-seed Firestore on the first run so that we populate the database!
        try {
          await savePortalStateToFirestore(localState);
          console.log("Successfully auto-seeded original local state into Cloud Firestore.");
        } catch (seedErr) {
          console.warn("Could not auto-seed local state to Firestore:", seedErr);
        }

        return res.json(localState);
      }
      return res.json(null);
    } catch (err) {
      console.error("Failed to read server state:", err);
      return res.status(500).json({ error: "Failed to read server state" });
    }
  });

  // API endpoint to save state modifications permanently in the codebase and Cloud Firestore
  app.post("/api/state", async (req, res) => {
    try {
      const newState = req.body;
      if (!newState || Object.keys(newState).length === 0) {
        return res.status(400).json({ error: "No state data provided" });
      }

      // 1. Save to Cloud Firestore first
      let firebaseSaved = false;
      try {
        firebaseSaved = await savePortalStateToFirestore(newState);
      } catch (fbErr) {
        console.error("Failed to save to Firestore:", fbErr);
      }

      // 2. Always write to the local file configuration as an extra redundant backup
      try {
        fs.writeFileSync(STATE_FILE_PATH, JSON.stringify(newState, null, 2), "utf-8");
        console.log("Successfully persisted updated AppState to local fallback file.");
      } catch (fsErr) {
        console.warn("Failed to write to local fallback file:", fsErr);
      }

      return res.json({ success: true, firebaseSaved });
    } catch (err) {
      console.error("Failed to save server state:", err);
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
