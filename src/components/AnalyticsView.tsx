import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Smile,
  Meh,
  Frown,
  Users,
  Target,
  Activity,
  Filter,
  Calendar,
  MapPin,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AgeGroup, PrimaryConcern, SurveyResponse } from '../types';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  Cell
} from 'recharts';

export const AnalyticsView: React.FC = () => {
  const {
    responses,
    realResponses,
    demoResponses,
    currentSensor,
    viewMode,
    setViewMode
  } = useApp();

  // Scope filter: Real Data Only (default as requested!), Demo Data, or Combined
  const [activeScope, setActiveScope] = useState<'real_only' | 'all' | 'demo_only'>('real_only');
  const [dateRangeFilter, setDateRangeFilter] = useState<'all' | '7d' | '24h'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Choose dataset
  const baseData = activeScope === 'real_only'
    ? (realResponses.length > 0 ? realResponses : responses) // fallback to all if zero real responses yet
    : activeScope === 'demo_only'
    ? demoResponses
    : responses;

  // Filter by Date Range and Category
  const filteredData = useMemo(() => {
    const now = new Date().getTime();
    return baseData.filter(r => {
      // Date filter
      if (dateRangeFilter === '24h') {
        const itemTime = new Date(r.timestamp).getTime();
        if (now - itemTime > 24 * 60 * 60 * 1000) return false;
      } else if (dateRangeFilter === '7d') {
        const itemTime = new Date(r.timestamp).getTime();
        if (now - itemTime > 7 * 24 * 60 * 60 * 1000) return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && r.primaryConcern !== selectedCategory) {
        return false;
      }

      return true;
    });
  }, [baseData, dateRangeFilter, selectedCategory]);

  const totalN = filteredData.length;

  // 1. Calculate Sentiments
  const sentimentCounts = filteredData.reduce(
    (acc, r) => {
      if (r.overallSatisfaction >= 4) acc.positive += 1;
      else if (r.overallSatisfaction === 3) acc.neutral += 1;
      else acc.negative += 1;
      return acc;
    },
    { positive: 0, neutral: 0, negative: 0 }
  );

  const satisfactionRate = totalN > 0
    ? Math.round(
        (filteredData.reduce((sum, r) => sum + r.overallSatisfaction, 0) / (totalN * 5)) * 100
      )
    : 0;

  // 2. Demographic Cohort Math
  const ageGroups: AgeGroup[] = ['18-25', '26-35', '36-50', '50+'];
  const ageCounts = ageGroups.reduce((acc, age) => {
    acc[age] = filteredData.filter(r => r.ageGroup === age).length;
    return acc;
  }, {} as Record<AgeGroup, number>);

  // 3. Category/Domain-Wise Statistics
  const categories = [
    { key: 'environmentalAwareness', label: 'Environmental Awareness', color: '#0284C7' },
    { key: 'publicTransportSatisfaction', label: 'Public Transit Quality', color: '#F59E0B' },
    { key: 'cleanlinessSatisfaction', label: 'Civic Cleanliness', color: '#10B981' },
    { key: 'airQualitySatisfaction', label: 'Air Quality Perception', color: '#8B5CF6' },
    { key: 'overallSatisfaction', label: 'Overall Living Score', color: '#EF4444' }
  ] as const;

  const topicAverages = categories.map(cat => {
    const sum = filteredData.reduce((s, r) => s + (r[cat.key] || 0), 0);
    const avg = totalN > 0 ? (sum / totalN).toFixed(2) : '0.00';
    const percent = totalN > 0 ? Math.round((Number(avg) / 5) * 100) : 0;
    return {
      ...cat,
      avg: Number(avg),
      percent
    };
  });

  // 4. Location-Wise Analysis
  const locationCounts = filteredData.reduce((acc, r) => {
    const loc = r.location || 'Anonymous Area';
    if (!acc[loc]) {
      acc[loc] = { count: 0, totalScore: 0 };
    }
    acc[loc].count += 1;
    acc[loc].totalScore += r.overallSatisfaction;
    return acc;
  }, {} as Record<string, { count: number; totalScore: number }>);

  const locationData = Object.entries(locationCounts).map(([loc, data]) => ({
    location: loc.length > 18 ? loc.slice(0, 16) + '...' : loc,
    count: data.count,
    avgScore: Number((data.totalScore / data.count).toFixed(1))
  })).sort((a, b) => b.count - a.count).slice(0, 6);

  // 5. Date/Timeline Response Trend
  const timelineData = [...filteredData]
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .map((r, i) => ({
      index: `#${i + 1}`,
      date: new Date(r.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' }),
      overall: r.overallSatisfaction,
      airQuality: r.airQualitySatisfaction,
      cleanliness: r.cleanlinessSatisfaction,
      transit: r.publicTransportSatisfaction
    }));

  // Correlation calculation between simulated AQI and survey satisfaction
  const simulatedAqi = currentSensor.airQualityIndex;
  const surveyAirSatisfaction = topicAverages.find(t => t.key === 'airQualitySatisfaction')?.avg || 0;
  
  const correlationStatus = simulatedAqi > 100 && surveyAirSatisfaction < 3.0
    ? 'High Negative Alignment (Poor Air Sensor matches Low Public Satisfaction)'
    : simulatedAqi <= 60 && surveyAirSatisfaction >= 3.5
    ? 'High Positive Alignment (Clean Air Sensor matches High Public Satisfaction)'
    : 'Moderate Variance / Transitory Environmental Shift';

  return (
    <div className="space-y-6">
      
      {/* Analytics Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-[11px] font-mono font-bold text-red-700 bg-red-100 border border-red-200 px-2.5 py-0.5 rounded-full uppercase">
              Analytical Engine • Team 02
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Dataset Scope: <strong className="text-slate-900">{activeScope === 'real_only' ? 'REAL USER DATA' : activeScope === 'demo_only' ? 'DEMO SEED' : 'ALL DATA'} (N={totalN})</strong>
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">
            Advanced Public Opinion & Sensor Analytics
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Mathematical aggregation of citizen sentiment, demographic cohorts, location distributions, and correlation with virtual environmental telemetry.
          </p>
        </div>

        {/* Top Scope Switcher */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-1 rounded-2xl shrink-0">
          <button
            onClick={() => setActiveScope('real_only')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeScope === 'real_only'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-700'
            }`}
          >
            Real Data ({realResponses.length})
          </button>
          <button
            onClick={() => setActiveScope('demo_only')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeScope === 'demo_only'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-orange-700'
            }`}
          >
            Demo Data ({demoResponses.length})
          </button>
          <button
            onClick={() => setActiveScope('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeScope === 'all'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Combined View
          </button>
        </div>
      </div>

      {/* Filter Toolbar: Date Range & Category */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Date Range Filter */}
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>Time Window:</span>
            <select
              value={dateRangeFilter}
              onChange={e => setDateRangeFilter(e.target.value as any)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1 text-xs font-mono text-slate-800 focus:outline-none focus:border-red-500"
            >
              <option value="all">All Dates</option>
              <option value="7d">Last 7 Days</option>
              <option value="24h">Last 24 Hours</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <Filter className="w-4 h-4 text-red-600" />
            <span>Focus Area:</span>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-red-500"
            >
              <option value="all">All Focus Areas</option>
              <option value="Air Quality">Air Quality</option>
              <option value="Traffic & Noise">Traffic & Noise</option>
              <option value="Waste Management">Waste Management</option>
              <option value="Green Spaces">Green Spaces</option>
              <option value="Public Amenities">Public Amenities</option>
            </select>
          </div>
        </div>

        <div className="text-xs font-mono text-slate-500">
          Showing <strong className="text-slate-900">{totalN}</strong> analyzed records
        </div>
      </div>

      {/* 4 Sentiment Distribution KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Sample Count */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-600">Active Scope Count</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono">{totalN}</div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Overall approval:</span>
            <span className="text-emerald-700 font-bold">{satisfactionRate}%</span>
          </div>
        </div>

        {/* Positive Responses */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-600">Positive Sentiment (4-5★)</span>
            <Smile className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 font-mono">
            {sentimentCounts.positive}
            <span className="text-sm font-normal text-slate-500 ml-2">
              ({totalN > 0 ? Math.round((sentimentCounts.positive / totalN) * 100) : 0}%)
            </span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-700 font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> High satisfaction community sector
          </div>
        </div>

        {/* Neutral Responses */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-600">Neutral Sentiment (3★)</span>
            <Meh className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-amber-600 font-mono">
            {sentimentCounts.neutral}
            <span className="text-sm font-normal text-slate-500 ml-2">
              ({totalN > 0 ? Math.round((sentimentCounts.neutral / totalN) * 100) : 0}%)
            </span>
          </div>
          <div className="mt-2 text-[11px] text-amber-700 font-semibold">
            Moderate satisfaction with improvement potential
          </div>
        </div>

        {/* Negative Responses */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-600">Critical / Negative (1-2★)</span>
            <Frown className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-3xl font-extrabold text-red-600 font-mono">
            {sentimentCounts.negative}
            <span className="text-sm font-normal text-slate-500 ml-2">
              ({totalN > 0 ? Math.round((sentimentCounts.negative / totalN) * 100) : 0}%)
            </span>
          </div>
          <div className="mt-2 text-[11px] text-red-700 font-bold flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5" /> Requires municipal escalation
          </div>
        </div>

      </div>

      {/* Grid 1: Category Statistics & Location-Wise Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Category-Wise Statistics */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Target className="w-4 h-4 text-red-600" />
                Category-Wise Performance Matrix
              </h2>
              <p className="text-xs text-slate-500">Comparing average citizen score across 5 standard domains</p>
            </div>
            <span className="text-xs font-mono text-blue-700 font-bold">1.0 - 5.0 Scale</span>
          </div>

          <div className="space-y-4 pt-2">
            {topicAverages.map(topic => (
              <div key={topic.key} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{topic.label}</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-slate-500 text-[11px]">{topic.percent}% Approval</span>
                    <span className="font-extrabold text-slate-900">{topic.avg} / 5.0</span>
                  </div>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-200">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${topic.percent}%`, backgroundColor: topic.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Location-Wise Analysis */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                Location-Wise Response Distribution
              </h2>
              <p className="text-xs text-slate-500">Citizen participation and satisfaction by neighborhood</p>
            </div>
            <span className="text-xs font-mono text-slate-500">Top Sectors</span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={locationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="location" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '0.75rem', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(val: any, name: any) => [
                    name === 'count' ? `${val} Responses` : `${val} / 5.0 ★`,
                    name === 'count' ? 'Sample Size' : 'Mean Satisfaction'
                  ]}
                />
                <Bar dataKey="count" fill="#10B981" radius={[6, 6, 0, 0]} name="count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Grid 2: Date-Wise / Timeline Response Trends */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-red-600" />
              Chronological Response Trend Line
            </h2>
            <p className="text-xs text-slate-500">Overall score trajectory vs Transit and Air Quality opinions</p>
          </div>
          <span className="text-xs font-mono text-slate-500">Normalized Chronological Stream</span>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timelineData} margin={{ top: 10, right: 20, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="index" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '0.75rem', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Line type="monotone" dataKey="overall" stroke="#EF4444" strokeWidth={2.5} name="Overall Satisfaction" dot={false} />
              <Line type="monotone" dataKey="airQuality" stroke="#8B5CF6" strokeWidth={2} name="Air Quality Score" dot={false} strokeDasharray="3 3" />
              <Line type="monotone" dataKey="transit" stroke="#F59E0B" strokeWidth={2} name="Public Transit" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Environmental & IoT Correlation Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-red-600 uppercase tracking-wider">
          <Activity className="w-4 h-4 text-red-600 animate-pulse" />
          IoT Telemetry & Citizen Survey Correlation Index
        </div>

        <h3 className="text-lg font-black text-slate-900">
          Real-Time Virtual Sensor vs Public Perception Analysis
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Simulated IoT Sensor AQI:</span>
            <span className="text-lg font-black text-slate-900 mt-1 block">
              {simulatedAqi} AQI ({currentSensor.status})
            </span>
            <span className="text-[10px] text-slate-500">Virtual laser scattering node</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Citizen Survey Air Quality Score:</span>
            <span className="text-lg font-black text-red-600 mt-1 block">
              {surveyAirSatisfaction} / 5.0 ★
            </span>
            <span className="text-[10px] text-slate-500">Subjective survey perception</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Correlation State:</span>
            <span className="text-xs font-bold text-emerald-700 mt-1 block leading-snug">
              {correlationStatus}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
