import React from 'react';
import { ShieldAlert, Cpu, Activity } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ZeroHardwareBanner: React.FC = () => {
  const { isSimulationActive, currentSensor, simulationScenario } = useApp();

  return (
    <div className="bg-amber-50/90 border-b border-amber-200 px-4 py-2.5 text-xs text-amber-900">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 font-medium">
          <span className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-800 border border-amber-300 px-2.5 py-0.5 rounded font-mono font-bold tracking-wide uppercase text-[11px]">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
            VIRTUAL IoT SIMULATION • NO PHYSICAL HARDWARE CONNECTED
          </span>
          <span className="hidden sm:inline text-amber-800/80">
            All environmental telemetry readings are algorithmically generated virtual data points for academic evaluation.
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px]">
          <div className="flex items-center gap-1.5 text-amber-900">
            <Cpu className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-amber-700">Node:</span>
            <span className="text-blue-700 font-bold">{currentSensor.sensorNodeId}</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-amber-900 border-l border-amber-200 pl-3">
            <Activity className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-amber-700">Scenario:</span>
            <span className="text-emerald-700 font-semibold">{simulationScenario}</span>
          </div>

          <div className="flex items-center gap-1.5 border-l border-amber-200 pl-3">
            <span className={`w-2 h-2 rounded-full ${isSimulationActive ? 'bg-emerald-600 animate-ping' : 'bg-amber-600'}`} />
            <span className={isSimulationActive ? 'text-emerald-700 font-semibold' : 'text-amber-700 font-semibold'}>
              {isSimulationActive ? 'STREAMING SIMULATION' : 'SIMULATION PAUSED'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
