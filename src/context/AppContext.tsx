import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  SurveyResponse,
  SensorReading,
  TelemetryLog,
  SimulationScenario,
  TabType,
  DataViewMode,
  FirebaseConnectionStatus,
  AdminUser
} from '../types';
import { INITIAL_SURVEY_RESPONSES, INITIAL_SENSOR_HISTORY } from '../data/initialData';
import {
  subscribeToSurveyResponses,
  addSurveyResponseToFirestore,
  deleteSurveyResponseFromFirestore,
  saveLocalResponses
} from '../firebase/firestoreService';
import {
  isConfigValid,
  activeConfig,
  testConnection as testFirebaseConn
} from '../firebase/config';
import {
  subscribeToAuthState,
  logoutAdmin,
  signInPresentationAdmin,
  signInWithGoogle
} from '../firebase/authService';
import { generatePDFReport, generateCSVReport } from '../utils/pdfGenerator';

interface AppContextType {
  // Navigation
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  
  // Data Filtering Mode (Real Only / Demo Only / All)
  viewMode: DataViewMode;
  setViewMode: (mode: DataViewMode) => void;

  // Survey responses
  responses: SurveyResponse[];
  realResponses: SurveyResponse[];
  demoResponses: SurveyResponse[];
  activeResponses: SurveyResponse[];
  isResponsesLoading: boolean;
  addSurveyResponse: (response: Omit<SurveyResponse, 'id' | 'timestamp'>) => Promise<SurveyResponse>;
  deleteSurveyResponse: (id: string) => Promise<void>;
  resetToDemoData: () => void;
  purgeDemoData: () => void;
  clearAllResponses: () => void;
  addRandomDemoResponse: () => void;
  
  // IoT Simulation
  sensorHistory: SensorReading[];
  currentSensor: SensorReading;
  isSimulationActive: boolean;
  simulationSpeed: number; // in ms
  simulationScenario: SimulationScenario;
  selectedNode: string;
  telemetryLogs: TelemetryLog[];
  toggleSimulation: () => void;
  startSimulation: () => void;
  stopSimulation: () => void;
  resetSimulation: () => void;
  stepSimulation: () => void;
  setSimulationSpeed: (ms: number) => void;
  setSimulationScenario: (scenario: SimulationScenario) => void;
  setSelectedNode: (node: string) => void;
  clearTelemetryLogs: () => void;
  
  // Analytics helpers for active dataset
  publicSatisfactionRate: number; // 0 - 100%
  totalResponsesCount: number;
  realResponsesCount: number;
  demoResponsesCount: number;
  sentimentCounts: { positive: number; neutral: number; negative: number };
  
  // Firebase Integration State
  firebaseStatus: FirebaseConnectionStatus;
  testFirestoreConnection: () => Promise<{ success: boolean; message: string }>;
  isConfigModalOpen: boolean;
  setIsConfigModalOpen: (open: boolean) => void;

  // Admin Authentication
  adminUser: AdminUser | null;
  isAdminAuthenticated: boolean;
  loginPresentationAdmin: (passcode: string) => Promise<AdminUser>;
  loginGoogleAdmin: () => Promise<AdminUser>;
  logoutCurrentAdmin: () => Promise<void>;

  // Export actions
  exportToCSV: (targetMode?: DataViewMode) => void;
  exportToPDF: (targetMode?: DataViewMode) => void;
  exportAnalyticsJSON: (targetMode?: DataViewMode) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [viewMode, setViewMode] = useState<DataViewMode>('all');
  const [isResponsesLoading, setIsResponsesLoading] = useState<boolean>(true);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState<boolean>(false);

  // Responses state initialized from seed
  const [responses, setResponses] = useState<SurveyResponse[]>(INITIAL_SURVEY_RESPONSES);

  // Admin User state
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  // Firebase connection status tracker
  const [firebaseStatus, setFirebaseStatus] = useState<FirebaseConnectionStatus>({
    isConnected: isConfigValid,
    isConfigured: isConfigValid,
    projectId: activeConfig.projectId,
    activeCollection: 'survey_responses',
    lastSyncedAt: new Date().toLocaleTimeString(),
    realtimeActive: true,
    mode: isConfigValid ? 'firestore_live' : 'local_persistent_emulation'
  });

