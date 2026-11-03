/**
 * PRALAY TECH - Cloud Firestore & Real-Time Synchronization Service
 * Handles data mutations, subscription listeners, and standardized error handling.
 */

import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  query,
  orderBy
} from 'firebase/firestore';
import { db, auth, isConfigValid } from './config';
import { SurveyResponse } from '../types';
import { INITIAL_SURVEY_RESPONSES } from '../data/initialData';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
      emailVerified: auth?.currentUser?.emailVerified || null,
      isAnonymous: auth?.currentUser?.isAnonymous || null,
      tenantId: auth?.currentUser?.tenantId || null,
      providerInfo: auth?.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const FIRESTORE_COLLECTION = 'survey_responses';
const LOCAL_STORAGE_KEY = 'pralay_tech_survey_responses_v2';
const BROADCAST_CHANNEL_NAME = 'pralay_tech_survey_sync_channel';

// Setup BroadcastChannel for real-time inter-tab synchronization
let syncChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    syncChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
  }
} catch {
  // BroadcastChannel unavailable
}

/**
 * Load local fallback responses
 */
export function getLocalResponses(): SurveyResponse[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // Fallback
  }
  return INITIAL_SURVEY_RESPONSES;
}

/**
 * Save responses locally to guarantee resilience and offline persistence
 */
export function saveLocalResponses(responses: SurveyResponse[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(responses));
    if (syncChannel) {
      syncChannel.postMessage({ type: 'RESPONSES_UPDATED', timestamp: Date.now() });
    }
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

/**
 * Real-time Subscription to Survey Responses.
 * If Firestore is available, sets up `onSnapshot`.
 * Otherwise, provides real-time cross-tab updates using BroadcastChannel and storage events.
 */
export function subscribeToSurveyResponses(
  onUpdate: (responses: SurveyResponse[], isLiveCloud: boolean) => void,
  onError?: (error: Error) => void
): () => void {
  // Scenario 1: Live Cloud Firestore is connected
  if (isConfigValid && db) {
    const colRef = collection(db, FIRESTORE_COLLECTION);
    const q = query(colRef, orderBy('timestamp', 'desc'));

    try {
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const cloudResponses: SurveyResponse[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            cloudResponses.push({
              id: docSnap.id,
              timestamp: data.timestamp || new Date().toISOString(),
              ageGroup: data.ageGroup,
              gender: data.gender,
              location: data.location,
              environmentalAwareness: Number(data.environmentalAwareness) || 3,
              publicTransportSatisfaction: Number(data.publicTransportSatisfaction) || 3,
              cleanlinessSatisfaction: Number(data.cleanlinessSatisfaction) || 3,
              airQualitySatisfaction: Number(data.airQualitySatisfaction) || 3,
              overallSatisfaction: Number(data.overallSatisfaction) || 3,
              primaryConcern: data.primaryConcern,
              suggestions: data.suggestions || '',
              isDemo: Boolean(data.isDemo),
              source: 'firestore',
              firestoreDocId: docSnap.id
            });
          });

          // If Firestore is empty on first run, seed with demo data
          if (cloudResponses.length === 0) {
            const local = getLocalResponses();
            onUpdate(local, true);
          } else {
            // Save copy locally for offline cache
            saveLocalResponses(cloudResponses);
            onUpdate(cloudResponses, true);
          }
        },
        (error) => {
          console.warn('Firestore onSnapshot fallback to local persistent store:', error.message);
          const local = getLocalResponses();
          onUpdate(local, false);
          if (onError) {
            onError(error);
          }
        }
      );

      return () => unsubscribe();
    } catch (e) {
      console.warn('Firestore listener initialization error, using local listener:', e);
    }
  }

  // Scenario 2: Local persistent mode with inter-tab synchronization
  const localInitial = getLocalResponses();
  onUpdate(localInitial, false);

  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === LOCAL_STORAGE_KEY && e.newValue) {
      try {
        const updated = JSON.parse(e.newValue);
        onUpdate(updated, false);
      } catch {
        // ignore
      }
    }
  };

  const handleBroadcast = (event: MessageEvent) => {
    if (event.data?.type === 'RESPONSES_UPDATED') {
      const updated = getLocalResponses();
      onUpdate(updated, false);
    }
  };

  window.addEventListener('storage', handleStorageChange);
  if (syncChannel) {
    syncChannel.addEventListener('message', handleBroadcast);
  }

  return () => {
    window.removeEventListener('storage', handleStorageChange);
    if (syncChannel) {
      syncChannel.removeEventListener('message', handleBroadcast);
    }
  };
}

/**
 * Add a new survey response to Firestore (with local persistence fallback).
 */
export async function addSurveyResponseToFirestore(
  response: Omit<SurveyResponse, 'id' | 'timestamp'>
): Promise<SurveyResponse> {
  const timestamp = new Date().toISOString();
  const docId = `SRV-${new Date().getFullYear()}-${Date.now().toString().slice(-5)}`;

  const fullResponse: SurveyResponse = {
    ...response,
    id: docId,
    timestamp,
    isDemo: false,
    source: isConfigValid && db ? 'firestore' : 'local'
  };

  // Try writing to Firestore if configured
  if (isConfigValid && db) {
    try {
      const docRef = doc(db, FIRESTORE_COLLECTION, docId);
      await setDoc(docRef, {
        id: fullResponse.id,
        timestamp: fullResponse.timestamp,
        ageGroup: fullResponse.ageGroup,
        gender: fullResponse.gender || 'Prefer not to say',
        location: fullResponse.location || 'Anonymous Area',
        environmentalAwareness: fullResponse.environmentalAwareness,
        publicTransportSatisfaction: fullResponse.publicTransportSatisfaction,
        cleanlinessSatisfaction: fullResponse.cleanlinessSatisfaction,
        airQualitySatisfaction: fullResponse.airQualitySatisfaction,
        overallSatisfaction: fullResponse.overallSatisfaction,
        primaryConcern: fullResponse.primaryConcern,
        suggestions: fullResponse.suggestions,
        isDemo: false,
        createdAt: timestamp
      });
      fullResponse.source = 'firestore';
      fullResponse.firestoreDocId = docId;
    } catch (error) {
      console.warn('Firestore write notice: Persisted locally due to:', error);
      // Fallback local write ensures user submission is never lost!
    }
  }

  // Update local store as well
  const current = getLocalResponses();
  const updated = [fullResponse, ...current];
  saveLocalResponses(updated);

  return fullResponse;
}

/**
 * Delete a survey response from Firestore (and local store).
 */
export async function deleteSurveyResponseFromFirestore(id: string): Promise<void> {
  if (isConfigValid && db) {
    try {
      const docRef = doc(db, FIRESTORE_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.warn('Firestore delete notice:', error);
    }
  }

  const current = getLocalResponses();
  const updated = current.filter(r => r.id !== id);
  saveLocalResponses(updated);
}

/**
 * Upload all demo responses to Firestore if desired
 */
export async function seedDemoDataToFirestore(): Promise<number> {
  if (!isConfigValid || !db) return 0;

  let seededCount = 0;
  for (const resp of INITIAL_SURVEY_RESPONSES) {
    try {
      const docRef = doc(db, FIRESTORE_COLLECTION, resp.id);
      await setDoc(docRef, {
        ...resp,
        isDemo: true,
        createdAt: resp.timestamp
      });
      seededCount++;
    } catch (e) {
      console.error('Error seeding doc to Firestore:', e);
    }
  }
  return seededCount;
}
