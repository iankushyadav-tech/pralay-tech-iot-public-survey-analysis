import React from 'react';
import {
  Thermometer,
  Droplets,
  Wind,
  Smile,
  Cpu,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Users,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Cloud,
  Layers,
  Filter
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export const DashboardView: React.FC = () => {
  const {
    responses,
    realResponses,
    demoResponses,
    activeResponses,
    viewMode,
    setViewMode,
    currentSensor,
    sensorHistory,
    isSimulationActive,
    publicSatisfactionRate,
    totalResponsesCount,
    realResponsesCount,
    demoResponsesCount,
    sentimentCounts,
    setActiveTab,
    addRandomDemoResponse,
    firebaseStatus,
    setIsConfigModalOpen
  } = useApp();

  // Helper for AQI color badge
  const getAqiColor = (aqi: number) => {
    if (aqi <= 50) return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Good' };
    if (aqi <= 100) return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: 'Moderate' };
    if (aqi <= 150) return { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', label: 'Unhealthy for Sensitive' };
    return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', label: 'Unhealthy' };
  };

  const aqiInfo = getAqiColor(currentSensor.airQualityIndex);
  const recentResponses = activeResponses.slice(0, 4);

  return (
    <div className="space-y-6">
      
      {/* Top Welcome / Hero Banner - Clean White with Red/Orange Accent Border */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-60 h-60 bg-orange-100/40 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-red-50 text-red-700 border border-red-200 tracking-wide uppercase">
                College Project 2026 • Team 02
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                Slot: 6:50 PM – 7:10 PM
              </span>
              <button
                onClick={() => setIsConfigModalOpen(true)}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold border transition-colors flex items-center gap-1 ${
                  firebaseStatus.mode === 'firestore_live'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-blue-50 text-blue-700 border-blue-300'
                }`}
              >
                <Cloud className="w-3 h-3" />
                <span>{firebaseStatus.mode === 'firestore_live' ? 'Firestore Live Sync' : 'Local Persistent Store'}</span>
              </button>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              IoT-Based Public Survey Response Analysis
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Correlating zero-hardware virtual environmental telemetry with live citizen survey feedback to guide urban municipal action and policy.
            </p>
            
            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setActiveTab('survey')}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white shadow-sm shadow-red-500/20 flex items-center gap-2 transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                Submit Citizen Survey
              </button>
              
              <button
                onClick={() => setActiveTab('insights')}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1.5 transition-all shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Smart Insights
              </button>

              <button
                onClick={() => setActiveTab('simulator')}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-xs flex items-center gap-2 transition-all"
              >
                <Cpu className="w-4 h-4 text-blue-600" />
                Virtual IoT Simulator
              </button>

              <button
                onClick={addRandomDemoResponse}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-200 flex items-center gap-1.5 transition-all shadow-xs"
                title="Inject realistic randomized survey response to demonstrate live dashboard re-calculation"
              >
                <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                + Add Demo Record
              </button>
            </div>
          </div>

          {/* Quick Status Box */}
          <div className="w-full lg:w-auto bg-slate-50 border border-slate-200 rounded-2xl p-4.5 flex sm:flex-row lg:flex-col gap-3 min-w-[250px] shadow-xs">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-slate-500 font-medium">IoT Sensor Hub:</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                {isSimulationActive ? 'SIMULATING' : 'PAUSED'}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-slate-200 pt-2 sm:border-t-0 sm:pt-0 lg:border-t lg:pt-2">
              <span className="text-xs text-slate-500 font-medium">Firestore Sync:</span>
              <span className="text-xs font-mono font-bold text-blue-700">
                {firebaseStatus.mode === 'firestore_live' ? 'Connected (Live)' : 'Persistent Local'}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-slate-200 pt-2 sm:border-t-0 sm:pt-0 lg:border-t lg:pt-2">
              <span className="text-xs text-slate-500 font-medium">Hardware Dependency:</span>
              <span className="text-[11px] font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                0% (Virtual Model)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Dataset Filter Toolbar (Keeps Real & Demo Data Strictly Separated!) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-red-600" />
          <span className="text-xs font-bold text-slate-800 font-mono uppercase">
            Data Source Scope:
          </span>
          <span className="text-xs text-slate-500">
            (Separates Real Citizen Submissions from Demo Seed Records)
          </span>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-1 rounded-xl text-xs font-mono">
          <button
            onClick={() => setViewMode('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              viewMode === 'all'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            All Data ({responses.length})
          </button>
          <button
            onClick={() => setViewMode('real_only')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              viewMode === 'real_only'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-700'
            }`}
          >
            Real User Only ({realResponsesCount})
          </button>
          <button
            onClick={() => setViewMode('demo_only')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              viewMode === 'demo_only'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-orange-700'
            }`}
          >
            Demo Seed Only ({demoResponsesCount})
          </button>
        </div>
      </div>

      {/* 6 Key Metric Cards - Crisp White with subtle borders and shadows */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        
        {/* Real User Responses (Separated from Demo Data) */}
        <div className="bg-white border-2 border-emerald-300 rounded-2xl p-4.5 shadow-xs relative overflow-hidden group hover:border-emerald-400 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-800">Real Citizen Data</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 font-mono">{realResponsesCount}</div>
          <div className="mt-1 flex items-center justify-between text-[11px]">
            <span className="text-emerald-700 font-semibold font-mono">100% Real Users</span>
            <span className="text-slate-400 font-mono">No mock</span>
          </div>
          <div className="mt-2.5 text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
            ACTUAL USER RESPONSES
          </div>
        </div>

        {/* Demo Seed Responses (Clearly Labeled DEMO DATA) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs relative overflow-hidden group hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Demo Seed Records</span>
            <div className="p-2 rounded-xl bg-orange-50 text-orange-600 border border-orange-200">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-orange-600 font-mono">{demoResponsesCount}</div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Pre-seeded Fixtures</span>
            <span className="text-orange-700 font-bold">Separated</span>
          </div>
          <div className="mt-2.5 text-[10px] font-mono text-orange-800 bg-orange-50 px-2 py-0.5 rounded border border-orange-200 font-bold">
            DEMO SEED DATA
          </div>
        </div>

        {/* Simulated Temperature */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs relative overflow-hidden group hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Simulated Temp</span>
            <div className="p-2 rounded-xl bg-red-50 text-red-600 border border-red-200">
              <Thermometer className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-slate-900 font-mono">{currentSensor.temperature}</span>
            <span className="text-sm font-bold text-slate-500">°C</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Ambient Sensor</span>
            <span className="text-orange-600 font-semibold">±0.2°C drift</span>
          </div>
          <div className="mt-2.5 text-[10px] font-mono text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 font-semibold">
            SIMULATED TELEMETRY
          </div>
        </div>

        {/* Simulated Humidity */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs relative overflow-hidden group hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Simulated Humidity</span>
            <div className="p-2 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-200">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-slate-900 font-mono">{currentSensor.humidity}</span>
            <span className="text-sm font-bold text-slate-500">% RH</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Relative Moisture</span>
            <span className="text-cyan-600 font-semibold">Optimum</span>
          </div>
          <div className="mt-2.5 text-[10px] font-mono text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 font-semibold">
            SIMULATED TELEMETRY
          </div>
        </div>

        {/* Simulated Air Quality (AQI) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs relative overflow-hidden group hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Simulated AQI</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-200">
              <Wind className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 font-mono">{currentSensor.airQualityIndex}</span>
            <span className="text-xs font-mono text-slate-500 font-bold">AQI</span>
          </div>
          <div className="mt-1">
            <span className={`inline-block text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${aqiInfo.bg} ${aqiInfo.text} ${aqiInfo.border}`}>
              {aqiInfo.label}
            </span>
          </div>
          <div className="mt-2 text-[10px] font-mono text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 font-semibold">
            PM2.5: {currentSensor.pm25} µg/m³
          </div>
        </div>

        {/* Public Satisfaction Percentage (For active dataset) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs relative overflow-hidden group hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Public Satisfaction</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <Smile className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-emerald-600 font-mono">{publicSatisfactionRate}</span>
            <span className="text-sm font-bold text-emerald-600/80">%</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Score (Active)</span>
            <span className="text-emerald-700 font-bold">
              {totalResponsesCount > 0 ? (activeResponses.reduce((s, r) => s + r.overallSatisfaction, 0) / totalResponsesCount).toFixed(1) : 0}/5.0 ★
            </span>
          </div>
          <div className="mt-2 text-[10px] font-mono text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 font-semibold">
            {sentimentCounts.positive} Pos • {sentimentCounts.negative} Neg
          </div>
        </div>

      </div>

      {/* Main Grid: Live Telemetry Stream vs Recent Survey Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Live Simulated IoT Sparkline & Environmental Correlation */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-red-600" />
                  Live Virtual Sensor Telemetry (AQI & Temp)
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                  SIMULATED STREAM
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Dynamic 30-reading sliding window simulated in-browser. Updates automatically every {currentSensor.sensorNodeId ? '3' : '3'}s.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('simulator')}
              className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1 transition-colors"
            >
              Control Simulator <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Sparkline Chart */}
          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sensorHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="aqiGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F97316" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#F97316" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="timestamp" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '0.75rem', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ color: '#64748B', fontFamily: 'monospace' }}
                  formatter={(val: any, name: any) => [
                    name === 'airQualityIndex' ? `${val} AQI` : `${val} °C`,
                    name === 'airQualityIndex' ? 'Simulated AQI' : 'Simulated Temp'
                  ]}
                />
                <Area type="monotone" dataKey="airQualityIndex" stroke="#EF4444" strokeWidth={2.5} fillOpacity={1} fill="url(#aqiGradient)" name="airQualityIndex" />
                <Area type="monotone" dataKey="temperature" stroke="#F97316" strokeWidth={2} fillOpacity={1} fill="url(#tempGradient)" name="temperature" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Correlation Insight */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-slate-800">Analytical Insight: </span>
              <span className="text-slate-600">
                {currentSensor.airQualityIndex > 100
                  ? 'Simulated AQI is elevated (>100). Survey records indicate public satisfaction drops by ~34% when localized air quality drops below moderate thresholds.'
                  : 'Simulated AQI is in healthy moderate range. Recent public survey responses demonstrate high approval for park green spaces and pedestrian amenities.'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Col: Recent Survey Activities */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-red-600" />
                  Recent Survey Feedback
                </h2>
                <p className="text-xs text-slate-500">
                  Showing {viewMode === 'real_only' ? 'Real User' : viewMode === 'demo_only' ? 'Demo Seed' : 'Active'} records
                </p>
              </div>
              <button
                onClick={() => setActiveTab('management')}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-bold"
              >
                View all ({totalResponsesCount})
              </button>
            </div>

            <div className="space-y-3">
              {recentResponses.map(resp => (
                <div
                  key={resp.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all text-xs"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-800">{resp.id}</span>
                      <span
                        className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase ${
                          resp.isDemo
                            ? 'bg-orange-50 text-orange-700 border border-orange-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {resp.isDemo ? 'Demo Data' : 'Real User'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500 font-bold font-mono">
                      <span>{'★'.repeat(resp.overallSatisfaction)}</span>
                      <span className="text-slate-300">{'★'.repeat(5 - resp.overallSatisfaction)}</span>
                    </div>
                  </div>

                  <p className="text-slate-700 italic line-clamp-2">
                    "{resp.suggestions || 'No detailed comments provided.'}"
                  </p>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span className="text-red-600 font-semibold">{resp.primaryConcern}</span>
                    <span>{resp.location || 'Anonymous'}</span>
                  </div>
                </div>
              ))}

              {recentResponses.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No survey responses recorded for current scope. Submit one below!
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setActiveTab('survey')}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              Take Survey Yourself <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
