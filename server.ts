import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { getPortalStateFromFirestore, savePortalStateToFirestore } from "./src/server_firebase.js";
import { defaultData } from "./src/defaultData.js";

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

      // 2. If Firestore is empty/fresh or not initialized, load either local file backup or defaultData
      console.log("Firestore state empty. Bootstrapping state...");
      let bootstrapState = defaultData;

      if (fs.existsSync(STATE_FILE_PATH)) {
        try {
          const fileContent = fs.readFileSync(STATE_FILE_PATH, "utf-8");
          const parsed = JSON.parse(fileContent);
          if (parsed && parsed.config && parsed.basicInfo) {
            bootstrapState = parsed;
            console.log("Loaded bootstrap state from local JSON backup file.");
          }
        } catch (readErr) {
          console.warn("Failed to read local STATE_FILE_PATH backup, using defaultData:", readErr);
        }
      } else {
        console.log("No local JSON backup file exists. Bootstrapping with compiled defaultData.");
      }

      // Auto-seed Firestore so we populate the database!
      try {
        await savePortalStateToFirestore(bootstrapState);
        console.log("Successfully auto-seeded original bootstrap state into Cloud Firestore.");
      } catch (seedErr) {
        console.warn("Could not auto-seed bootstrap state to Firestore:", seedErr);
      }

      return res.json(bootstrapState);
    } catch (err) {
      console.error("Failed to read server state:", err);
      // Fallback return defaultData directly to avoid breaking client-side lifecycle even on total error
      return res.json(defaultData);
    }
  });

  // API endpoint to download standard JSON backup file directly from server (avoids data: URI iframe blocks)
  app.get("/api/backup-download", async (req, res) => {
    try {
      let stateToDownload = defaultData;
      const firestoreState = await getPortalStateFromFirestore();
      if (firestoreState) {
        stateToDownload = firestoreState;
      } else if (fs.existsSync(STATE_FILE_PATH)) {
        try {
          const fileContent = fs.readFileSync(STATE_FILE_PATH, "utf-8");
          stateToDownload = JSON.parse(fileContent);
        } catch (readErr) {
          console.warn("Failed to read local fallback backup file:", readErr);
        }
      }
      
      res.setHeader("Content-Disposition", `attachment; filename="bitgaram_pyp_portal_backup_${new Date().toISOString().substring(0,10)}.json"`);
      res.setHeader("Content-Type", "application/json");
      return res.json(stateToDownload);
    } catch (err) {
      console.error("Backup download API errored:", err);
      res.status(500).json({ error: "Failed to assemble backup file download" });
    }
  });

  // API endpoint to upload a JSON backup file and apply it server-side (propagating to all connected endpoints)
  app.post("/api/backup-upload", async (req, res) => {
    try {
      const parsed = req.body;
      if (!parsed || !parsed.config || !parsed.basicInfo) {
        return res.status(400).json({ error: "Invalid backup file schema structure" });
      }

      parsed.updatedAt = Date.now();

      // 1. Save to Firestore
      let firebaseSaved = false;
      try {
        firebaseSaved = await savePortalStateToFirestore(parsed);
      } catch (fbErr) {
        console.error("Failed to save uploaded backup state to Firestore:", fbErr);
      }

      // 2. Save locally
      try {
        fs.writeFileSync(STATE_FILE_PATH, JSON.stringify(parsed, null, 2), "utf-8");
      } catch (fsErr) {
        console.warn("Failed to write uploaded backup state locally:", fsErr);
      }

      return res.json({ success: true, firebaseSaved, state: parsed });
    } catch (err) {
      console.error("Backup upload API errored:", err);
      return res.status(500).json({ error: "Failed to apply uploaded backup" });
    }
  });

  // API endpoint to compile and lock current preview state into the permanent source files (src/defaultData.ts and STATE_FILE_PATH)
  app.post("/api/commit-to-codebase", async (req, res) => {
    try {
      const stateToCommit = req.body;
      if (!stateToCommit || !stateToCommit.config || !stateToCommit.basicInfo) {
        return res.status(400).json({ error: "No state data provided for commit" });
      }

      // Update the timestamp
      stateToCommit.updatedAt = Date.now();

      const DEFAULT_DATA_PATH = path.join(process.cwd(), "src", "defaultData.ts");

      // 1. Write to defaultData.ts (Typescript File)
      try {
        // Prepare TypeScript string representation
        const tsContent = `// Automatically committed version on ${new Date().toLocaleString('ko-KR')}\nimport { AppState } from "./types";\n\nexport const defaultData: AppState = ${JSON.stringify(stateToCommit, null, 2)};\n`;
        fs.writeFileSync(DEFAULT_DATA_PATH, tsContent, "utf-8");
        console.log(`[COMMIT] Successfully overwrote ${DEFAULT_DATA_PATH} with current preview state.`);
      } catch (tsErr) {
        console.error("Failed to overwrite src/defaultData.ts file:", tsErr);
        return res.status(500).json({ error: "Failed to write onto src/defaultData.ts" });
      }

      // 2. Write to local fallback default_saved_state.json
      try {
        fs.writeFileSync(STATE_FILE_PATH, JSON.stringify(stateToCommit, null, 2), "utf-8");
        console.log(`[COMMIT] Successfully overwrote ${STATE_FILE_PATH}`);
      } catch (jsonErr) {
        console.warn("Failed to overwrite default_saved_state.json:", jsonErr);
      }

      // 3. Keep Firestore in sync
      let firebaseSaved = false;
      try {
        firebaseSaved = await savePortalStateToFirestore(stateToCommit);
        console.log("[COMMIT] Firestore synchronized with committed codebase state.");
      } catch (fbErr) {
        console.error("Failed to save committed state to Firestore:", fbErr);
      }

      return res.json({ success: true, firebaseSaved, message: "Successfully committed preview state directly into physical source code!" });
    } catch (err) {
      console.error("Failed to commit state to codebase:", err);
      return res.status(500).json({ error: "Server error during codebase commit" });
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
