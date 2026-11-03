import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Activity,
  Thermometer,
  Droplets,
  Wind,
  Volume2,
  CloudFog,
  Terminal,
  ShieldAlert,
  Sliders,
  Trees,
  Car,
  Factory
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { SimulationScenario } from '../types';

export const SimulatorView: React.FC = () => {
  const {
    currentSensor,
    sensorHistory,
    isSimulationActive,
    simulationSpeed,
    simulationScenario,
    selectedNode,
    telemetryLogs,
    startSimulation,
    stopSimulation,
    resetSimulation,
    stepSimulation,
    setSimulationSpeed,
    setSimulationScenario,
    setSelectedNode,
    clearTelemetryLogs
  } = useApp();

  const scenarios: { id: SimulationScenario; label: string; icon: React.ComponentType<{ className?: string }>; desc: string }[] = [
    { id: 'Urban Normal', label: 'Urban Normal', icon: Trees, desc: 'Moderate traffic, normal residential readings (AQI 40-95)' },
    { id: 'Peak Traffic', label: 'Peak Traffic', icon: Car, desc: 'Heavy vehicular exhaust and elevated horn noise (AQI 120-180)' },
    { id: 'Industrial Belt', label: 'Industrial Belt', icon: Factory, desc: 'High particulate PM2.5 & thermal load (AQI 160-240)' },
    { id: 'Eco Park Area', label: 'Eco Park Area', icon: Trees, desc: 'High humidity, pristine green canopy (AQI 20-45)' },
  ];

  const nodes = ['NODE-PRALAY-01 (Sector 62)', 'NODE-PRALAY-02 (Central Hub)', 'NODE-PRALAY-03 (Campus South)'];

  return (
    <div className="space-y-6">
      
      {/* Prominent Zero-Hardware Mandate Banner */}
      <div className="p-4 rounded-2xl bg-red-50 border-2 border-red-300 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-red-100 text-red-700 border border-red-200">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-red-700 tracking-wider uppercase bg-red-200/60 px-2 py-0.5 rounded">
                COMPLIANCE & DISCLOSURE
              </span>
              <span className="text-xs text-slate-500 font-mono">Academic Simulation Standard</span>
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight mt-0.5">
              VIRTUAL IoT SIMULATION - NO PHYSICAL HARDWARE CONNECTED
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Zero physical microcontrollers (e.g. ESP32/Arduino) are connected. Readings are purely synthetic mathematical models computed in-browser.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-slate-500">Virtual Device Status:</span>
          <span className="text-emerald-700 font-bold flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            {isSimulationActive ? 'EMULATING ONLINE' : 'EMULATION PAUSED'}
          </span>
        </div>
      </div>

      {/* Control Console Toolbar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-red-600" />
              Virtual IoT Simulator Control Console
            </h3>
            <p className="text-xs text-slate-500">Adjust simulation pace, environment conditions, and trigger manual ticks.</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {isSimulationActive ? (
              <button
                onClick={stopSimulation}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1.5 transition-all shadow-xs"
              >
                <Pause className="w-4 h-4" />
                Stop Simulation
              </button>
            ) : (
              <button
                onClick={startSimulation}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5 transition-all shadow-xs"
              >
                <Play className="w-4 h-4" />
                Start Simulation
              </button>
            )}

            <button
              onClick={stepSimulation}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 flex items-center gap-1.5 transition-all"
              title="Generate single sensor reading step"
            >
              <FastForward className="w-4 h-4 text-blue-600" />
              Step (1-Tick)
            </button>

            <button
              onClick={resetSimulation}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 flex items-center gap-1.5 transition-all"
              title="Reset sensor history to initial baseline"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Simulation
            </button>
          </div>
        </div>

        {/* Second Row: Scenario Selectors & Speed */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-slate-100">
          
          {/* Scenario Selector */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Environmental Emulation Scenario:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {scenarios.map(sc => {
                const isSelected = simulationScenario === sc.id;
                const ScIcon = sc.icon;
                return (
                  <button
                    key={sc.id}
                    onClick={() => setSimulationScenario(sc.id)}
                    className={`p-2.5 rounded-xl text-left border transition-all ${
                      isSelected
                        ? 'bg-red-50 border-red-500 text-slate-900 ring-2 ring-red-400/40 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <ScIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-red-600' : 'text-slate-500'}`} />
                      <span className="text-xs font-bold truncate">{sc.label}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 line-clamp-1">{sc.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Speed & Node */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-700 mb-1.5 font-bold">
                <span>Update Interval:</span>
                <span className="font-mono text-red-600 font-extrabold">{simulationSpeed / 1000}s</span>
              </div>
              <div className="flex items-center gap-2">
                {[1000, 2000, 3000, 5000].map(speed => (
                  <button
                    key={speed}
                    onClick={() => setSimulationSpeed(speed)}
                    className={`flex-1 py-1 rounded-lg text-xs font-mono font-bold border transition-all ${
                      simulationSpeed === speed
                        ? 'bg-red-600 text-white border-red-600 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {speed / 1000}s
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Virtual Node ID:
              </label>
              <select
                value={selectedNode}
                onChange={e => setSelectedNode(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-mono focus:border-red-500 focus:outline-none shadow-xs"
              >
                {nodes.map(n => (
                  <option key={n} value={n.split(' ')[0]}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>

        </div>
      </div>

      {/* Virtual Sensor Gauges / Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Virtual Temperature Sensor */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-600">Virtual Temp Sensor</span>
            <Thermometer className="w-4 h-4 text-red-600" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">{currentSensor.temperature}</span>
            <span className="text-sm font-bold text-slate-500">°C</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">Calculated Ambient Reading</p>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 via-orange-500 to-red-500 h-full"
              style={{ width: `${Math.min(100, Math.max(10, ((currentSensor.temperature - 10) / 35) * 100))}%` }}
            />
          </div>
          <div className="mt-2 text-[10px] font-mono text-slate-500 flex justify-between">
            <span>Range: 15°C</span>
            <span>Target: 45°C</span>
          </div>
        </div>

        {/* Virtual Humidity Sensor */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-600">Virtual Humidity</span>
            <Droplets className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">{currentSensor.humidity}</span>
            <span className="text-sm font-bold text-slate-500">%</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">Relative Moisture Density</p>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-cyan-500 h-full"
              style={{ width: `${currentSensor.humidity}%` }}
            />
          </div>
          <div className="mt-2 text-[10px] font-mono text-slate-500 flex justify-between">
            <span>Dry: 20%</span>
            <span>Humid: 95%</span>
          </div>
        </div>

        {/* Virtual Air Quality Sensor (AQI) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-600">Virtual AQI Sensor</span>
            <Wind className="w-4 h-4 text-purple-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">{currentSensor.airQualityIndex}</span>
            <span className="text-xs font-mono text-slate-500 font-bold">US AQI</span>
          </div>
          <p className="mt-1 text-[11px] font-bold text-red-600">Status: {currentSensor.status}</p>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full ${
                currentSensor.airQualityIndex > 150 ? 'bg-red-500' : currentSensor.airQualityIndex > 100 ? 'bg-orange-500' : currentSensor.airQualityIndex > 50 ? 'bg-amber-400' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, (currentSensor.airQualityIndex / 250) * 100)}%` }}
            />
          </div>
          <div className="mt-2 text-[10px] font-mono text-slate-500 flex justify-between">
            <span>Good (0)</span>
            <span>Hazard (300)</span>
          </div>
        </div>

        {/* Virtual PM2.5 & CO2 Sensor */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-600">Virtual PM2.5 & CO2</span>
            <CloudFog className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-lg font-extrabold text-slate-900 font-mono">
            {currentSensor.pm25} <span className="text-xs font-normal text-slate-500">µg/m³</span>
          </div>
          <div className="mt-1 text-sm font-bold text-slate-700 font-mono">
            {currentSensor.co2} <span className="text-xs font-normal text-slate-500">ppm CO2</span>
          </div>
          <div className="mt-3 text-[10px] font-mono text-slate-600 bg-slate-50 p-1.5 rounded border border-slate-200 font-semibold">
            Laser Scattering Model
          </div>
        </div>

        {/* Virtual Noise Level Sensor */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-600">Virtual Noise (dB)</span>
            <Volume2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">{currentSensor.noiseLevel}</span>
            <span className="text-sm font-bold text-slate-500">dB</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">Acoustic Microphone Model</p>
          <div className="mt-3 text-[10px] font-mono text-slate-600 bg-slate-50 p-1.5 rounded border border-slate-200 font-semibold">
            {currentSensor.noiseLevel > 75 ? 'Excessive Ambient Noise' : 'Acceptable Sound Level'}
          </div>
        </div>

      </div>

      {/* Multi-Sensor Real-Time Waveform Chart */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-red-600" />
              Live Virtual Sensor History (30 Timesteps)
            </h3>
            <p className="text-xs text-slate-500">Comparative multi-parameter virtual sensor streams.</p>
          </div>
          <div className="text-xs font-mono text-slate-600 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold">Node: {currentSensor.sensorNodeId}</span>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sensorHistory} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="timestamp" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '0.75rem', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                labelStyle={{ color: '#64748B', fontFamily: 'monospace' }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
              <Line type="monotone" dataKey="airQualityIndex" stroke="#EF4444" strokeWidth={2.5} dot={false} name="Air Quality (AQI)" />
              <Line type="monotone" dataKey="temperature" stroke="#F97316" strokeWidth={2} dot={false} name="Temperature (°C)" />
              <Line type="monotone" dataKey="humidity" stroke="#06B6D4" strokeWidth={2} dot={false} name="Humidity (%)" />
              <Line type="monotone" dataKey="noiseLevel" stroke="#10B981" strokeWidth={1.5} strokeDasharray="3 3" dot={false} name="Noise (dB)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Telemetry Log Terminal (Simulated MQTT Broker stream) */}
      <div className="bg-slate-900 border border-slate-300 rounded-2xl p-5 font-mono shadow-sm">
        <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-slate-100">Virtual MQTT Telemetry Packet Terminal</span>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
              simulated mqtt://pralay-bus:1883
            </span>
          </div>

          <button
            onClick={clearTelemetryLogs}
            className="text-[11px] text-slate-400 hover:text-white transition-colors"
          >
            Clear Log
          </button>
        </div>

        <div className="h-44 overflow-y-auto space-y-1.5 text-[11px] pr-2">
          {telemetryLogs.map(log => (
            <div key={log.id} className="flex items-start gap-2.5 leading-relaxed">
              <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
              <span
                className={`font-semibold shrink-0 ${
                  log.type === 'SIM_PACKET'
                    ? 'text-cyan-400'
                    : log.type === 'SURVEY_INGEST'
                    ? 'text-emerald-400'
                    : 'text-orange-400'
                }`}
              >
                [{log.type}]
              </span>
              <span className="text-slate-200">{log.message}</span>
              {log.details && <span className="text-slate-400 text-[10px] hidden sm:inline">({log.details})</span>}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
