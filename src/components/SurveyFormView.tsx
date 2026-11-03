import React, { useState } from 'react';
import {
  Star,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Send,
  ArrowRight,
  Info,
  MapPin,
  Smile,
  Compass,
  Bus,
  Trash2,
  Wind,
  Loader2,
  Cloud,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AgeGroup, Gender, PrimaryConcern, SurveyResponse } from '../types';

export const SurveyFormView: React.FC = () => {
  const { addSurveyResponse, setActiveTab, responses, firebaseStatus } = useApp();

  // Form State
  const [ageGroup, setAgeGroup] = useState<AgeGroup | ''>('');
  const [gender, setGender] = useState<Gender | ''>('');
  const [location, setLocation] = useState<string>('');
  const [environmentalAwareness, setEnvironmentalAwareness] = useState<number>(0);
  const [publicTransportSatisfaction, setPublicTransportSatisfaction] = useState<number>(0);
  const [cleanlinessSatisfaction, setCleanlinessSatisfaction] = useState<number>(0);
  const [airQualitySatisfaction, setAirQualitySatisfaction] = useState<number>(0);
  const [overallSatisfaction, setOverallSatisfaction] = useState<number>(0);
  const [primaryConcern, setPrimaryConcern] = useState<PrimaryConcern | ''>('');
  const [suggestions, setSuggestions] = useState<string>('');

  // UI & Submission State
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submittedRecord, setSubmittedRecord] = useState<SurveyResponse | null>(null);
  const [duplicateWarning, setDuplicateWarning] = useState<string>('');

  const ageGroups: AgeGroup[] = ['18-25', '26-35', '36-50', '50+'];
  const genders: Gender[] = ['Male', 'Female', 'Non-Binary', 'Prefer not to say'];
  const concerns: PrimaryConcern[] = [
    'Air Quality',
    'Traffic & Noise',
    'Waste Management',
    'Green Spaces',
    'Public Amenities'
  ];

  // Validation
  const validate = () => {
    const errs: { [key: string]: string } = {};

    if (!ageGroup) errs.ageGroup = 'Please select your age group.';
    if (environmentalAwareness === 0) errs.environmentalAwareness = 'Please rate your environmental awareness (1 to 5 stars).';
    if (publicTransportSatisfaction === 0) errs.publicTransportSatisfaction = 'Please rate public transport satisfaction (1 to 5 stars).';
    if (cleanlinessSatisfaction === 0) errs.cleanlinessSatisfaction = 'Please rate civic cleanliness satisfaction (1 to 5 stars).';
    if (airQualitySatisfaction === 0) errs.airQualitySatisfaction = 'Please rate local air quality satisfaction (1 to 5 stars).';
    if (overallSatisfaction === 0) errs.overallSatisfaction = 'Please rate your overall urban living satisfaction (1 to 5 stars).';
    if (!primaryConcern) errs.primaryConcern = 'Please select your primary municipal priority concern.';
    
    if (!suggestions.trim()) {
      errs.suggestions = 'Please provide constructive feedback or observations.';
    } else if (suggestions.trim().length < 10) {
      errs.suggestions = 'Please provide at least 10 characters of detailed feedback.';
    } else if (suggestions.trim().length > 800) {
      errs.suggestions = 'Feedback must not exceed 800 characters.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDuplicateWarning('');

    if (!validate()) {
      return;
    }

    // Anti-duplicate submission check (prevent double clicks or identical submission within 60s)
    const normalizedSuggestion = suggestions.trim().toLowerCase();
    const isDuplicate = responses.some(
      r => !r.isDemo && r.suggestions.trim().toLowerCase() === normalizedSuggestion &&
      r.primaryConcern === primaryConcern &&
      r.ageGroup === ageGroup
    );

    if (isDuplicate) {
      setDuplicateWarning('A survey response with identical feedback has already been submitted in this session. Please add distinct observations.');
      return;
    }

    setIsSubmitting(true);

    try {
      const newResponse: Omit<SurveyResponse, 'id' | 'timestamp'> = {
        ageGroup: ageGroup as AgeGroup,
        gender: gender ? (gender as Gender) : 'Prefer not to say',
        location: location.trim() || 'Anonymous Area',
        environmentalAwareness,
        publicTransportSatisfaction,
        cleanlinessSatisfaction,
        airQualitySatisfaction,
        overallSatisfaction,
        primaryConcern: primaryConcern as PrimaryConcern,
        suggestions: suggestions.trim(),
        isDemo: false
      };

      const saved = await addSurveyResponse(newResponse);
      setSubmittedRecord(saved);
      setIsSubmitted(true);
    } catch (err) {
      console.error('Submission failed:', err);
      setErrors({ form: 'Failed to record response. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setAgeGroup('');
    setGender('');
    setLocation('');
    setEnvironmentalAwareness(0);
    setPublicTransportSatisfaction(0);
    setCleanlinessSatisfaction(0);
    setAirQualitySatisfaction(0);
    setOverallSatisfaction(0);
    setPrimaryConcern('');
    setSuggestions('');
    setErrors({});
    setDuplicateWarning('');
    setIsSubmitted(false);
    setSubmittedRecord(null);
  };

  // 1-5 Star Rating Component for clean white theme
  const StarRatingField = ({
    label,
    icon: Icon,
    value,
    onChange,
    error,
    description
  }: {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    value: number;
    onChange: (val: number) => void;
    error?: string;
    description?: string;
  }) => {
    return (
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-red-600" />
            <span className="text-xs font-bold text-slate-800">{label}</span>
          </div>
          {value > 0 && (
            <span className="text-xs font-mono font-bold text-red-600">
              {value}/5 ({['Very Poor', 'Poor', 'Average', 'Good', 'Excellent'][value - 1]})
            </span>
          )}
        </div>

        {description && <p className="text-[11px] text-slate-500 leading-relaxed">{description}</p>}

        <div className="flex items-center gap-2 pt-1">
          {[1, 2, 3, 4, 5].map(rating => (
            <button
              type="button"
              key={rating}
              onClick={() => onChange(rating)}
              className={`p-2 rounded-xl border transition-all flex items-center justify-center flex-1 ${
                value >= rating
                  ? 'bg-amber-50 border-amber-400 text-amber-500 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-300 hover:text-slate-400 hover:border-slate-300'
              }`}
            >
              <Star
                className={`w-5 h-5 ${
                  value >= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                }`}
              />
            </button>
          ))}
        </div>

        {error && (
          <p className="text-[11px] text-red-600 flex items-center gap-1 font-bold pt-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {error}
          </p>
        )}
      </div>
    );
  };

  // SUCCESS CONFIRMATION VIEW
  if (isSubmitted && submittedRecord) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <div className="p-8 sm:p-10 rounded-3xl bg-white border-2 border-emerald-300 shadow-sm space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 border border-emerald-200 mx-auto flex items-center justify-center shadow-xs">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 animate-bounce" />
          </div>

          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
              Submission Confirmed & Saved
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-3">
              Thank You for Your Feedback!
            </h2>
            <p className="text-xs text-slate-600 max-w-md mx-auto mt-2 leading-relaxed">
              Your response has been registered and integrated into the live public satisfaction analytics engine.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left font-mono text-xs space-y-2 max-w-md mx-auto">
            <div className="flex justify-between text-slate-600">
              <span>Record Document ID:</span>
              <span className="text-slate-900 font-bold">{submittedRecord.id}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Backend Synchronization:</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <Cloud className="w-3.5 h-3.5" />
                {submittedRecord.source === 'firestore' ? 'Cloud Firestore (Live)' : 'Persistent Local Ingest'}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Privacy Guard:</span>
              <span className="text-blue-700 font-bold">100% Anonymous (No PII gathered)</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Associated IoT Hub:</span>
              <span className="text-red-600 font-bold">NODE-PRALAY-01</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('analytics')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white shadow-sm shadow-red-500/20 flex items-center justify-center gap-2 transition-all"
            >
              View Analytics Dashboard <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleResetForm}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition-all shadow-xs"
            >
              Submit Another Response
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ACTIVE SURVEY FORM VIEW
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Title & Privacy Assurance Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-mono font-bold text-red-700 bg-red-100 border border-red-200 px-2 py-0.5 rounded uppercase">
                Citizen Survey Module
              </span>
              <span className="text-xs text-slate-500 font-mono">100% Anonymous Participation</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900">
              Public Opinion & Environmental Survey
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Help us correlate perceived urban quality of life with virtual IoT environmental measurements.
              No phone number, email address, or personally identifiable information (PII) is gathered.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-left shrink-0">
            <div className="flex items-center gap-2 text-blue-700 text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Zero-PII Privacy Protection</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1 font-mono">
              Saved via {firebaseStatus.mode === 'firestore_live' ? 'Cloud Firestore' : 'Persistent Storage'}
            </p>
          </div>
        </div>
      </div>

      {duplicateWarning && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-800 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>{duplicateWarning}</span>
        </div>
      )}

      {/* Main Survey Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        
        {/* Section 1: Demographics */}
        <div>
          <h2 className="text-sm font-bold text-red-600 uppercase tracking-wider font-mono mb-3 flex items-center gap-2">
            <span>01. Demographics & Community Location</span>
            <span className="text-xs text-slate-500 normal-case font-normal">(Non-identifying context)</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Age Group */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Age Group <span className="text-red-500">*</span>
              </label>
              <select
                value={ageGroup}
                onChange={e => setAgeGroup(e.target.value as AgeGroup)}
                className={`w-full bg-slate-50 border rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none transition-colors ${
                  errors.ageGroup ? 'border-red-500 bg-red-50 text-red-900' : 'border-slate-300 focus:border-red-500'
                }`}
              >
                <option value="">Select Age Group</option>
                {ageGroups.map(ag => (
                  <option key={ag} value={ag}>{ag} years</option>
                ))}
              </select>
              {errors.ageGroup && (
                <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1 font-bold">
                  <AlertCircle className="w-3 h-3" /> {errors.ageGroup}
                </p>
              )}
            </div>

            {/* Gender (Optional) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Gender <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <select
                value={gender}
                onChange={e => setGender(e.target.value as Gender)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-red-500"
              >
                <option value="">Prefer not to say</option>
                {genders.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {/* Location / Zone (Optional) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Neighborhood / Sector <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Sector 62, Campus Quad"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  maxLength={100}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-red-500 placeholder:text-slate-400"
                />
                <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

          </div>
        </div>

        {/* Section 2: Ratings */}
        <div className="pt-4 border-t border-slate-100">
          <h2 className="text-sm font-bold text-red-600 uppercase tracking-wider font-mono mb-3">
            02. Satisfaction & Environmental Ratings (1 - 5 Stars)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <StarRatingField
              label="Environmental Awareness"
              description="Your general awareness of local emissions, carbon footprint & energy conservation."
              icon={Compass}
              value={environmentalAwareness}
              onChange={setEnvironmentalAwareness}
              error={errors.environmentalAwareness}
            />

            <StarRatingField
              label="Public Transport Satisfaction"
              description="Availability, frequency, comfort, and accessibility of transit shuttles/metro."
              icon={Bus}
              value={publicTransportSatisfaction}
              onChange={setPublicTransportSatisfaction}
              error={errors.publicTransportSatisfaction}
            />

            <StarRatingField
              label="Cleanliness & Waste Management"
              description="Timely garbage pickup, absence of roadside litter, clean public thoroughfares."
              icon={Trash2}
              value={cleanlinessSatisfaction}
              onChange={setCleanlinessSatisfaction}
              error={errors.cleanlinessSatisfaction}
            />

            <StarRatingField
              label="Air Quality Perception"
              description="Perceived cleanliness of outdoor air, absence of vehicle smog and dust."
              icon={Wind}
              value={airQualitySatisfaction}
              onChange={setAirQualitySatisfaction}
              error={errors.airQualitySatisfaction}
            />

            <div className="md:col-span-2">
              <StarRatingField
                label="Overall Urban Quality of Life Satisfaction"
                description="Your holistic satisfaction with community infrastructure and living conditions."
                icon={Smile}
                value={overallSatisfaction}
                onChange={setOverallSatisfaction}
                error={errors.overallSatisfaction}
              />
            </div>

          </div>
        </div>

        {/* Section 3: Topic of Primary Concern & Detailed Feedback */}
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <h2 className="text-sm font-bold text-red-600 uppercase tracking-wider font-mono mb-2">
            03. Focus Area & Suggestions
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Which topic requires the most urgent municipal intervention? <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {concerns.map(cn => (
                <button
                  type="button"
                  key={cn}
                  onClick={() => setPrimaryConcern(cn)}
                  className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-center ${
                    primaryConcern === cn
                      ? 'bg-red-50 border-red-500 text-red-700 ring-2 ring-red-400/30 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  {cn}
                </button>
              ))}
            </div>
            {errors.primaryConcern && (
              <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1 font-bold">
                <AlertCircle className="w-3 h-3" /> {errors.primaryConcern}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
              <span>Suggestions & Detailed Observations <span className="text-red-500">*</span></span>
              <span className="text-[10px] font-mono text-slate-400 font-normal">{suggestions.length}/800 chars</span>
            </div>
            <textarea
              rows={3}
              value={suggestions}
              onChange={e => setSuggestions(e.target.value)}
              maxLength={800}
              placeholder="e.g. Recommend introducing sensor-guided mist dispensers near crowded bus stops to lower PM2.5 levels..."
              className={`w-full bg-slate-50 border rounded-2xl p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none transition-colors ${
                errors.suggestions ? 'border-red-500 bg-red-50' : 'border-slate-300 focus:border-red-500'
              }`}
            />
            {errors.suggestions && (
              <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1 font-bold">
                <AlertCircle className="w-3 h-3" /> {errors.suggestions}
              </p>
            )}
          </div>
        </div>

        {/* Submit Bar */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Info className="w-4 h-4 text-orange-500 shrink-0" />
            <span>Responses update real-time charts and cloud database immediately.</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleResetForm}
              disabled={isSubmitting}
              className="w-1/2 sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors"
            >
              Reset Form
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-1/2 sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white shadow-sm shadow-red-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving to Database...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Response</span>
                </>
              )}
            </button>
          </div>
        </div>

      </form>

    </div>
  );
};
