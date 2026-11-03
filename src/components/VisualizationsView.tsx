import React, { useState } from 'react';
import {
  PieChart as PieIcon,
  BarChart3,
  TrendingUp,
  Compass,
  Filter
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

export const VisualizationsView: React.FC = () => {
  const {
    responses,
    realResponses,
    demoResponses,
    viewMode
  } = useApp();

  const [visualScope, setVisualScope] = useState<'all' | 'real_only' | 'demo_only'>('all');

  const dataset = visualScope === 'real_only'
    ? realResponses
    : visualScope === 'demo_only'
    ? demoResponses
    : responses;

  const totalN = dataset.length;

  // Sentiment counts for active dataset
  const sentimentCounts = dataset.reduce(
    (acc, r) => {
      if (r.overallSatisfaction >= 4) acc.positive += 1;
      else if (r.overallSatisfaction === 3) acc.neutral += 1;
      else acc.negative += 1;
      return acc;
    },
    { positive: 0, neutral: 0, negative: 0 }
  );

  // Sentiment Pie Data
  const sentimentPieData = [
    { name: 'Positive (4-5★)', value: sentimentCounts.positive, color: '#10B981' },
    { name: 'Neutral (3★)', value: sentimentCounts.neutral, color: '#F59E0B' },
    { name: 'Negative (1-2★)', value: sentimentCounts.negative, color: '#EF4444' }
  ].filter(d => d.value > 0);

  // Age Group Bar Data
  const ageGroupData = [
    { age: '18-25', count: dataset.filter(r => r.ageGroup === '18-25').length },
    { age: '26-35', count: dataset.filter(r => r.ageGroup === '26-35').length },
    { age: '36-50', count: dataset.filter(r => r.ageGroup === '36-50').length },
    { age: '50+', count: dataset.filter(r => r.ageGroup === '50+').length }
  ];

  // Topic Average Comparison Bar Data
  const topicData = [
    {
      topic: 'Awareness',
      fullLabel: 'Environmental Awareness',
      score: totalN > 0
        ? Number((dataset.reduce((s, r) => s + r.environmentalAwareness, 0) / totalN).toFixed(2))
        : 0
    },
    {
      topic: 'Transit',
      fullLabel: 'Public Transport',
      score: totalN > 0
        ? Number((dataset.reduce((s, r) => s + r.publicTransportSatisfaction, 0) / totalN).toFixed(2))
        : 0
    },
    {
      topic: 'Cleanliness',
      fullLabel: 'Civic Cleanliness',
      score: totalN > 0
        ? Number((dataset.reduce((s, r) => s + r.cleanlinessSatisfaction, 0) / totalN).toFixed(2))
        : 0
    },
    {
      topic: 'Air Quality',
      fullLabel: 'Air Quality Satisfaction',
      score: totalN > 0
        ? Number((dataset.reduce((s, r) => s + r.airQualitySatisfaction, 0) / totalN).toFixed(2))
        : 0
    },
    {
      topic: 'Overall',
      fullLabel: 'Overall Quality of Life',
      score: totalN > 0
        ? Number((dataset.reduce((s, r) => s + r.overallSatisfaction, 0) / totalN).toFixed(2))
        : 0
    }
  ];

  // Primary Concern Donut Data
  const concernCategories = ['Air Quality', 'Traffic & Noise', 'Waste Management', 'Green Spaces', 'Public Amenities'];
  const concernColors = ['#EF4444', '#F97316', '#F59E0B', '#10B981', '#06B6D4'];
  const concernPieData = concernCategories.map((c, i) => ({
    name: c,
    value: dataset.filter(r => r.primaryConcern === c).length,
    color: concernColors[i]
  })).filter(d => d.value > 0);

  // Radar chart data
  const radarData = topicData.map(t => ({
    subject: t.topic,
    score: t.score,
    benchmark: 4.0
  }));

  // Survey Cumulative Timeline
  const timelineData = [...dataset].reverse().map((r, index) => ({
    index: `#${index + 1}`,
    satisfaction: r.overallSatisfaction,
    awareness: r.environmentalAwareness,
    id: r.id
  }));

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-mono font-bold text-red-700 bg-red-100 border border-red-200 px-2.5 py-0.5 rounded-full uppercase">
              Recharts Visual Engine
            </span>
            <span className="text-xs text-slate-500 font-mono">Real-Time Data Binding</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">Visual Analytics & Data Representation</h1>
          <p className="text-xs text-slate-600 mt-1 max-w-xl">
            Interactive charts dynamically reflecting virtual IoT sensor readings and public survey responses.
          </p>
        </div>

        {/* Scope Selector */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-1 rounded-2xl shrink-0">
          <button
            onClick={() => setVisualScope('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              visualScope === 'all'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            All ({responses.length})
          </button>
          <button
            onClick={() => setVisualScope('real_only')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              visualScope === 'real_only'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-700'
            }`}
          >
            Real Only ({realResponses.length})
          </button>
          <button
            onClick={() => setVisualScope('demo_only')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              visualScope === 'demo_only'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-orange-700'
            }`}
          >
            Demo Only ({demoResponses.length})
          </button>
        </div>
      </div>

      {/* Grid 1: Pie Charts - Sentiment Distribution & Primary Concerns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Sentiment Pie Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-emerald-600" />
                Public Sentiment Distribution (1-5★)
              </h2>
              <p className="text-xs text-slate-500">Ratio of positive, neutral, and critical citizens (N={totalN})</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sentimentPieData.map(entry => (
                    <Cell key={entry.name} fill={entry.color} stroke="#FFFFFF" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '0.75rem', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Primary Concern Donut Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-red-600" />
                Urgent Citizen Concerns Breakdown
              </h2>
              <p className="text-xs text-slate-500">Categorization of community priorities</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={concernPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {concernPieData.map(entry => (
                    <Cell key={entry.name} fill={entry.color} stroke="#FFFFFF" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '0.75rem', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Grid 2: Bar Charts - Topic-Wise Satisfaction & Age Group Responses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Topic-Wise Satisfaction Bar Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-red-600" />
                Domain Satisfaction Score (Out of 5.0)
              </h2>
              <p className="text-xs text-slate-500">Comparing public satisfaction across 5 key pillars</p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topicData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="topic" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} domain={[0, 5]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '0.75rem', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(val: any) => [`${val} / 5.0`, 'Average Score']}
                  labelFormatter={(topic: any) => topicData.find(t => t.topic === topic)?.fullLabel || String(topic || '')}
                />
                <Bar dataKey="score" fill="#EF4444" radius={[6, 6, 0, 0]}>
                  {topicData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.score >= 4 ? '#10B981' : entry.score >= 3 ? '#F97316' : '#EF4444'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Age Group Distribution Bar Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-purple-600" />
                Survey Participants by Age Cohort
              </h2>
              <p className="text-xs text-slate-500">Demographic participation breakdown</p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageGroupData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="age" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '0.75rem', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(val: any) => [`${val} Respondents`, 'Participants']}
                />
                <Bar dataKey="count" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Grid 3: Line Chart & Radar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Cumulative Response Satisfaction Line */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Survey Response Trajectory (Chronological)
              </h2>
              <p className="text-xs text-slate-500">Overall score per response received over time</p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="index" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '0.75rem', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="satisfaction" stroke="#EF4444" strokeWidth={2.5} name="Overall Satisfaction (1-5)" />
                <Line type="monotone" dataKey="awareness" stroke="#06B6D4" strokeWidth={2} strokeDasharray="4 4" name="Environmental Awareness (1-5)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar Profile Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Compass className="w-4 h-4 text-red-600" />
              Urban Radar Profile
            </h2>
            <p className="text-xs text-slate-500">Score vs 4.0 Benchmark</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="70%">
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis dataKey="subject" stroke="#64748B" fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[0, 5]} stroke="#94A3B8" fontSize={9} />
                <Radar name="Current Score" dataKey="score" stroke="#EF4444" fill="#EF4444" fillOpacity={0.3} />
                <Radar name="Target (4.0)" dataKey="benchmark" stroke="#10B981" fill="#10B981" fillOpacity={0.15} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '0.75rem', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