  // IoT Simulation State
  const [sensorHistory, setSensorHistory] = useState<SensorReading[]>(INITIAL_SENSOR_HISTORY);
  const [isSimulationActive, setIsSimulationActive] = useState<boolean>(true);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(3000); // 3s interval default
  const [simulationScenario, setSimulationScenario] = useState<SimulationScenario>('Urban Normal');
  const [selectedNode, setSelectedNode] = useState<string>('NODE-PRALAY-01');

  // Telemetry event logs
  const [telemetryLogs, setTelemetryLogs] = useState<TelemetryLog[]>([
    {
      id: 'log-0',
      timestamp: new Date().toLocaleTimeString(),
      type: 'SYS_INFO',
      message: 'Zero-Hardware Virtual IoT Engine initialized.',
      details: 'Node ID: NODE-PRALAY-01 | Broker: virtual://pralay-mqtt-bus'
    },
    {
      id: 'log-1',
      timestamp: new Date().toLocaleTimeString(),
      type: 'FIREBASE_SYNC',
      message: isConfigValid ? '[FIREBASE] Cloud Firestore connected.' : '[SYNC] Local persistent sync active.',
      details: `Target: survey_responses | Real-Time: Active`
    }
  ]);

  // Subscribe to real-time data sync (Firestore onSnapshot or broadcast channel)
  useEffect(() => {
    setIsResponsesLoading(true);
    const unsubscribe = subscribeToSurveyResponses(
      (updatedResponses, isLiveCloud) => {
        setResponses(updatedResponses);
        setIsResponsesLoading(false);
        setFirebaseStatus(prev => ({
          ...prev,
          isConnected: true,
          mode: isLiveCloud ? 'firestore_live' : 'local_persistent_emulation',
          lastSyncedAt: new Date().toLocaleTimeString()
        }));
      },
      (err) => {
        setIsResponsesLoading(false);
        setFirebaseStatus(prev => ({
          ...prev,
          error: err.message,
          mode: 'local_persistent_emulation'
        }));
      }
    );

    return () => unsubscribe();
  }, []);

  // Subscribe to Auth State
  useEffect(() => {
    const unsubAuth = subscribeToAuthState((user) => {
      setAdminUser(user);
    });
    return () => unsubAuth();
  }, []);

  // Separate real user responses from demo responses
  const realResponses = responses.filter(r => !r.isDemo);
  const demoResponses = responses.filter(r => r.isDemo);

  // Filter based on active viewMode
  const activeResponses = viewMode === 'real_only'
    ? realResponses
    : viewMode === 'demo_only'
    ? demoResponses
    : responses;

  const currentSensor = sensorHistory[sensorHistory.length - 1] || INITIAL_SENSOR_HISTORY[INITIAL_SENSOR_HISTORY.length - 1];

