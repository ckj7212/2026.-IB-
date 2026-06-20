import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  getDocs, 
  collection, 
  deleteDoc,
  writeBatch
} from "firebase/firestore";
import fs from "fs";
import path from "path";

// Lazily get Firestore database connection
let dbInstance: any = null;
let isConfigured = false;

function getFirestoreDb() {
  if (dbInstance) return dbInstance;

  try {
    const configPath = path.join(process.cwd(), "firebase-applet-config.json");
    if (!fs.existsSync(configPath)) {
      console.warn("firebase-applet-config.json not found. Firestore persistence is disabled.");
      return null;
    }

    const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    if (!config.apiKey || !config.projectId) {
      console.warn("Invalid Firebase config. Missing apiKey or projectId.");
      return null;
    }

    const app = getApps().length === 0 ? initializeApp(config) : getApp();
    dbInstance = getFirestore(app, config.firestoreDatabaseId || config.projectId);
    isConfigured = true;
    console.log("Firestore successfully initialized server-side.");
    return dbInstance;
  } catch (err) {
    console.error("Failed to lazily initialize Firestore:", err);
    return null;
  }
}

// Reconstruct whole AppState by fetching individual records concurrently
export async function getPortalStateFromFirestore(): Promise<any> {
  const db = getFirestoreDb();
  if (!db || !isConfigured) {
    return null;
  }

  try {
    console.log("Fetching AppState from Cloud Firestore...");

    const [
      metaDoc,
      reportsSnap,
      tasksSnap,
      lessonsSnap,
      gallerySnap,
      communitySnap
    ] = await Promise.all([
      getDoc(doc(db, "system", "portal_metadata")),
      getDocs(collection(db, "reports")),
      getDocs(collection(db, "researchTasks")),
      getDocs(collection(db, "lessons")),
      getDocs(collection(db, "gallery")),
      getDocs(collection(db, "community"))
    ]);

    if (!metaDoc.exists()) {
      console.log("No metadata document found in Firestore. Database is empty/fresh.");
      return null;
    }

    const metaData = metaDoc.data();
    const reports: any[] = [];
    const researchTasks: any[] = [];
    const lessons: any[] = [];
    const gallery: any[] = [];
    const community: any[] = [];

    reportsSnap.forEach(doc => reports.push(doc.data()));
    tasksSnap.forEach(doc => researchTasks.push(doc.data()));
    lessonsSnap.forEach(doc => lessons.push(doc.data()));
    gallerySnap.forEach(doc => gallery.push(doc.data()));
    communitySnap.forEach(doc => community.push(doc.data()));

    // Sort items if they have custom tracking/indexes or fallback order
    // Typically, standard sort is based on date or default index tracking
    // But we preserve the IDs or timestamps
    const sortedReports = reports.sort((a, b) => (b.uploadDate || "").localeCompare(a.uploadDate || ""));
    const sortedTasks = researchTasks.sort((a, b) => {
      // Sort by theme number then task code
      if (a.themeNum !== b.themeNum) return a.themeNum - b.themeNum;
      return (a.taskCode || "").localeCompare(b.taskCode || "");
    });
    const sortedLessons = lessons.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    const sortedGallery = gallery.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    
    // Sort community by date or id descending
    const sortedCommunity = community.sort((a, b) => (b.date || "").localeCompare(a.date || ""));

    console.log(`Successfully merged state from Firestore: ${reports.length} reports, ${researchTasks.length} researchTasks, ${lessons.length} lessons, ${gallery.length} gallery items, ${community.length} posts.`);

    return {
      config: metaData.config || {},
      basicInfo: metaData.basicInfo || {},
      infographic: metaData.infographic || { title: "", steps: [] },
      outcomes: metaData.outcomes || { quantitative: [], qualitative: [] },
      footer: metaData.footer || {},
      reports: sortedReports,
      researchTasks: sortedTasks,
      lessons: sortedLessons,
      gallery: sortedGallery,
      community: sortedCommunity,
      updatedAt: metaData.updatedAt || Date.now()
    };
  } catch (err) {
    console.error("Firestore error while reading portal state:", err);
    return null;
  }
}

// Compare and save each branch dynamically in Firestore with cleanup deletions
export async function savePortalStateToFirestore(state: any): Promise<boolean> {
  const db = getFirestoreDb();
  if (!db || !isConfigured) {
    return false;
  }

  try {
    console.log("Saving AppState modifications dynamically to Cloud Firestore...");

    // 1. Save general portal metadata document
    const generalDocRef = doc(db, "system", "portal_metadata");
    await setDoc(generalDocRef, {
      config: state.config || {},
      basicInfo: state.basicInfo || {},
      infographic: state.infographic || { title: "", steps: [] },
      outcomes: state.outcomes || { quantitative: [], qualitative: [] },
      footer: state.footer || {},
      updatedAt: state.updatedAt || Date.now()
    });

    // Helper function to sync a specific collection array with remote Firestore
    const syncCollection = async (colName: string, items: any[]) => {
      // A. Get existing IDs from Firestore
      const snap = await getDocs(collection(db, colName));
      const existingIds = new Set<string>();
      snap.forEach(doc => {
        existingIds.add(doc.id);
      });

      // B. Save current items
      const activeIds = new Set<string>();
      for (const item of items) {
        if (item && item.id) {
          activeIds.add(item.id);
          const docRef = doc(db, colName, item.id);
          await setDoc(docRef, item);
        }
      }

      // C. Delete any items that are no longer in the active state list
      for (const existingId of existingIds) {
        if (!activeIds.has(existingId)) {
          console.log(`Deleting removed item from Firestore [${colName}/${existingId}]`);
          await deleteDoc(doc(db, colName, existingId));
        }
      }
    };

    // Sync all arrays concurrently
    await Promise.all([
      syncCollection("reports", state.reports || []),
      syncCollection("researchTasks", state.researchTasks || []),
      syncCollection("lessons", state.lessons || []),
      syncCollection("gallery", state.gallery || []),
      syncCollection("community", state.community || [])
    ]);

    console.log("All portal state collections synchronized to Cloud Firestore successfully.");
    return true;
  } catch (err) {
    console.error("Firestore error while saving portal state:", err);
    return false;
  }
}
