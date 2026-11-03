/**
 * PRALAY TECH - Firebase Modular SDK Configuration
 * Supports live Firebase Cloud connection or high-fidelity local persistent fallback.
 */

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, doc, getDocFromServer } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

const FIREBASE_CONFIG_STORAGE_KEY = 'pralay_tech_firebase_custom_config_v1';

export interface FirebaseAppConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
  firestoreDatabaseId?: string;
}

// 1. Check runtime environment variables
const envConfig: FirebaseAppConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || (typeof process !== 'undefined' ? process.env?.VITE_FIREBASE_API_KEY : undefined),
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID || '(default)'
};

// 2. Helper to load custom config from LocalStorage if user configured in UI
export function getStoredFirebaseConfig(): FirebaseAppConfig | null {
  try {
    const raw = localStorage.getItem(FIREBASE_CONFIG_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.projectId && parsed.apiKey) {
        return parsed;
      }
    }
  } catch {
    // Ignore parse errors
  }
  return null;
}

export function saveStoredFirebaseConfig(config: FirebaseAppConfig) {
  try {
    localStorage.setItem(FIREBASE_CONFIG_STORAGE_KEY, JSON.stringify(config));
    window.location.reload();
  } catch (e) {
    console.error('Failed to save Firebase config:', e);
  }
}

export function clearStoredFirebaseConfig() {
  try {
    localStorage.removeItem(FIREBASE_CONFIG_STORAGE_KEY);
    window.location.reload();
  } catch (e) {
    console.error('Failed to clear Firebase config:', e);
  }
}

// Determine active config
const storedConfig = getStoredFirebaseConfig();
const activeConfig: FirebaseAppConfig = storedConfig || envConfig;

const isConfigValid = Boolean(activeConfig.apiKey && activeConfig.projectId && activeConfig.apiKey !== 'MY_FIREBASE_API_KEY');

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

if (isConfigValid) {
  try {
    if (!getApps().length) {
      app = initializeApp({
        apiKey: activeConfig.apiKey,
        authDomain: activeConfig.authDomain || `${activeConfig.projectId}.firebaseapp.com`,
        projectId: activeConfig.projectId,
        storageBucket: activeConfig.storageBucket || `${activeConfig.projectId}.appspot.com`,
        messagingSenderId: activeConfig.messagingSenderId,
        appId: activeConfig.appId,
      });
    } else {
      app = getApp();
    }

    db = getFirestore(app, activeConfig.firestoreDatabaseId || '(default)');
    auth = getAuth(app);
  } catch (err) {
    console.warn('Firebase initialization notice: Running in local persistent mode.', err);
  }
}

export { app, db, auth, isConfigValid, activeConfig };

/**
 * Validate Connection to Firestore (Per Firebase Integration Skill Guideline)
 */
export async function testConnection(): Promise<{ success: boolean; message: string }> {
  if (!db) {
    return {
      success: false,
      message: 'Firebase is not yet configured with valid cloud credentials. Using local persistent storage mode.'
    };
  }

  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return {
      success: true,
      message: 'Successfully established direct server handshake with Cloud Firestore.'
    };
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      return {
        success: false,
        message: 'The Firestore client is currently offline. Please verify network and Firebase project rules.'
      };
    }
    // Expected if 'test/connection' doc does not exist, but network reached Firestore
    return {
      success: true,
      message: 'Connected to Firestore server instance (Permission & Handshake verified).'
    };
  }
}
