import React, { useState, useMemo } from 'react';
import {
  Search,
  Trash2,
  FileSpreadsheet,
  RotateCcw,
  Sparkles,
  Eye,
  AlertTriangle,
  X,
  FileCode,
  CheckCircle2,
  Filter,
  Download
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SurveyResponse } from '../types';

export const DataManagementView: React.FC = () => {
  const {
    responses,
    realResponses,
    demoResponses,
    deleteSurveyResponse,
    resetToDemoData,
    purgeDemoData,
    addRandomDemoResponse,
    exportToCSV,
    exportAnalyticsJSON,
    exportToPDF,
    totalResponsesCount
  } = useApp();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<'all' | 'real_only' | 'demo_only'>('all');
  const [filterAge, setFilterAge] = useState<string>('All');
  const [filterSentiment, setFilterSentiment] = useState<'All' | 'Positive' | 'Neutral' | 'Negative'>('All');
  const [filterConcern, setFilterConcern] = useState<string>('All');

  // Modal State for viewing details
  const [selectedResponse, setSelectedResponse] = useState<SurveyResponse | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filtered responses logic
  const filteredResponses = useMemo(() => {
    return responses.filter(r => {
      // Type filter
      if (filterType === 'real_only' && r.isDemo) return false;
      if (filterType === 'demo_only' && !r.isDemo) return false;

      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        r.id.toLowerCase().includes(searchLower) ||
        (r.location && r.location.toLowerCase().includes(searchLower)) ||
        (r.suggestions && r.suggestions.toLowerCase().includes(searchLower)) ||
        r.primaryConcern.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;

      if (filterAge !== 'All' && r.ageGroup !== filterAge) return false;

      if (filterSentiment === 'Positive' && r.overallSatisfaction < 4) return false;
      if (filterSentiment === 'Neutral' && r.overallSatisfaction !== 3) return false;
      if (filterSentiment === 'Negative' && r.overallSatisfaction > 2) return false;

      if (filterConcern !== 'All' && r.primaryConcern !== filterConcern) return false;

      return true;
    });
  }, [responses, filterType, searchTerm, filterAge, filterSentiment, filterConcern]);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-[11px] font-mono font-bold text-blue-700 bg-blue-100 border border-blue-200 px-2.5 py-0.5 rounded-full uppercase">
              Data Management & Persistence
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Database Records: <strong className="text-emerald-700">{realResponses.length} Real</strong> • <strong className="text-orange-600">{demoResponses.length} Demo</strong>
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">
            Survey Data Records & Pipeline
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-xl">
            Inspect individual citizen survey submissions, filter by sentiment or demographic, export to CSV/PDF, or manage demo records.
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => exportToCSV(filterType)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5 transition-all shadow-xs"
            title="Download full responses table as .csv"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            Export CSV
          </button>

          <button
            onClick={() => exportToPDF(filterType)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 flex items-center gap-1.5 transition-all shadow-xs"
            title="Generate formatted PDF report"
          >
            <Download className="w-4 h-4 text-red-600" />
            Export PDF
          </button>

          <button
            onClick={addRandomDemoResponse}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-300 flex items-center gap-1.5 transition-all shadow-xs"
            title="Generate a randomized survey entry to demonstrate dynamic update"
          >
            <Sparkles className="w-4 h-4 text-orange-600" />
            + Add Demo Entry
          </button>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 flex items-center gap-1.5 transition-all"
            title="Restore initial 14 seed responses"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Seed Data
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search keyword, ID, location..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-red-500 placeholder:text-slate-400"
            />
          </div>

          {/* Data Source Filter (Real vs Demo) */}
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
              <option value="18-25">18-25 years</option>
              <option value="26-35">26-35 years</option>
              <option value="36-50">36-50 years</option>
              <option value="50+">50+ years</option>
            </select>
          </div>

          {/* Sentiment Filter */}
          <div>
            <select
              value={filterSentiment}
              onChange={e => setFilterSentiment(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-red-500"
            >
              <option value="All">All Sentiments</option>
              <option value="Positive">Positive (4-5★)</option>
              <option value="Neutral">Neutral (3★)</option>
              <option value="Negative">Negative (1-2★)</option>
            </select>
          </div>

          {/* Primary Concern Filter */}
          <div>
            <select
              value={filterConcern}
              onChange={e => setFilterConcern(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-red-500"
            >
              <option value="All">All Focus Areas</option>
              <option value="Air Quality">Air Quality</option>
              <option value="Traffic & Noise">Traffic & Noise</option>
              <option value="Waste Management">Waste Management</option>
              <option value="Green Spaces">Green Spaces</option>
              <option value="Public Amenities">Public Amenities</option>
            </select>
          </div>

        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 font-mono">
          <span>
            Showing <strong className="text-slate-900">{filteredResponses.length}</strong> of{' '}
            <strong className="text-slate-900">{totalResponsesCount}</strong> responses
          </span>
          {(searchTerm || filterType !== 'all' || filterAge !== 'All' || filterSentiment !== 'All' || filterConcern !== 'All') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
                setFilterAge('All');
                setFilterSentiment('All');
                setFilterConcern('All');
              }}
              className="text-red-600 hover:text-red-700 font-bold"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* Responses Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-mono uppercase tracking-wider text-slate-600 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-bold">Response ID</th>
                <th className="py-3 px-4 font-bold">Data Scope</th>
                <th className="py-3 px-4 font-bold">Demographics</th>
                <th className="py-3 px-4 font-bold">Location</th>
                <th className="py-3 px-4 font-bold text-center">Score</th>
                <th className="py-3 px-4 font-bold">Primary Concern</th>
                <th className="py-3 px-4 font-bold">Feedback Quote</th>
                <th className="py-3 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredResponses.map(r => {
                const isPositive = r.overallSatisfaction >= 4;
                const isNeutral = r.overallSatisfaction === 3;

                return (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {r.id}
                    </td>

                    {/* Data Scope (Segregated Real vs Demo) */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold uppercase ${
                          r.isDemo
                            ? 'bg-orange-50 text-orange-800 border border-orange-200'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                        }`}
                      >
                        {r.isDemo ? 'DEMO DATA' : 'REAL USER'}
                      </span>
                    </td>

                    {/* Age & Gender */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-bold text-slate-800">{r.ageGroup} yrs</div>
                      <div className="text-[11px] text-slate-500">{r.gender || 'Anonymous'}</div>
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-700">
                      {r.location || 'Anonymous Area'}
                    </td>

                    {/* Overall Rating */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 font-mono font-bold px-2 py-0.5 rounded border ${
                          isPositive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : isNeutral
                            ? 'bg-amber-50 text-amber-700 border-amber-300'
                            : 'bg-red-50 text-red-700 border-red-300'
                        }`}
                      >
                        {r.overallSatisfaction} ★
                      </span>
                    </td>

                    {/* Primary Concern */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                        {r.primaryConcern}
                      </span>
                    </td>

                    {/* Feedback */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="text-slate-700 italic truncate" title={r.suggestions}>
                        "{r.suggestions}"
                      </p>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedResponse(r)}
                          className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                          title="View Full Submission Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingId(r.id)}
                          className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:text-red-700 hover:bg-red-100 transition-colors"
                          title="Delete response"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}

              {filteredResponses.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 text-xs">
                    No matching survey records found. Try modifying your search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-3xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-700 border border-red-200 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Delete Survey Submission?</h3>
              <p className="text-xs text-slate-600 mt-1">
                Are you sure you want to remove record <strong className="font-mono">{deletingId}</strong>?
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
                className="px-5 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Response Details Modal */}
      {selectedResponse && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-mono uppercase text-red-600 font-bold">Survey Inspection</span>
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
                <span className="text-slate-500 block text-[10px] uppercase font-mono font-bold">Scope:</span>
                <span className="font-bold text-slate-900 mt-0.5 block">{selectedResponse.isDemo ? 'DEMO SEED DATA' : 'REAL CITIZEN'}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[10px] uppercase font-mono font-bold">Age Group:</span>
                <span className="font-bold text-slate-900 mt-0.5 block">{selectedResponse.ageGroup} years</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[10px] uppercase font-mono font-bold">Location:</span>
                <span className="font-bold text-slate-900 mt-0.5 block">{selectedResponse.location || 'Not Disclosed'}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[10px] uppercase font-mono font-bold">Primary Concern:</span>
                <span className="font-bold text-red-600 mt-0.5 block">{selectedResponse.primaryConcern}</span>
              </div>
            </div>

            {/* Ratings Breakdown */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <span className="text-[10px] uppercase font-mono text-slate-500 font-bold block mb-1">
                Rating Breakdown (1 - 5 Scale)
              </span>
              <div className="flex justify-between text-slate-700">
                <span>Environmental Awareness:</span>
                <span className="font-mono font-bold text-slate-900">{selectedResponse.environmentalAwareness} / 5</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Public Transport Satisfaction:</span>
                <span className="font-mono font-bold text-slate-900">{selectedResponse.publicTransportSatisfaction} / 5</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Civic Cleanliness:</span>
                <span className="font-mono font-bold text-slate-900">{selectedResponse.cleanlinessSatisfaction} / 5</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Air Quality Satisfaction:</span>
                <span className="font-mono font-bold text-slate-900">{selectedResponse.airQualitySatisfaction} / 5</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold border-t border-slate-200 pt-1.5">
                <span>Overall Satisfaction:</span>
                <span className="font-mono">{selectedResponse.overallSatisfaction} / 5 ★</span>
              </div>
            </div>

            {/* Suggestions */}
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

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-3xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 border border-amber-300 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Reset Seed Demo Data?</h3>
              <p className="text-xs text-slate-600 mt-1">
                This will restore the initial 14 demo responses while preserving any real user submissions.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetToDemoData();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white"
              >
                Yes, Reset Seed Data
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
