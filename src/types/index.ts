export type AgeGroup = '18-25' | '26-35' | '36-50' | '50+';
export type Gender = 'Male' | 'Female' | 'Non-Binary' | 'Prefer not to say';
export type PrimaryConcern = 'Air Quality' | 'Traffic & Noise' | 'Waste Management' | 'Green Spaces' | 'Public Amenities';
export type SimulationScenario = 'Urban Normal' | 'Peak Traffic' | 'Industrial Belt' | 'Eco Park Area';

export interface SurveyResponse {
  id: string;
  timestamp: string; // ISO string e.g. "2026-10-30T17:15:00.000Z"
  ageGroup: AgeGroup;
  gender?: Gender;
  location?: string;
  environmentalAwareness: number; // 1 to 5
  publicTransportSatisfaction: number; // 1 to 5
  cleanlinessSatisfaction: number; // 1 to 5
  airQualitySatisfaction: number; // 1 to 5
  overallSatisfaction: number; // 1 to 5
  primaryConcern: PrimaryConcern;
  suggestions: string;
  isDemo?: boolean;
  source?: 'firestore' | 'demo' | 'local';
  firestoreDocId?: string;
}

export interface SensorReading {
  id: string;
  timestamp: string; // e.g. "18:52:14"
  fullDate: string;
  temperature: number; // °C
  humidity: number; // %
  airQualityIndex: number; // AQI (0-300)
  pm25: number; // µg/m³
  co2: number; // ppm
  noiseLevel: number; // dB
  status: 'Good' | 'Moderate' | 'Unhealthy' | 'Poor';
  sensorNodeId: string;
}

export interface TelemetryLog {
  id: string;
  timestamp: string;
  type: 'SIM_PACKET' | 'SYS_INFO' | 'SURVEY_INGEST' | 'CALIBRATION' | 'FIREBASE_SYNC';
  message: string;
  details?: string;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  contribution: string;
}

export type TabType = 
  | 'dashboard'
  | 'simulator'
  | 'survey'
  | 'analytics'
  | 'visualizations'
  | 'insights'
  | 'management'
  | 'admin'
  | 'report'
  | 'about'
  | 'presentation';

export type DataViewMode = 'all' | 'real_only' | 'demo_only';

export interface FirebaseConnectionStatus {
  isConnected: boolean;
  isConfigured: boolean;
  projectId?: string;
  activeCollection: string;
  lastSyncedAt?: string;
  realtimeActive: boolean;
  mode: 'firestore_live' | 'local_persistent_emulation';
  error?: string;
}

export interface AdminUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: 'admin' | 'superadmin' | 'guest';
  isAdmin: boolean;
}