  // Helper to generate next virtual sensor packet
  const generateNextSensorReading = useCallback((prev: SensorReading, scenario: SimulationScenario, node: string): SensorReading => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const fullDate = now.toISOString();

    let targetTemp = 27;
    let targetHum = 60;
    let targetAqi = 75;
    let targetCo2 = 450;
    let targetNoise = 55;

    if (scenario === 'Peak Traffic') {
      targetTemp = 32.5;
      targetHum = 48;
      targetAqi = 155;
      targetCo2 = 780;
      targetNoise = 82;
    } else if (scenario === 'Industrial Belt') {
      targetTemp = 34.0;
      targetHum = 44;
      targetAqi = 195;
      targetCo2 = 920;
      targetNoise = 78;
    } else if (scenario === 'Eco Park Area') {
      targetTemp = 23.8;
      targetHum = 72;
      targetAqi = 32;
      targetCo2 = 390;
      targetNoise = 42;
    }

    // Gentle random drift towards target
    const noise = (Math.random() - 0.5);
    const newTemp = Math.round((prev.temperature * 0.85 + targetTemp * 0.15 + noise * 0.4) * 10) / 10;
    const newHum = Math.round(Math.max(20, Math.min(95, prev.humidity * 0.85 + targetHum * 0.15 + noise * 1.5)));
    const newAqi = Math.round(Math.max(10, Math.min(300, prev.airQualityIndex * 0.85 + targetAqi * 0.15 + noise * 5)));
    const newCo2 = Math.round(prev.co2 * 0.85 + targetCo2 * 0.15 + noise * 12);
    const newNoiseLevel = Math.round(prev.noiseLevel * 0.85 + targetNoise * 0.15 + noise * 3);
    const newPm25 = Math.round((newAqi * 0.38 + (Math.random() * 2)) * 10) / 10;

    let status: SensorReading['status'] = 'Good';
    if (newAqi > 150) status = 'Poor';
    else if (newAqi > 100) status = 'Unhealthy';
    else if (newAqi > 50) status = 'Moderate';

    return {
      id: `S-${Date.now()}`,
      timestamp: timeStr,
      fullDate,
      temperature: newTemp,
      humidity: newHum,
      airQualityIndex: newAqi,
      pm25: newPm25,
      co2: newCo2,
      noiseLevel: newNoiseLevel,
      status,
      sensorNodeId: node
    };
  }, []);

  // Tick step for simulation
  const stepSimulation = useCallback(() => {
    setSensorHistory(prevHistory => {
      const last = prevHistory[prevHistory.length - 1] || INITIAL_SENSOR_HISTORY[0];
      const next = generateNextSensorReading(last, simulationScenario, selectedNode);
      const updated = [...prevHistory.slice(-29), next]; // keep max 30 points

      // Append log entry
      setTelemetryLogs(logs => [
        {
          id: `log-${Date.now()}`,
          timestamp: next.timestamp,
          type: 'SIM_PACKET',
          message: `[VIRTUAL_TELEMETRY] ${next.sensorNodeId} -> AQI: ${next.airQualityIndex} | Temp: ${next.temperature}°C | Hum: ${next.humidity}%`,
          details: `CO2: ${next.co2}ppm | Noise: ${next.noiseLevel}dB | Status: ${next.status} (Simulated Data)`
        },
        ...logs.slice(0, 49) // keep 50 latest logs
      ]);

      return updated;
    });
  }, [generateNextSensorReading, simulationScenario, selectedNode]);

  // Simulation loop timer
  useEffect(() => {
    if (!isSimulationActive) return;

    const timer = setInterval(() => {
      stepSimulation();
    }, simulationSpeed);

    return () => clearInterval(timer);
  }, [isSimulationActive, simulationSpeed, stepSimulation]);

  const toggleSimulation = () => setIsSimulationActive(prev => !prev);
  const startSimulation = () => setIsSimulationActive(true);
  const stopSimulation = () => setIsSimulationActive(false);

  const resetSimulation = () => {
    setSensorHistory(INITIAL_SENSOR_HISTORY);
    setTelemetryLogs(logs => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        type: 'CALIBRATION',
        message: 'Virtual IoT Sensor Hub reset to default baseline.',
        details: 'Baseline restored: 15 historical points, Urban Normal scenario'
      },
      ...logs.slice(0, 49)
    ]);
  };

  const clearTelemetryLogs = () => {
    setTelemetryLogs([]);
  };

  // Add survey response - Saved to Firestore and synchronized!
  const addSurveyResponse = async (newResp: Omit<SurveyResponse, 'id' | 'timestamp'>) => {
    const saved = await addSurveyResponseToFirestore(newResp);
    setResponses(prev => [saved, ...prev.filter(r => r.id !== saved.id)]);

    // Log to telemetry
    setTelemetryLogs(logs => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        type: 'SURVEY_INGEST',
        message: `[SURVEY_INGESTED] ${saved.id} registered into ${saved.source === 'firestore' ? 'Cloud Firestore' : 'Local Ingest'}.`,
        details: `Overall Score: ${saved.overallSatisfaction}/5 | Topic: ${saved.primaryConcern}`
      },
      ...logs.slice(0, 49)
    ]);

    return saved;
  };

  // Delete survey response - Admin feature
  const deleteSurveyResponse = async (id: string) => {
    await deleteSurveyResponseFromFirestore(id);
    setResponses(prev => prev.filter(r => r.id !== id));
  };

  // Reset to demo data
  const resetToDemoData = () => {
    // Keep user submissions, restore 14 demo seed records
    const userOnly = responses.filter(r => !r.isDemo);
    const merged = [...userOnly, ...INITIAL_SURVEY_RESPONSES];
    setResponses(merged);
    saveLocalResponses(merged);
  };

  // Purge all demo responses (leaving only real user submissions)
  const purgeDemoData = () => {
    const userOnly = responses.filter(r => !r.isDemo);
    setResponses(userOnly);
    saveLocalResponses(userOnly);
  };

  const clearAllResponses = () => {
    setResponses([]);
    saveLocalResponses([]);
  };

  // Add random demo response helper for presentations
  const addRandomDemoResponse = () => {
    const ageGroups: SurveyResponse['ageGroup'][] = ['18-25', '26-35', '36-50', '50+'];
    const genders: SurveyResponse['gender'][] = ['Male', 'Female', 'Non-Binary', 'Prefer not to say'];
    const concerns: SurveyResponse['primaryConcern'][] = [
      'Air Quality',
      'Traffic & Noise',
      'Waste Management',
      'Green Spaces',
      'Public Amenities'
    ];
    const locations = [
      'Metro Plaza Corridor',
      'East Campus Quad',
      'Civil Hospital Perimeter',
      'Botanical Gardens',
      'Tech Park Sector 62',
      'Old Town Heritage Market',
      'Railway Station Frontage'
    ];
    const feedbackSamples = [
      'Encourage more electric battery buses during college peak hours.',
      'Air quality has noticeably improved after recent tree plantation drives.',
      'Sound levels near the highway intersection are too loud during midday.',
      'Smart solar dustbins with fill sensors would prevent litter spills.',
      'Need real-time digital boards displaying sensor AQI values to raise public awareness.'
    ];

    const randomOverall = Math.floor(Math.random() * 5) + 1;

    const demoResp: SurveyResponse = {
      id: `SRV-${new Date().getFullYear()}-DEMO-${String(demoResponses.length + 1).padStart(3, '0')}`,
      timestamp: new Date().toISOString(),
      ageGroup: ageGroups[Math.floor(Math.random() * ageGroups.length)],
      gender: genders[Math.floor(Math.random() * genders.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      environmentalAwareness: Math.floor(Math.random() * 3) + 3,
      publicTransportSatisfaction: Math.floor(Math.random() * 4) + 2,
      cleanlinessSatisfaction: Math.floor(Math.random() * 4) + 2,
      airQualitySatisfaction: Math.max(1, Math.min(5, Math.round(randomOverall + (Math.random() * 2 - 1)))),
      overallSatisfaction: randomOverall,
      primaryConcern: concerns[Math.floor(Math.random() * concerns.length)],
      suggestions: feedbackSamples[Math.floor(Math.random() * feedbackSamples.length)],
      isDemo: true,
      source: 'demo'
    };

    const updated = [demoResp, ...responses];
    setResponses(updated);
    saveLocalResponses(updated);
  };

  // Calculated metrics for activeResponses
  const totalResponsesCount = activeResponses.length;
  const realResponsesCount = realResponses.length;
  const demoResponsesCount = demoResponses.length;

  const sentimentCounts = activeResponses.reduce(
    (acc, r) => {
      if (r.overallSatisfaction >= 4) acc.positive += 1;
      else if (r.overallSatisfaction === 3) acc.neutral += 1;
      else acc.negative += 1;
      return acc;
    },
    { positive: 0, neutral: 0, negative: 0 }
  );

  const publicSatisfactionRate = totalResponsesCount > 0
    ? Math.round(
        (activeResponses.reduce((sum, r) => sum + r.overallSatisfaction, 0) / (totalResponsesCount * 5)) * 100
      )
    : 0;

  // Export handlers
  const exportToCSV = (targetMode: DataViewMode = viewMode) => {
    const dataToExport = targetMode === 'real_only'
      ? realResponses
      : targetMode === 'demo_only'
      ? demoResponses
      : responses;
    generateCSVReport(dataToExport, `PRALAY_TECH_Survey_${targetMode}`);
  };

  const exportToPDF = (targetMode: DataViewMode = viewMode) => {
    const dataToExport = targetMode === 'real_only'
      ? realResponses
      : targetMode === 'demo_only'
      ? demoResponses
      : responses;

    const sentCounts = dataToExport.reduce(
      (acc, r) => {
        if (r.overallSatisfaction >= 4) acc.positive += 1;
        else if (r.overallSatisfaction === 3) acc.neutral += 1;
        else acc.negative += 1;
        return acc;
      },
      { positive: 0, neutral: 0, negative: 0 }
    );

    const satRate = dataToExport.length > 0
      ? Math.round((dataToExport.reduce((s, r) => s + r.overallSatisfaction, 0) / (dataToExport.length * 5)) * 100)
      : 0;

    generatePDFReport({
      responses: dataToExport,
      currentSensor,
      publicSatisfactionRate: satRate,
      totalResponsesCount: dataToExport.length,
      sentimentCounts: sentCounts,
      viewMode: targetMode
    });
  };

  const exportAnalyticsJSON = (targetMode: DataViewMode = viewMode) => {
    const dataToExport = targetMode === 'real_only'
      ? realResponses
      : targetMode === 'demo_only'
      ? demoResponses
      : responses;

    const reportData = {
      project: "PRALAY TECH - IoT-Based Public Survey Response Analysis System",
      team: "Team 02",
      tagline: "Innovating Beyond Limits.",
      generatedAt: new Date().toISOString(),
      disclaimer: "VIRTUAL IoT SIMULATION - NO PHYSICAL HARDWARE CONNECTED. Sensor telemetry is simulated.",
      dataScope: targetMode,
      summary: {
        totalAnalyzed: dataToExport.length,
        realUserCount: dataToExport.filter(r => !r.isDemo).length,
        demoCount: dataToExport.filter(r => r.isDemo).length,
        publicSatisfactionPercentage: `${publicSatisfactionRate}%`,
        sentimentBreakdown: sentimentCounts,
        currentSimulatedSensors: {
          nodeId: currentSensor.sensorNodeId,
          temperature: `${currentSensor.temperature}°C`,
          humidity: `${currentSensor.humidity}%`,
          airQualityIndex: currentSensor.airQualityIndex,
          status: currentSensor.status
        }
      },
      responses: dataToExport
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `PRALAY_TECH_Analytics_${targetMode}_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Test Firebase Connection (using getDocFromServer)
  const testFirestoreConnection = async () => {
    const res = await testFirebaseConn();
    setFirebaseStatus(prev => ({
      ...prev,
      isConnected: res.success,
      lastSyncedAt: new Date().toLocaleTimeString()
    }));
    return res;
  };

  // Admin Auth Methods
  const loginPresentationAdmin = async (passcode: string) => {
    const user = await signInPresentationAdmin(passcode);
    setAdminUser(user);
    return user;
  };

  const loginGoogleAdmin = async () => {
    const user = await signInWithGoogle();
    setAdminUser(user);
    return user;
  };

  const logoutCurrentAdmin = async () => {
    await logoutAdmin();
    setAdminUser(null);
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        viewMode,
        setViewMode,
        responses,
        realResponses,
        demoResponses,
        activeResponses,
        isResponsesLoading,
        addSurveyResponse,
        deleteSurveyResponse,
        resetToDemoData,
        purgeDemoData,
        clearAllResponses,
        addRandomDemoResponse,
        sensorHistory,
        currentSensor,
        isSimulationActive,
        simulationSpeed,
        simulationScenario,
        selectedNode,
        telemetryLogs,
        toggleSimulation,
        startSimulation,
        stopSimulation,
        resetSimulation,
        stepSimulation,
        setSimulationSpeed,
        setSimulationScenario,
        setSelectedNode,
        clearTelemetryLogs,
        publicSatisfactionRate,
        totalResponsesCount,
        realResponsesCount,
        demoResponsesCount,
        sentimentCounts,
        firebaseStatus,
        testFirestoreConnection,
        isConfigModalOpen,
        setIsConfigModalOpen,
        adminUser,
        isAdminAuthenticated: Boolean(adminUser?.isAdmin),
        loginPresentationAdmin,
        loginGoogleAdmin,
        logoutCurrentAdmin,
        exportToCSV,
        exportToPDF,
        exportAnalyticsJSON
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
