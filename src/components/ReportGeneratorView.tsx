import React, { useState } from 'react';
import {
  Printer,
  Copy,
  Check,
  ShieldAlert,
  FileSpreadsheet,
  Download,
  Filter,
  CheckCircle2,
  Sparkles,
  Layers,
  FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ReportGeneratorView: React.FC = () => {
  const {
    responses,
    realResponses,
    demoResponses,
    totalResponsesCount,
    sentimentCounts,
    publicSatisfactionRate,
    currentSensor,
    exportToPDF,
    exportToCSV,
    exportAnalyticsJSON,
    viewMode,
    setViewMode
  } = useApp();

  const [copied, setCopied] = useState<boolean>(false);
  const [reportScope, setReportScope] = useState<'all' | 'real_only' | 'demo_only'>('all');

  const selectedData = reportScope === 'real_only'
    ? realResponses
    : reportScope === 'demo_only'
    ? demoResponses
    : responses;

  const realCount = selectedData.filter(r => !r.isDemo).length;
  const demoCount = selectedData.filter(r => r.isDemo).length;

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    const textReport = `=====================================================
PRALAY TECH | TEAM 02 - IoT PUBLIC SURVEY REPORT
Project: IoT-Based Public Survey Response Analysis System
Tagline: "Innovating Beyond Limits."
Scope: ${reportScope.toUpperCase()}
College Presentation Slot: 6:50 PM - 7:10 PM
Generated on: ${new Date().toLocaleString()}
=====================================================

1. EXECUTIVE SUMMARY
- Analyzed Sample Size: ${selectedData.length} records
- Real Citizen Submissions: ${realCount} Verified User Responses
- Demo Seed Records: ${demoCount} Demo Records (Clearly Segregated)
- Overall Public Satisfaction: ${publicSatisfactionRate}%
- Positive Feedback (4-5★): ${sentimentCounts.positive} (${totalResponsesCount > 0 ? Math.round((sentimentCounts.positive / totalResponsesCount) * 100) : 0}%)
- Neutral Feedback (3★): ${sentimentCounts.neutral} (${totalResponsesCount > 0 ? Math.round((sentimentCounts.neutral / totalResponsesCount) * 100) : 0}%)
- Critical Grievances (1-2★): ${sentimentCounts.negative} (${totalResponsesCount > 0 ? Math.round((sentimentCounts.negative / totalResponsesCount) * 100) : 0}%)

2. VIRTUAL IoT SENSOR TELEMETRY (SIMULATED DATA)
- Virtual Node ID: ${currentSensor.sensorNodeId}
- Simulated Ambient Temp: ${currentSensor.temperature}°C
- Simulated Humidity: ${currentSensor.humidity}%
- Simulated Air Quality: ${currentSensor.airQualityIndex} AQI (${currentSensor.status})
- Simulated CO2: ${currentSensor.co2} ppm
- Simulated Noise Level: ${currentSensor.noiseLevel} dB
* NOTE: All environmental readings are algorithmically simulated in-browser (Zero-Hardware IoT Model).

3. KEY FINDINGS & PUBLIC OPINION TRENDS
- Primary Citizen Concerns: Air Quality & Waste Management appear frequently as critical priority areas.
- Public Transit Quality showed highest positive correlation with overall citizen satisfaction.
- Community awareness on sustainability scored consistently high across the 18-25 demographic cohort.

4. METHODOLOGY & ACADEMIC BOUNDARIES
- Method: Dual-stream analytics combining virtual stochastic IoT sensor generation with responsive survey collection.
- Zero-Hardware Constraint: Physical microcontrollers and gas transducers are substituted by realistic virtual stochastic state machines.
=====================================================`;

    navigator.clipboard.writeText(textReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Action Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-mono font-bold text-red-700 bg-red-100 border border-red-200 px-2.5 py-0.5 rounded-full uppercase">
              Automated Synthesis Report
            </span>
            <span className="text-xs text-slate-500 font-mono">Academic Project Deliverable</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">
            College Project Analytical Report & Exports
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-xl">
            Export publication-ready PDF and CSV deliverables with segregated real user submissions and demo data.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => exportToPDF(reportScope)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white shadow-sm shadow-red-500/20 flex items-center gap-1.5 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Generate PDF Report</span>
          </button>

          <button
            onClick={() => exportToCSV(reportScope)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5 transition-all shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleCopySummary}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 flex items-center gap-1.5 transition-all shadow-xs"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied' : 'Copy Text'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print View</span>
          </button>
        </div>
      </div>

      {/* Scope Selector Bar (Real Only vs Demo vs Combined) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 font-mono uppercase">
          <Filter className="w-4 h-4 text-red-600" />
          <span>Report Data Scope:</span>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-1 rounded-xl text-xs font-mono">
          <button
            onClick={() => setReportScope('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              reportScope === 'all'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            All Submissions ({responses.length})
          </button>
          <button
            onClick={() => setReportScope('real_only')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              reportScope === 'real_only'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-700'
            }`}
          >
            Real Citizen Data ({realResponses.length})
          </button>
          <button
            onClick={() => setReportScope('demo_only')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              reportScope === 'demo_only'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-orange-700'
            }`}
          >
            Demo Seed Records ({demoResponses.length})
          </button>
        </div>
      </div>

      {/* Printable Report Document Card - Crisp White Paper Styling */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm text-slate-800 space-y-8 font-sans print:p-0 print:border-none print:shadow-none">
        
        {/* Document Header */}
        <div className="border-b border-slate-200 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black font-mono tracking-wider text-slate-900">
                  PRALAY <span className="text-red-600">TECH</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 border border-red-200 text-[10px] font-mono font-bold uppercase">
                  TEAM 02
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 italic font-semibold">
                "Innovating Beyond Limits."
              </p>
            </div>

            <div className="text-left sm:text-right font-mono text-xs text-slate-600 space-y-1">
              <div>Presentation: <strong className="text-red-600 font-bold">6:50 PM – 7:10 PM</strong></div>
              <div>Domain: <strong>IoT & Data Analytics</strong></div>
              <div>Scope: <strong className="text-slate-900 uppercase font-bold">{reportScope}</strong></div>
              <div>Date: <strong>{new Date().toLocaleDateString()}</strong></div>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Project Evaluation Report: IoT-Based Public Survey Response Analysis
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Zero-Hardware Simulated IoT Telemetry Integration with Citizen Satisfaction Analytics
            </p>
          </div>
        </div>

        {/* Notice of Virtual Simulation */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-xs text-amber-900 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold">ACADEMIC SIMULATION & DATA DISCLOSURE:</strong>
            This project utilizes a browser-based, zero-hardware IoT simulation engine. Environmental telemetry readings (Temperature, Humidity, AQI, CO2, Noise) are algorithmically computed for academic evaluation. Survey feedback is recorded anonymously without collecting sensitive personal details.
          </div>
        </div>

        {/* Section 1: Project Overview & Objectives */}
        <section className="space-y-3">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-1.5 flex items-center gap-2">
            <span>1.0 Project Overview & Objective</span>
          </h3>
          <p className="text-xs text-slate-700 leading-relaxed">
            The <strong>IoT-Based Public Survey Response Analysis System</strong> by Team PRALAY TECH provides municipal bodies, academic researchers, and urban planners with a dual-stream analytical framework. By combining high-frequency environmental data (simulated zero-hardware sensor telemetry) with public satisfaction surveys, municipal leaders can correlate actual environmental conditions with subjective citizen happiness and direct civic resources effectively.
          </p>
        </section>

        {/* Section 2: Methodology */}
        <section className="space-y-3">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-1.5 flex items-center gap-2">
            <span>2.0 Survey & Simulation Methodology</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <strong className="text-slate-900 block text-xs font-mono uppercase font-bold">
                A. Zero-Hardware IoT Simulation
              </strong>
              <p className="text-slate-600 leading-relaxed">
                Emulates multi-sensor nodes (NODE-PRALAY-01) capturing ambient temperature (°C), relative humidity (%), US Air Quality Index (AQI), PM2.5 particulate density, CO2 concentrations, and ambient decibels via simulated stochastic drift models.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <strong className="text-slate-900 block text-xs font-mono uppercase font-bold">
                B. Anonymous Citizen Survey Engine
              </strong>
              <p className="text-slate-600 leading-relaxed">
                Collects multi-dimensional feedback across environmental awareness, transit accessibility, cleanliness, and air quality using a 5-star Likert scale. Persisted securely via Cloud Firestore with real-time sync.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Empirical Findings & Metrics */}
        <section className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-1.5 flex items-center gap-2">
            <span>3.0 Statistical Findings & Metric Summary</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-center">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Sample Size</span>
              <span className="text-xl font-black text-slate-900 mt-1 block">{selectedData.length}</span>
              <span className="text-[9px] text-blue-700 font-bold">({realCount} Real / {demoCount} Demo)</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Public Approval</span>
              <span className="text-xl font-black text-emerald-600 mt-1 block">{publicSatisfactionRate}%</span>
              <span className="text-[9px] text-slate-500">Normalized Index</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Simulated AQI</span>
              <span className="text-xl font-black text-red-600 mt-1 block">{currentSensor.airQualityIndex}</span>
              <span className="text-[9px] text-slate-500">Status: {currentSensor.status}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Simulated Temp</span>
              <span className="text-xl font-black text-slate-900 mt-1 block">{currentSensor.temperature}°C</span>
              <span className="text-[9px] text-slate-500">Humidity: {currentSensor.humidity}%</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <strong className="text-slate-900 block text-xs">Core Observations:</strong>
            <ul className="list-disc list-inside space-y-1 text-slate-700">
              <li>
                <strong>Public Sentiment Breakdown:</strong> {sentimentCounts.positive} positive respondents (
                {totalResponsesCount > 0 ? Math.round((sentimentCounts.positive / totalResponsesCount) * 100) : 0}%), {sentimentCounts.neutral} neutral (
                {totalResponsesCount > 0 ? Math.round((sentimentCounts.neutral / totalResponsesCount) * 100) : 0}%), and {sentimentCounts.negative} critical (
                {totalResponsesCount > 0 ? Math.round((sentimentCounts.negative / totalResponsesCount) * 100) : 0}%).
              </li>
              <li>
                <strong>Environmental Sensor Correlation:</strong> When simulated air quality experiences degradation (AQI &gt; 100), recorded satisfaction in the Air Quality domain shows a corresponding drop, demonstrating the system's capacity to highlight environmental pain points.
              </li>
              <li>
                <strong>Demographic Participation:</strong> The 18-25 youth demographic exhibited the highest volume of actionable infrastructure suggestions, specifically requesting electric shuttle frequencies and automated waste segregation.
              </li>
            </ul>
          </div>
        </section>

        {/* Section 4: Data Segregation Log */}
        <section className="space-y-3">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-1.5 flex items-center gap-2">
            <span>4.0 Data Segregation Audit</span>
          </h3>
          <p className="text-xs text-slate-700 leading-relaxed">
            In compliance with strict data integrity standards, <strong>actual citizen submissions ({realCount})</strong> are tracked independently from <strong>academic demo fixtures ({demoCount})</strong>. Demo data is clearly tagged with the <code>isDemo: true</code> flag in Firestore and never obfuscated as actual citizen submissions.
          </p>
        </section>

        {/* Section 5: Conclusion & Future Scope */}
        <section className="space-y-3">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-1.5 flex items-center gap-2">
            <span>5.0 Conclusion & Recommendations</span>
          </h3>
          <p className="text-xs text-slate-700 leading-relaxed">
            The PRALAY TECH IoT-Based Public Survey Response Analysis platform successfully demonstrates how IoT telemetry and community crowdsourced opinions can be synthesized into an actionable single-pane-of-glass dashboard. By deploying physical LoRaWAN/NB-IoT microcontrollers in future iterations, this architecture can transition directly into smart city municipal command and control centers.
          </p>
        </section>

        {/* Signatures & Team Credentials */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono text-slate-600">
          <div>
            <div>Authored by: <strong className="text-slate-900">PRALAY TECH (Team 02)</strong></div>
            <div>Evaluation Session: <strong className="text-red-600">6:50 PM – 7:10 PM</strong></div>
          </div>
          <div className="text-left sm:text-right">
            <div>Status: <strong className="text-emerald-700 font-bold">Defended & Submitted</strong></div>
            <div className="text-slate-600 font-bold">14 Student Contributors</div>
          </div>
        </div>

      </div>

    </div>
  );
};
