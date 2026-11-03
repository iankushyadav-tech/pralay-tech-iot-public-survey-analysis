import React from 'react';
import {
  Clock,
  Cpu,
  Layers,
  ArrowDown,
  ArrowRight,
  Database,
  BarChart3,
  FileText,
  Sparkles,
  Globe,
  Radio,
  Users
} from 'lucide-react';
import { TEAM_MEMBERS } from '../data/initialData';

export const AboutView: React.FC = () => {
  const workflowSteps = [
    { id: 1, title: 'Virtual IoT Sensors', desc: 'Simulated stochastic models for Temp, Humidity, AQI, CO2 & Noise', icon: Cpu, color: 'text-red-600 bg-red-50 border-red-200' },
    { id: 2, title: 'Data Collection', desc: 'MQTT telemetry packet generation & stream buffering in memory', icon: Radio, color: 'text-orange-600 bg-orange-50 border-orange-200' },
    { id: 3, title: 'Public Survey Responses', desc: 'Validated citizen ratings & feedback ingested via responsive form', icon: Users, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { id: 4, title: 'Data Processing', desc: 'Client-side LocalStorage persistence, normalization & sanitization', icon: Database, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { id: 5, title: 'Data Analysis', desc: 'Sentiment segmentation, correlation indexing & demographic math', icon: BarChart3, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { id: 6, title: 'Interactive Dashboard', desc: 'Dynamic Recharts visual suite, gauge displays & telemetry stream', icon: Layers, color: 'text-purple-600 bg-purple-50 border-purple-200' },
    { id: 7, title: 'Reports and Insights', desc: 'Automated synthesis, exportable CSV/JSON & printable deliverables', icon: FileText, color: 'text-rose-600 bg-rose-50 border-rose-200' },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Hero Team Banner - Clean White with Red Accent */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 p-8 sm:p-10 shadow-xs">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 w-60 h-60 bg-orange-100/40 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-red-50 text-red-700 border border-red-200 uppercase tracking-wider">
                PRALAY TECH • TEAM NUMBER: 02
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-red-600" />
                Slot: 6:50 PM – 7:10 PM
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              IoT-Based Public Survey Response Analysis
            </h1>
            <p className="mt-2 text-base text-red-600 font-bold italic">
              "Innovating Beyond Limits."
            </p>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              A comprehensive college engineering project combining zero-hardware virtual IoT environmental sensor simulation with public opinion analytics, designed for modern urban governance.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center min-w-[200px] shadow-xs">
            <span className="text-xs font-mono uppercase text-slate-500 font-bold block">Team Strength</span>
            <span className="text-3xl font-black text-slate-900 font-mono mt-1 block">14</span>
            <span className="text-[11px] font-mono text-red-600 font-bold block mt-0.5">Engineering Students</span>
          </div>
        </div>
      </div>

      {/* Visual Interactive Project Workflow */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-[11px] font-mono font-bold text-red-700 bg-red-100 px-3 py-0.5 rounded-full border border-red-200 uppercase tracking-wider">
            Architecture Pipeline
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">Project Workflow Process</h2>
          <p className="text-xs text-slate-500 mt-1">
            Visual progression of data from synthetic sensor creation to executive report synthesis.
          </p>
        </div>

        {/* Workflow Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3 pt-4 relative">
          {workflowSteps.map((step, idx) => {
            const Icon = step.icon;
            const isLast = idx === workflowSteps.length - 1;

            return (
              <div key={step.id} className="relative flex flex-col items-center text-center">
                
                {/* Step Card */}
                <div className="w-full h-full p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all flex flex-col items-center justify-between group shadow-xs">
                  <div className="flex flex-col items-center">
                    <span className="w-5 h-5 rounded-full bg-white text-[10px] font-mono font-bold text-slate-600 mb-2 flex items-center justify-center border border-slate-200">
                      0{step.id}
                    </span>
                    <div className={`p-2.5 rounded-xl border mb-2.5 transition-transform group-hover:scale-110 ${step.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-xs font-bold text-slate-900 leading-tight mb-1">{step.title}</h3>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-snug mt-1">{step.desc}</p>
                </div>

                {/* Arrow connector for desktop */}
                {!isLast && (
                  <div className="hidden md:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-slate-400">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}

                {/* Arrow connector for mobile */}
                {!isLast && (
                  <div className="md:hidden my-2 text-slate-400">
                    <ArrowDown className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Educational Explanations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* What is IoT? */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-red-600">
            <Radio className="w-5 h-5" />
            <h3 className="text-sm font-bold text-slate-900">What is IoT?</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            The <strong>Internet of Things (IoT)</strong> refers to a collective network of connected physical and virtual devices, sensors, and actuators that exchange live data with systems over communication networks without requiring direct human interaction.
          </p>
        </div>

        {/* What is Public Survey Response Analysis? */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-orange-600">
            <BarChart3 className="w-5 h-5" />
            <h3 className="text-sm font-bold text-slate-900">Public Survey Analysis</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            A structured analytical methodology to systematically record citizen perspectives, opinions, satisfaction scores, and grievances regarding community infrastructure, environment, and civic service delivery.
          </p>
        </div>

        {/* Why is this project useful? */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-emerald-600">
            <Sparkles className="w-5 h-5" />
            <h3 className="text-sm font-bold text-slate-900">Why is this Useful?</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Physical sensor readings only show numbers; surveys only show feelings. By correlating sensor data with human survey feedback, municipal authorities can pinpoint exactly where environmental stress causes citizen dissatisfaction.
          </p>
        </div>

        {/* How does virtual simulation work? */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-blue-600">
            <Cpu className="w-5 h-5" />
            <h3 className="text-sm font-bold text-slate-900">Virtual Sensor Simulation</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Since no physical hardware components were accessible, our team engineered an in-browser mathematical engine implementing stochastic random-walk formulas modeling thermal, humidity, and laser particulate scattering scenarios.
          </p>
        </div>

        {/* How is survey data collected? */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-purple-600">
            <Database className="w-5 h-5" />
            <h3 className="text-sm font-bold text-slate-900">Data Ingestion & Storage</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Responses are gathered through a clean, accessible interactive form with client-side validation. All submissions are safely persisted within browser LocalStorage without tracking personal identifying credentials (PII).
          </p>
        </div>

        {/* Future Scope */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-amber-600">
            <Globe className="w-5 h-5" />
            <h3 className="text-sm font-bold text-slate-900">Future Scope & Scalability</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Upgrading the virtual hub with physical ESP32 / Arduino microcontrollers over LoRaWAN or NB-IoT, implementing Edge AI anomaly detection, and connecting with live municipal GIS databases for smart city automation.
          </p>
        </div>

      </div>

      {/* 14 Team Members Grid */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold text-red-700 uppercase bg-red-100 px-2.5 py-0.5 rounded border border-red-200">
                Team Credits
              </span>
              <span className="text-xs text-slate-500 font-mono">14 Engineering Contributors</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 mt-1">PRALAY TECH Project Team</h2>
          </div>

          <div className="text-xs font-mono text-slate-600 font-bold">
            Presentation Time: <strong className="text-red-600">6:50 PM – 7:10 PM</strong>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {TEAM_MEMBERS.map(member => (
            <div
              key={member.id}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-red-300 transition-all flex flex-col justify-between group shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400 group-hover:text-red-600 transition-colors">
                    MEMBER #{String(member.id).padStart(2, '0')}
                  </span>
                  <div className="w-2 h-2 rounded-full bg-red-400 group-hover:scale-125 transition-transform" />
                </div>
                
                <h3 className="text-sm font-black text-slate-900 group-hover:text-red-600 transition-colors">
                  {member.name}
                </h3>
                <p className="text-[11px] font-bold text-blue-700 mt-0.5 font-mono">
                  {member.role}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-200/80 text-[10px] text-slate-600 leading-relaxed font-medium">
                {member.contribution}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
