import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  LogOut,
  Users,
  Search,
  Trash2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Download,
  Filter,
  Eye,
  CheckCircle2,
  X,
  Server,
  Cloud,
  Layers,
  Key
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SurveyResponse } from '../types';

export const AdminPanelView: React.FC = () => {
  const {
    responses,
    realResponses,
    demoResponses,
    deleteSurveyResponse,
    resetToDemoData,
    purgeDemoData,
    addRandomDemoResponse,
    exportToCSV,
    exportToPDF,
    exportAnalyticsJSON,
    firebaseStatus,
    setIsConfigModalOpen,
    adminUser,
    isAdminAuthenticated,
    loginPresentationAdmin,
    loginGoogleAdmin,
    logoutCurrentAdmin
  } = useApp();

  // Login Form States
  const [passcode, setPasscode] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // Table Filters
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<'all' | 'real_only' | 'demo_only'>('all');
  const [filterAge, setFilterAge] = useState<string>('All');
  const [filterConcern, setFilterConcern] = useState<string>('All');

  // Deletion Modal State
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedResponse, setSelectedResponse] = useState<SurveyResponse | null>(null);
  const [showPurgeDemoConfirm, setShowPurgeDemoConfirm] = useState<boolean>(false);

  // Handle Login
  const handlePasscodeLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      await loginPresentationAdmin(passcode);
      setPasscode('');
    } catch (err: any) {
      setLoginError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoginError('');
    setIsLoggingIn(true);
    try {
      await loginGoogleAdmin();
    } catch (err: any) {
      setLoginError(err.message || 'Google Auth failed or is currently in simulation mode.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Filtered responses for admin view
  const filteredResponses = useMemo(() => {
    return responses.filter(r => {
      if (filterType === 'real_only' && r.isDemo) return false;
      if (filterType === 'demo_only' && !r.isDemo) return false;

      const q = searchTerm.toLowerCase();
      const matchesSearch =
        r.id.toLowerCase().includes(q) ||
        (r.location && r.location.toLowerCase().includes(q)) ||
        (r.suggestions && r.suggestions.toLowerCase().includes(q)) ||
        r.primaryConcern.toLowerCase().includes(q);

      if (!matchesSearch) return false;
      if (filterAge !== 'All' && r.ageGroup !== filterAge) return false;
      if (filterConcern !== 'All' && r.primaryConcern !== filterConcern) return false;

      return true;
    });
  }, [responses, filterType, searchTerm, filterAge, filterConcern]);

  // If NOT authenticated, show Secure Login Gate
  if (!isAdminAuthenticated) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 space-y-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 border border-red-200 mx-auto flex items-center justify-center shadow-xs">
            <Lock className="w-8 h-8 text-red-600" />
          </div>

          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-700 bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
              Restricted Area • Firebase Auth
            </span>
            <h1 className="text-2xl font-black text-slate-900 mt-3">
              Admin & Evaluator Panel
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
              This administrative dashboard is protected by Firebase Authentication and Firestore Security Rules. Public users cannot access or delete data.
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2 text-left">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {/* College Presentation Defense Access Option */}
          <form onSubmit={handlePasscodeLogin} className="space-y-3 pt-2 text-left">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                <span>College Defense Admin Passkey:</span>
                <span className="text-[10px] font-mono text-red-600 font-bold">Slot 6:50 PM – 7:10 PM</span>
              </div>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter Passkey (e.g. PRALAY2026 or TEAM02)"
                  value={passcode}
                  onChange={e => setPasscode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-red-500 shadow-xs"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1 font-mono">
                Hint for evaluating professors & team: use <strong className="text-slate-700">PRALAY2026</strong> or <strong className="text-slate-700">TEAM02</strong>
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn || !passcode.trim()}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white shadow-sm shadow-red-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              <Key className="w-4 h-4" />
              <span>{isLoggingIn ? 'Verifying Credentials...' : 'Authenticate as Administrator'}</span>
            </button>
          </form>

          {/* Or Sign in with Google (Firebase Auth Provider) */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <span className="text-[11px] font-mono text-slate-400 block uppercase">
              Or Authenticate with Google
            </span>
            <button
              onClick={handleGoogleLogin}
              disabled={isLoggingIn}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-xs flex items-center justify-center gap-2 transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Sign in with Google Admin Account</span>
            </button>
          </div>

          <div className="pt-2 text-[11px] text-slate-500 font-mono">
            Authorized Admins: <strong className="text-slate-700">singhtiger7171@gmail.com</strong> • Team 02 Lead
          </div>
        </div>
      </div>
    );
  }

  // AUTHENTICATED ADMIN VIEW
  return (
    <div className="space-y-6">
      
      {/* Admin Header with Session Info & Actions */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-[11px] font-mono font-bold text-red-700 bg-red-100 border border-red-200 px-2 py-0.5 rounded uppercase flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
              Verified Administrator
            </span>
            <span className="text-xs font-mono text-slate-500">
              Session UID: <strong className="text-slate-800">{adminUser?.uid}</strong>
            </span>
            <span className="text-xs font-mono text-slate-500">
              Role: <strong className="text-red-600 uppercase font-bold">{adminUser?.role}</strong>
            </span>
          </div>

          <h1 className="text-2xl font-black text-slate-900">
            Secure Survey Administration & Governance
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Full authority to inspect citizen submissions, purge or regenerate demo records, trigger CSV/PDF administrative audits, and manage Firebase synchronization.
          </p>
        </div>

        {/* Top Action Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsConfigModalOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Cloud className="w-3.5 h-3.5 text-blue-600" />
            <span>Firebase Config</span>
          </button>

          <button
            onClick={logoutCurrentAdmin}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 flex items-center gap-1.5 transition-all shadow-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Admin KPI Stat Cards (Separate Real vs Demo Data!) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Database Documents */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">Total Survey Records</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono">{responses.length}</div>
          <div className="mt-2 text-[11px] font-mono text-slate-500">
            Across Real & Demo entries
          </div>
        </div>

        {/* Real Citizen Responses */}
        <div className="bg-white border-2 border-emerald-300 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-800">Real Citizen Submissions</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-700 font-mono">{realResponses.length}</div>
          <div className="mt-2 text-[11px] font-mono text-emerald-800 font-bold">
            100% Genuine User Submissions
          </div>
        </div>

        {/* Demo Seed Responses */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">Demo Seed Records</span>
            <div className="p-2 rounded-xl bg-orange-50 text-orange-600 border border-orange-200">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-orange-600 font-mono">{demoResponses.length}</div>
          <div className="mt-2 text-[11px] font-mono text-slate-500">
            Clearly labeled DEMO DATA
          </div>
        </div>

        {/* Backend & Security Rule Status */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">Security Invariant</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-200">
              <Lock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-base font-extrabold text-slate-900 font-mono">ABAC Fortified</div>
          <div className="mt-2 text-[11px] font-mono text-emerald-700 font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Only Admins Can Delete
          </div>
        </div>

      </div>

      {/* Admin Data Operations Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-red-600" />
              Administrative Operations & Data Management
            </h3>
            <p className="text-xs text-slate-500">Separate control for actual responses vs pre-seeded fixtures.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => exportToPDF('real_only')}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              Export Real Data PDF
            </button>

            <button
              onClick={() => exportToCSV('real_only')}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              Export Real Data CSV
            </button>

            <button
              onClick={addRandomDemoResponse}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-200 flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              + Add Demo Fixture
            </button>

            <button
              onClick={() => setShowPurgeDemoConfirm(true)}
              disabled={demoResponses.length === 0}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1.5 transition-all disabled:opacity-50 shadow-xs"
            >
              <Trash2 className="w-3.5 h-3.5 text-amber-600" />
              Purge Demo Data ({demoResponses.length})
            </button>

            <button
              onClick={resetToDemoData}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 flex items-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restore 14 Seed Records
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
          
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search ID, location, comments..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Dataset Type Filter */}
          <div>
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold focus:bg-white focus:outline-none focus:border-red-500"
            >
              <option value="all">All Records ({responses.length})</option>
              <option value="real_only">Real User Submissions Only ({realResponses.length})</option>
              <option value="demo_only">Demo Seed Records Only ({demoResponses.length})</option>
            </select>
          </div>

          {/* Age Filter */}
          <div>
            <select
              value={filterAge}
              onChange={e => setFilterAge(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-red-500"
            >
              <option value="All">All Age Groups</option>
              <option value="18-25">18-25 yrs</option>
              <option value="26-35">26-35 yrs</option>
              <option value="36-50">36-50 yrs</option>
              <option value="50+">50+ yrs</option>
            </select>
          </div>

          {/* Concern Filter */}
          <div>
            <select
              value={filterConcern}
              onChange={e => setFilterConcern(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-red-500"
            >
              <option value="All">All Municipal Concerns</option>
              <option value="Air Quality">Air Quality</option>
              <option value="Traffic & Noise">Traffic & Noise</option>
              <option value="Waste Management">Waste Management</option>
              <option value="Green Spaces">Green Spaces</option>
              <option value="Public Amenities">Public Amenities</option>
            </select>
          </div>

        </div>
      </div>

      {/* Admin Responses Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="text-xs font-mono text-slate-500">
            Displaying <strong className="text-slate-900">{filteredResponses.length}</strong> matching records
          </div>
          <span className="text-[10px] font-mono text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200 font-bold">
            CONFIRMATION REQUIRED FOR DELETION
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-mono uppercase tracking-wider text-slate-600 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-bold">Response ID</th>
                <th className="py-3 px-4 font-bold">Category</th>
                <th className="py-3 px-4 font-bold">Demographics</th>
                <th className="py-3 px-4 font-bold">Location</th>
                <th className="py-3 px-4 font-bold text-center">Score</th>
                <th className="py-3 px-4 font-bold">Concern</th>
                <th className="py-3 px-4 font-bold">Feedback</th>
                <th className="py-3 px-4 font-bold text-right">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredResponses.map(r => (
                <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                    {r.id}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${
                        r.isDemo
                          ? 'bg-orange-50 text-orange-800 border-orange-200'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      }`}
                    >
                      {r.isDemo ? 'DEMO DATA' : 'REAL USER'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-bold text-slate-800">{r.ageGroup} yrs</div>
                    <div className="text-[10px] text-slate-500">{r.gender || 'Anonymous'}</div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-700">
                    {r.location || 'Not Specified'}
                  </td>
                  <td className="py-3.5 px-4 text-center whitespace-nowrap font-mono font-bold text-amber-500">
                    {r.overallSatisfaction} ★
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                      {r.primaryConcern}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 max-w-xs truncate italic text-slate-600">
                    "{r.suggestions}"
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedResponse(r)}
                        className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                        title="View Full Detail"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingId(r.id)}
                        className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:text-red-700 hover:bg-red-100 transition-colors"
                        title="Delete from Database"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredResponses.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                    No survey records match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two-Step Deletion Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-3xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 border border-red-200 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Confirm Deletion</h3>
              <p className="text-xs text-slate-600 mt-1">
                Are you sure you want to permanently delete record <strong className="font-mono text-slate-900">{deletingId}</strong>?
                This action is verified by Firestore ABAC rules and cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await deleteSurveyResponse(deletingId);
                  setDeletingId(null);
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-xs"
              >
                Yes, Delete Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Purge Demo Data Confirmation */}
      {showPurgeDemoConfirm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-3xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 border border-amber-300 mx-auto flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Purge Demo Seed Data?</h3>
              <p className="text-xs text-slate-600 mt-1">
                This will delete all {demoResponses.length} synthetic demo records from active memory and storage, leaving <strong>only genuine citizen submissions ({realResponses.length})</strong>.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setShowPurgeDemoConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  purgeDemoData();
                  setShowPurgeDemoConfirm(false);
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs"
              >
                Purge Demo Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Response View Modal */}
      {selectedResponse && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-mono uppercase text-red-600 font-bold">Admin Inspection</span>
                <h3 className="text-base font-black text-slate-900 font-mono">{selectedResponse.id}</h3>
              </div>
              <button
                onClick={() => setSelectedResponse(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-mono font-bold">Category:</span>
                <span className="font-bold text-slate-900 mt-0.5 block">{selectedResponse.isDemo ? 'DEMO DATA' : 'REAL USER'}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-mono font-bold">Age Group:</span>
                <span className="font-bold text-slate-900 mt-0.5 block">{selectedResponse.ageGroup} years</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-mono font-bold">Location:</span>
                <span className="font-bold text-slate-900 mt-0.5 block">{selectedResponse.location || 'Anonymous'}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-mono font-bold">Primary Concern:</span>
                <span className="font-bold text-red-600 mt-0.5 block">{selectedResponse.primaryConcern}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <span className="text-[10px] uppercase font-mono text-slate-500 font-bold block mb-1">
                Detailed 1-5 Ratings Matrix
              </span>
              <div className="flex justify-between text-slate-700">
                <span>Environmental Awareness:</span>
                <span className="font-mono font-bold">{selectedResponse.environmentalAwareness} / 5</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Public Transport:</span>
                <span className="font-mono font-bold">{selectedResponse.publicTransportSatisfaction} / 5</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Civic Cleanliness:</span>
                <span className="font-mono font-bold">{selectedResponse.cleanlinessSatisfaction} / 5</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Air Quality:</span>
                <span className="font-mono font-bold">{selectedResponse.airQualitySatisfaction} / 5</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold border-t border-slate-200 pt-1.5">
                <span>Overall Satisfaction:</span>
                <span className="font-mono">{selectedResponse.overallSatisfaction} / 5 ★</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-mono text-slate-500 font-bold block mb-1">
                Citizen Feedback & Recommendations
              </span>
              <p className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 italic leading-relaxed">
                "{selectedResponse.suggestions}"
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedResponse(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
