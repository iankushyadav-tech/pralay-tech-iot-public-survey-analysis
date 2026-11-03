import React, { useState, useEffect } from 'react';
import {
  Presentation,
  ChevronLeft,
  ChevronRight,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Cpu,
  Layers,
  ArrowRight,
  Users,
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TEAM_MEMBERS } from '../data/initialData';

export const PresentationMode: React.FC = () => {
  const { setActiveTab } = useApp();
  const [currentSlide, setCurrentSlide] = useState<number>(1);
  const totalSlides = 6;

  // Presentation countdown timer (20 minutes = 1200 seconds)
  const [secondsRemaining, setSecondsRemaining] = useState<number>(1200);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, secondsRemaining]);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(remainingSecs).padStart(2, '0')}`;
  };

  const nextSlide = () => setCurrentSlide(prev => Math.min(totalSlides, prev + 1));
  const prevSlide = () => setCurrentSlide(prev => Math.max(1, prev - 1));

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Top Presentation Bar with Timer */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-red-100 text-red-700 border border-red-200">
            <Presentation className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase font-bold text-red-600">
                Evaluation Deck • Team 02
              </span>
              <span className="text-xs text-slate-500 font-mono">Slot: 6:50 PM – 7:10 PM (20 Mins)</span>
            </div>
            <h2 className="text-sm font-bold text-slate-900">College Project Presentation Helper</h2>
          </div>
        </div>

        {/* 20-Minute Defense Countdown Timer */}
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl font-mono shadow-xs">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Clock className="w-3.5 h-3.5 text-red-600" />
            <span className="font-bold">Time Left:</span>
          </div>
          <span className={`text-base font-black ${secondsRemaining < 300 ? 'text-red-600 animate-pulse' : 'text-emerald-700'}`}>
            {formatTimer(secondsRemaining)}
          </span>
          <button
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className="p-1 rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 ml-1 text-xs"
            title={isTimerRunning ? 'Pause Timer' : 'Start Timer'}
          >
            {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => {
              setIsTimerRunning(false);
              setSecondsRemaining(1200);
            }}
            className="p-1 rounded bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-700 border border-slate-200 text-xs"
            title="Reset to 20 mins"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Slide Navigation Controls */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-500 mr-2">
            Slide <strong className="text-slate-900">{currentSlide}</strong> / {totalSlides}
          </span>
          <button
            onClick={prevSlide}
            disabled={currentSlide === 1}
            className="p-1.5 rounded-lg bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-300 shadow-xs"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextSlide}
            disabled={currentSlide === totalSlides}
            className="p-1.5 rounded-lg bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-300 shadow-xs"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Slide Canvas - Crisp White Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm min-h-[440px] flex flex-col justify-between relative overflow-hidden">
        
        {/* Slide 1: Title & Team */}
        {currentSlide === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-red-100 text-red-700 border border-red-200 uppercase">
                Slide 01 • Introduction
              </span>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl font-mono font-black text-slate-900">
                  PRALAY <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">TECH</span>
                </span>
                <span className="bg-red-100 text-red-700 border border-red-200 text-xs font-bold px-2.5 py-0.5 rounded-full font-mono uppercase">
                  TEAM 02
                </span>
              </div>
              <p className="text-lg text-red-600 font-bold italic">
                "Innovating Beyond Limits."
              </p>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-4 tracking-tight">
                IoT-Based Public Survey Response Analysis System
              </h1>
              <p className="text-xs text-slate-600 mt-2 max-w-2xl leading-relaxed">
                Presentation Time: <strong>6:50 PM – 7:10 PM</strong> • Domain: Internet of Things (IoT) & Data Analytics
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <span className="text-xs font-mono uppercase font-bold text-slate-500 block mb-2">
                14 Student Engineers:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {TEAM_MEMBERS.map(m => (
                  <div key={m.id} className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
                    <span className="font-bold text-slate-900">{m.name}</span>
                    <span className="block text-[10px] text-slate-500 truncate">{m.role}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Slide 2: Problem Statement & Project Objective */}
        {currentSlide === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-orange-100 text-orange-800 border border-orange-200 uppercase">
                Slide 02 • Problem & Objective
              </span>
            </div>

            <h2 className="text-2xl font-black text-slate-900">
              The Urban Disconnect: Environmental Metrics vs Public Perception
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-mono uppercase font-bold text-red-700 block">The Challenge:</span>
                <p className="text-slate-600 leading-relaxed">
                  Traditional civic management relies either solely on physical IoT sensors (which miss human sentiment) or sporadic surveys (which lack objective environmental context).
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-mono uppercase font-bold text-emerald-700 block">Our Solution:</span>
                <p className="text-slate-600 leading-relaxed">
                  An integrated dual-stream platform combining virtual IoT environmental sensors (Temperature, Humidity, AQI, PM2.5, CO2, Noise) with real-time anonymous public satisfaction surveys.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-red-600 shrink-0" />
              <span>
                <strong>Core Objective:</strong> Provide municipal authorities with verified analytical evidence to prioritize high-impact urban interventions.
              </span>
            </div>
          </div>
        )}

        {/* Slide 3: Zero-Hardware Architecture */}
        {currentSlide === 3 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-100 text-blue-800 border border-blue-200 uppercase">
                Slide 03 • Zero-Hardware IoT Simulation
              </span>
            </div>

            <h2 className="text-2xl font-black text-slate-900">
              Zero-Hardware Architecture & Academic Compliance
            </h2>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-900 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Zero-Hardware Mandate:</strong> We do not have physical IoT components. This simulation runs 100% in-browser with zero hardware dependencies, clearly labelled as simulated telemetry.
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-mono font-bold text-slate-900 block">1. Mathematical Model</span>
                <p className="text-slate-600 mt-1">Stochastic random-walk algorithms emulating realistic meteorological & AQI patterns.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-mono font-bold text-slate-900 block">2. Scenario Presets</span>
                <p className="text-slate-600 mt-1">Switch dynamically between Urban Normal, Peak Traffic, Industrial Belt, and Eco Park.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-mono font-bold text-slate-900 block">3. MQTT Telemetry Log</span>
                <p className="text-slate-600 mt-1">Emulated message broker broadcasting payload packets with microsecond timestamps.</p>
              </div>
            </div>
          </div>
        )}

        {/* Slide 4: Live Demo Pathways */}
        {currentSlide === 4 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-100 text-purple-800 border border-purple-200 uppercase">
                Slide 04 • Live Interactive Showcase
              </span>
            </div>

            <h2 className="text-2xl font-black text-slate-900">
              Interactive System Modules (Click to Open Live)
            </h2>

            <p className="text-xs text-slate-600">
              During our presentation, evaluators can inspect each live module running in real-time:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <button
                onClick={() => setActiveTab('simulator')}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-red-400 text-left transition-all group shadow-xs"
              >
                <div className="flex items-center justify-between mb-2">
                  <Cpu className="w-5 h-5 text-red-600 group-hover:scale-110 transition-transform" />
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-red-600" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Virtual IoT Simulator</h3>
                <p className="text-[11px] text-slate-500 mt-1">Gauges, Start/Stop controls, Scenario triggers, and live telemetry log.</p>
              </button>

              <button
                onClick={() => setActiveTab('survey')}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-red-400 text-left transition-all group shadow-xs"
              >
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-5 h-5 text-red-600 group-hover:scale-110 transition-transform" />
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-red-600" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Citizen Survey Form</h3>
                <p className="text-[11px] text-slate-500 mt-1">Multi-criteria ratings, anonymous submission, and real-time validation.</p>
              </button>

              <button
                onClick={() => setActiveTab('visualizations')}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-red-400 text-left transition-all group shadow-xs"
              >
                <div className="flex items-center justify-between mb-2">
                  <Layers className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Recharts Visualizations</h3>
                <p className="text-[11px] text-slate-500 mt-1">Pie charts, Bar charts, Area curves, and Radar profile charts.</p>
              </button>
            </div>
          </div>
        )}

        {/* Slide 5: Data Analytics & Findings */}
        {currentSlide === 5 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">
                Slide 05 • Key Analytical Insights
              </span>
            </div>

            <h2 className="text-2xl font-black text-slate-900">
              Data Discoveries & Correlation Matrix
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-slate-900 font-bold block">1. Inverse Air Quality Perception</span>
                <p className="text-slate-600 leading-relaxed">
                  When simulated AQI crosses 100 (Unhealthy), air satisfaction drops by over 34%, showing strong alignment between sensor data and public complaints.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-slate-900 font-bold block">2. Public Transit as Quality Catalyst</span>
                <p className="text-slate-600 leading-relaxed">
                  Citizens rating public transit satisfaction 4+ stars exhibited a 2.4x higher overall municipal approval rating.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
              <strong>Data Pipeline Features:</strong> Export to CSV, JSON analytics reports, search & filtering by demographic or concern, and response deletion logic.
            </div>
          </div>
        )}

        {/* Slide 6: Conclusion & Future Scope */}
        {currentSlide === 6 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-100 text-amber-800 border border-amber-200 uppercase">
                Slide 06 • Conclusion & Team Sign-Off
              </span>
            </div>

            <h2 className="text-2xl font-black text-slate-900">
              Conclusion & Future Roadmap
            </h2>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-3">
              <p className="leading-relaxed">
                The <strong>PRALAY TECH IoT-Based Public Survey Response Analysis System</strong> proves that combining automated sensor streams with community opinion analytics is the ideal architectural blueprint for next-generation smart cities.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-slate-600 font-mono text-[11px]">
                <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                  <span className="text-blue-700 font-bold block">Phase 2:</span> Physical ESP32 & LoRaWAN hardware
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                  <span className="text-red-600 font-bold block">Phase 3:</span> Edge AI anomaly detection
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                  <span className="text-emerald-700 font-bold block">Phase 4:</span> City GIS Municipal integration
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div className="text-xs font-mono text-slate-500">
                Team: <strong className="text-slate-900">PRALAY TECH (Team 02)</strong> • "Innovating Beyond Limits."
              </div>
              <button
                onClick={() => setActiveTab('dashboard')}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-red-600 to-orange-500 text-white flex items-center gap-2 shadow-xs"
              >
                Return to Dashboard <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Bottom Slide Navigator Bar */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500">
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalSlides }, (_, i) => i + 1).map(step => (
              <button
                key={step}
                onClick={() => setCurrentSlide(step)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                  currentSlide === step
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
              >
                {step}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              disabled={currentSlide === 1}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 border border-slate-300 text-xs font-bold shadow-xs"
            >
              Previous
            </button>
            <button
              onClick={nextSlide}
              disabled={currentSlide === totalSlides}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white disabled:opacity-40 text-xs font-bold shadow-xs"
            >
              Next Slide
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
