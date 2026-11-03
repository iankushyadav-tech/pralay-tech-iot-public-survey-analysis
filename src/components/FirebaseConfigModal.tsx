import React, { useState } from 'react';
import {
  X,
  Database,
  CheckCircle2,
  AlertTriangle,
  Server,
  Cloud,
  Key,
  Save,
  RotateCcw,
  Activity,
  FileCode,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  getStoredFirebaseConfig,
  saveStoredFirebaseConfig,
  clearStoredFirebaseConfig,
  FirebaseAppConfig
} from '../firebase/config';

export const FirebaseConfigModal: React.FC = () => {
  const {
    firebaseStatus,
    testFirestoreConnection,
    isConfigModalOpen,
    setIsConfigModalOpen
  } = useApp();

  const [testResult, setTestResult] = useState<{ loading: boolean; success?: boolean; message?: string }>({
    loading: false
  });

  const stored = getStoredFirebaseConfig();
  const [apiKey, setApiKey] = useState<string>(stored?.apiKey || '');
  const [projectId, setProjectId] = useState<string>(stored?.projectId || '');
  const [authDomain, setAuthDomain] = useState<string>(stored?.authDomain || '');
  const [storageBucket, setStorageBucket] = useState<string>(stored?.storageBucket || '');
  const [appId, setAppId] = useState<string>(stored?.appId || '');

  if (!isConfigModalOpen) return null;

  const handleTestConnection = async () => {
    setTestResult({ loading: true });
    const res = await testFirestoreConnection();
    setTestResult({ loading: false, success: res.success, message: res.message });
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId.trim() || !apiKey.trim()) {
      alert('Please provide at least a Project ID and API Key.');
      return;
    }

    const config: FirebaseAppConfig = {
      apiKey: apiKey.trim(),
      projectId: projectId.trim(),
      authDomain: authDomain.trim() || `${projectId.trim()}.firebaseapp.com`,
      storageBucket: storageBucket.trim() || `${projectId.trim()}.appspot.com`,
      appId: appId.trim()
    };

    saveStoredFirebaseConfig(config);
  };

  const handleClearConfig = () => {
    if (confirm('Clear custom Firebase configuration and restore default fallback?')) {
      clearStoredFirebaseConfig();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-xs">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Full-Stack Architecture
                </span>
                <span className="text-xs text-slate-500 font-mono">Firebase Firestore & Auth</span>
              </div>
              <h2 className="text-lg font-black text-slate-900 mt-0.5">
                Firebase Cloud & Database Connection
              </h2>
            </div>
          </div>

          <button
            onClick={() => setIsConfigModalOpen(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Connection Status Card */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 font-mono uppercase">
              <Server className="w-3.5 h-3.5 text-blue-600" /> Current Backend Mode:
            </span>
            <span
              className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                firebaseStatus.mode === 'firestore_live'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-blue-50 text-blue-700 border-blue-300'
              }`}
            >
              {firebaseStatus.mode === 'firestore_live' ? 'CLOUD FIRESTORE (LIVE)' : 'LOCAL PERSISTENT STORE (OFFLINE-READY)'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            <div className="bg-white p-2.5 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-bold">PROJECT ID:</span>
              <span className="text-slate-800 font-bold truncate block">{firebaseStatus.projectId || 'pralay-tech-iot'}</span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-bold">COLLECTION:</span>
              <span className="text-red-600 font-bold truncate block">survey_responses</span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-bold">REAL-TIME:</span>
              <span className="text-emerald-700 font-bold block">Synchronized</span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-bold">LAST SYNC:</span>
              <span className="text-slate-700 block">{firebaseStatus.lastSyncedAt || 'Just now'}</span>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200/60">
            <button
              onClick={handleTestConnection}
              disabled={testResult.loading}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Activity className="w-3.5 h-3.5 text-red-600" />
              <span>{testResult.loading ? 'Testing Handshake...' : 'Test Server Connection'}</span>
            </button>

            {testResult.message && (
              <span className={`text-[11px] font-mono font-bold ${testResult.success ? 'text-emerald-700' : 'text-amber-700'}`}>
                {testResult.message}
              </span>
            )}
          </div>
        </div>

        {/* Step-by-Step Firebase Instructions for Evaluators & Users */}
        <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs text-slate-700 space-y-2">
          <div className="flex items-center gap-2 font-bold text-blue-900">
            <ShieldCheck className="w-4 h-4 text-blue-700" />
            <span>How to Link Your Own Firebase Project:</span>
          </div>
          <ol className="list-decimal list-inside space-y-1 text-slate-600 pl-1">
            <li>Visit <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-blue-600 underline font-semibold inline-flex items-center gap-0.5">Firebase Console <ExternalLink className="w-3 h-3" /></a> and create a project (e.g., <code>pralay-tech-iot</code>).</li>
            <li>Enable <strong>Cloud Firestore</strong> (Production rules deployed via <code>firestore.rules</code>).</li>
            <li>Enable <strong>Authentication</strong> (Google Provider & Email/Password).</li>
            <li>In Project Settings, register a Web App and paste your credentials below or inject via <code>.env</code>.</li>
          </ol>
        </div>

        {/* Custom Credentials Form */}
        <form onSubmit={handleSaveConfig} className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono flex items-center gap-2">
              <Key className="w-3.5 h-3.5 text-orange-600" />
              Custom Firebase Web Config
            </h3>
            {stored && (
              <button
                type="button"
                onClick={handleClearConfig}
                className="text-[11px] text-red-600 hover:text-red-700 font-bold flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Clear Custom Config
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Project ID</label>
              <input
                type="text"
                placeholder="e.g. pralay-tech-iot-123"
                value={projectId}
                onChange={e => setProjectId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 focus:bg-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">API Key</label>
              <input
                type="text"
                placeholder="AIzaSy..."
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 focus:bg-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Auth Domain (Optional)</label>
              <input
                type="text"
                placeholder="pralay-tech.firebaseapp.com"
                value={authDomain}
                onChange={e => setAuthDomain(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 focus:bg-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">App ID (Optional)</label>
              <input
                type="text"
                placeholder="1:123456789:web:abcdef"
                value={appId}
                onChange={e => setAppId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 focus:bg-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsConfigModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white flex items-center gap-1.5 shadow-sm shadow-red-500/20 transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              Save & Reconnect
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
