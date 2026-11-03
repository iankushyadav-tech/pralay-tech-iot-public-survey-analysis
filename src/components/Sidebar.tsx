import React from 'react';
import {
  LayoutDashboard,
  Cpu,
  ClipboardList,
  BarChart3,
  PieChart,
  Lightbulb,
  Database,
  ShieldAlert,
  ShieldCheck,
  FileText,
  Users,
  Presentation,
  Cloud
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TabType } from '../types';

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const {
    activeTab,
    setActiveTab,
    responses,
    realResponses,
    isSimulationActive,
    firebaseStatus,
    setIsConfigModalOpen,
    isAdminAuthenticated
  } = useApp();

  const navItems: {
    id: TabType;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    badgeColor?: string;
  }[] = [
    {
      id: 'dashboard',
      label: 'Home Dashboard',
      icon: LayoutDashboard
    },
    {
      id: 'simulator',
      label: 'Virtual IoT Simulator',
      icon: Cpu,
      badge: isSimulationActive ? 'LIVE' : 'IDLE',
      badgeColor: isSimulationActive ? 'bg-emerald-100 text-emerald-700 border-emerald-300' : 'bg-slate-100 text-slate-500 border-slate-200'
    },
    {
      id: 'survey',
      label: 'Public Survey Form',
      icon: ClipboardList,
      badge: 'Interactive',
      badgeColor: 'bg-red-50 text-red-700 border-red-200'
    },
    {
      id: 'analytics',
      label: 'Data Analytics',
      icon: BarChart3
    },
    {
      id: 'visualizations',
      label: 'Data Visualization',
      icon: PieChart
    },
    {
      id: 'insights',
      label: 'Smart Insights',
      icon: Lightbulb,
      badge: 'New',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300'
    },
    {
      id: 'management',
      label: 'Data Records & Pipeline',
      icon: Database,
      badge: `${responses.length}`,
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      id: 'admin',
      label: 'Secure Admin Panel',
      icon: isAdminAuthenticated ? ShieldCheck : ShieldAlert,
      badge: isAdminAuthenticated ? 'Auth' : 'Locked',
      badgeColor: isAdminAuthenticated ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-red-50 text-red-700 border-red-200'
    },
    {
      id: 'report',
      label: 'Report & Exports',
      icon: FileText
    },
    {
      id: 'about',
      label: 'About Project & Team',
      icon: Users,
      badge: '14 Members',
      badgeColor: 'bg-orange-50 text-orange-700 border-orange-200'
    },
    {
      id: 'presentation',
      label: 'Presentation Mode',
      icon: Presentation,
      badge: '6:50 PM',
      badgeColor: 'bg-red-100 text-red-800 border-red-300'
    }
  ];

  const handleNavClick = (id: TabType) => {
    setActiveTab(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-30 md:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-20 left-0 h-[calc(100vh-5rem)] z-30 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-300 ease-in-out shadow-xs ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Navigation Items */}
        <div className="p-3.5 space-y-1 overflow-y-auto">
          <div className="px-3 py-2 text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold flex items-center justify-between">
            <span>Modules & Navigation</span>
            <span className="text-[10px] text-red-600 font-mono font-bold">Full-Stack v3.0</span>
          </div>

          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all group ${
                  isActive
                    ? 'bg-red-50 text-red-700 border-l-4 border-red-600 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-1.5 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-500 group-hover:text-slate-700 group-hover:bg-slate-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-left">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold border ${item.badgeColor || 'bg-slate-100 text-slate-600 border-slate-200'}`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer Widget: Team PRALAY TECH + Firebase Sync */}
        <div className="p-3.5 border-t border-slate-200 bg-slate-50/80 space-y-2">
          
          {/* Quick Firebase Status Trigger */}
          <button
            onClick={() => setIsConfigModalOpen(true)}
            className="w-full p-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 flex items-center justify-between text-left transition-colors shadow-xs group"
          >
            <div className="flex items-center gap-2">
              <Cloud className="w-3.5 h-3.5 text-blue-600 group-hover:scale-110 transition-transform" />
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">
                  Backend Mode:
                </span>
                <span className="text-[11px] font-bold text-slate-800">
                  {firebaseStatus.mode === 'firestore_live' ? 'Cloud Firestore' : 'Persistent Storage'}
                </span>
              </div>
            </div>
            <span
              className={`w-2 h-2 rounded-full ${
                firebaseStatus.mode === 'firestore_live' ? 'bg-emerald-500 animate-ping' : 'bg-blue-500'
              }`}
            />
          </button>

          {/* Team Widget */}
          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs text-left">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-red-600 font-bold">
                PRALAY TECH • TEAM 02
              </span>
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[11px] text-slate-800 font-bold leading-tight mb-0.5">
              IoT Public Survey System
            </p>
            <p className="text-[10px] text-slate-500 italic">
              "Innovating Beyond Limits."
            </p>
            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>Slot: 6:50 PM – 7:10 PM</span>
              <span className="text-blue-600 font-bold">14 Members</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
