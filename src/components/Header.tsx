import React, { useState, useEffect } from 'react';
import {
  Zap,
  Clock,
  FileSpreadsheet,
  Layers,
  Menu,
  X,
  Play,
  Pause,
  Award,
  Cloud,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface HeaderProps {
  onToggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu, isMobileMenuOpen }) => {
  const {
    activeTab,
    setActiveTab,
    isSimulationActive,
    toggleSimulation,
    firebaseStatus,
    setIsConfigModalOpen,
    isAdminAuthenticated
  } = useApp();

  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3.5">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            {/* PRALAY TECH Emblem */}
            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-red-600 via-orange-500 to-amber-500 p-[2px] shadow-md shadow-red-500/10 group-hover:shadow-red-500/25 transition-all duration-300">
              <div className="w-full h-full bg-white rounded-[9px] flex items-center justify-center relative overflow-hidden">
                <Zap className="w-5 h-5 text-red-600 group-hover:scale-110 transition-transform z-10" />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-orange-400 rounded-full blur-[2px]" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-wider text-slate-900 font-mono">
                  PRALAY <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">TECH</span>
                </span>
                <span className="bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono uppercase tracking-wider">
                  TEAM 02
                </span>
              </div>
              <p className="text-[11px] text-slate-500 tracking-wide font-medium flex items-center gap-1.5">
                <span className="text-red-600 font-semibold italic">"Innovating Beyond Limits."</span>
                <span className="hidden md:inline text-slate-300">•</span>
                <span className="hidden md:inline text-slate-500">IoT Public Survey Analysis</span>
              </p>
            </div>
          </button>
        </div>

        {/* Center Presentation Time Badge & Live Clock */}
        <div className="hidden lg:flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 shadow-xs">
          <div className="flex items-center gap-2 border-r border-slate-200 pr-3">
            <div className="p-1.5 rounded-lg bg-red-100 text-red-700 border border-red-200">
              <Award className="w-4 h-4 text-red-600" />
            </div>
            <div className="text-left">
              <div className="text-[10px] font-mono uppercase text-slate-500 font-semibold tracking-wider">College Defense</div>
              <div className="text-xs font-bold text-red-600 font-mono">6:50 PM – 7:10 PM</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-mono text-xs text-slate-700 font-bold">{currentTime || '18:50:00'}</span>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Firebase Cloud Connection Trigger */}
          <button
            onClick={() => setIsConfigModalOpen(true)}
            className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border shadow-xs ${
              firebaseStatus.mode === 'firestore_live'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                : 'bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100'
            }`}
            title="Firebase Firestore connection settings and status"
          >
            <Cloud className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">
              {firebaseStatus.mode === 'firestore_live' ? 'FIRESTORE CLOUD' : 'LOCAL PERSISTENT'}
            </span>
          </button>

          {/* Quick Simulation Toggle */}
          <button
            onClick={toggleSimulation}
            title={isSimulationActive ? 'Pause IoT Simulation' : 'Resume IoT Simulation'}
            className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border shadow-xs ${
              isSimulationActive
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                : 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100'
            }`}
          >
            {isSimulationActive ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>IOT STREAMING</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>IOT PAUSED</span>
              </>
            )}
          </button>

          {/* Quick Survey CTA */}
          <button
            onClick={() => setActiveTab('survey')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
              activeTab === 'survey'
                ? 'bg-red-700 text-white ring-2 ring-red-400'
                : 'bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white shadow-red-500/20'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Fill Survey</span>
            <span className="sm:hidden">Survey</span>
          </button>

          {/* Admin Panel Quick Link */}
          <button
            onClick={() => setActiveTab('admin')}
            className={`hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
              activeTab === 'admin'
                ? 'bg-red-50 text-red-700 border-red-300'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
            }`}
            title="Secure Admin Panel"
          >
            {isAdminAuthenticated ? (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span>Admin</span>
          </button>

          {/* Presentation Mode Button */}
          <button
            onClick={() => setActiveTab('presentation')}
            className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
              activeTab === 'presentation'
                ? 'bg-red-50 text-red-700 border-red-300'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-orange-500" />
            <span>Deck</span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-lg bg-slate-100 border border-slate-300 text-slate-700 hover:text-slate-900"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>
    </header>
  );
};
