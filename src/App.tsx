/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ZeroHardwareBanner } from './components/ZeroHardwareBanner';
import { DashboardView } from './components/DashboardView';
import { SimulatorView } from './components/SimulatorView';
import { SurveyFormView } from './components/SurveyFormView';
import { AnalyticsView } from './components/AnalyticsView';
import { VisualizationsView } from './components/VisualizationsView';
import { SmartInsightsView } from './components/SmartInsightsView';
import { DataManagementView } from './components/DataManagementView';
import { AdminPanelView } from './components/AdminPanelView';
import { ReportGeneratorView } from './components/ReportGeneratorView';
import { AboutView } from './components/AboutView';
import { PresentationMode } from './components/PresentationMode';
import { FirebaseConfigModal } from './components/FirebaseConfigModal';
import { Zap } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeTab } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'simulator':
        return <SimulatorView />;
      case 'survey':
        return <SurveyFormView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'visualizations':
        return <VisualizationsView />;
      case 'insights':
        return <SmartInsightsView />;
      case 'management':
        return <DataManagementView />;
      case 'admin':
        return <AdminPanelView />;
      case 'report':
        return <ReportGeneratorView />;
      case 'about':
        return <AboutView />;
      case 'presentation':
        return <PresentationMode />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans selection:bg-red-500 selection:text-white">
      
      {/* Zero-Hardware Compliance & Simulation Notice Banner */}
      <ZeroHardwareBanner />

      {/* Main App Navigation Header */}
      <Header
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        
        {/* Navigation Sidebar */}
        <Sidebar
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Main Content Viewport */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderContent()}
        </main>
      </div>

      {/* Interactive Firebase Cloud Setup & Inspection Modal */}
      <FirebaseConfigModal />

      {/* Clean White Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 text-xs text-slate-500 print:hidden shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-orange-500 p-[1px] shadow-sm">
              <div className="w-full h-full bg-white rounded-[7px] flex items-center justify-center">
                <Zap className="w-4 h-4 text-red-600" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 font-mono tracking-wider">PRALAY TECH</span>
                <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.2 rounded border border-red-200 font-mono">
                  TEAM 02
                </span>
              </div>
              <p className="text-[11px] text-slate-500 italic">"Innovating Beyond Limits."</p>
            </div>
          </div>

          <div className="text-center md:text-right font-mono text-[11px] space-y-0.5">
            <div className="text-slate-700">
              College Project Presentation Slot: <strong className="text-red-600 font-bold">6:50 PM – 7:10 PM</strong>
            </div>
            <div className="text-slate-500">
              Zero-Hardware IoT Simulation • 14 Student Contributors • Cloud Firestore & Auth
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
