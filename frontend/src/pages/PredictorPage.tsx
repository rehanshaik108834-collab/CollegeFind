import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Target, ArrowRight, ArrowLeft, ChevronRight, MapPin, Trophy,
  Sparkles, TrendingUp, GraduationCap, Stethoscope, RotateCcw,
} from 'lucide-react';
import { predictorApi } from '../api';
import { PredictorResult } from '../types';
import { formatFees, formatPackage, cn } from '../utils';

const EXAMS = [
  {
    id: 'JEE',
    name: 'JEE Advanced',
    description: 'For Engineering & Technology colleges (IITs, NITs, BITS)',
    icon: GraduationCap,
    gradient: 'from-blue-500 to-indigo-600',
    bgGlow: 'bg-blue-500/10',
  },
  {
    id: 'NEET',
    name: 'NEET UG',
    description: 'For Medical & Dental colleges (AIIMS, JIPMER, GMCs)',
    icon: Stethoscope,
    gradient: 'from-emerald-500 to-teal-600',
    bgGlow: 'bg-emerald-500/10',
  },
];

const CATEGORIES = ['General', 'OBC', 'SC', 'ST', 'EWS'];

function getMatchColor(level: string) {
  switch (level) {
    case 'Excellent': return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', bar: 'bg-emerald-500', glow: 'shadow-emerald-200' };
    case 'Good': return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', bar: 'bg-blue-500', glow: 'shadow-blue-200' };
    case 'Possible': return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', bar: 'bg-amber-500', glow: 'shadow-amber-200' };
    default: return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', bar: 'bg-gray-500', glow: 'shadow-gray-200' };
  }
}

export function PredictorPage() {
  const [step, setStep] = useState(1);
  const [exam, setExam] = useState('');
  const [rank, setRank] = useState('');
  const [category, setCategory] = useState('General');
  const [submitted, setSubmitted] = useState(false);

  const { data: results, isLoading, isError } = useQuery({
    queryKey: ['predictor', exam, rank, category],
    queryFn: () => predictorApi.predict({ exam, rank: Number(rank), category }),
    enabled: submitted && !!exam && !!rank && !!category,
  });

  const handleExamSelect = (examId: string) => {
    setExam(examId);
    setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rank || Number(rank) < 1) return;
    setSubmitted(true);
    setStep(3);
  };

  const handleReset = () => {
    setStep(1);
    setExam('');
    setRank('');
    setCategory('General');
    setSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-white to-primary-50/30">
      {/* Hero header */}
      <div className="bg-gradient-to-r from-primary-900 via-primary-800 to-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Target size={24} className="text-primary-200" />
            </div>
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold">College Predictor</h1>
              <p className="text-primary-200 text-sm mt-1">Find your best college match based on exam rank</p>
            </div>
          </div>

          {/* Progress steps */}
          <div className="flex items-center gap-2 mt-8">
            {[
              { num: 1, label: 'Select Exam' },
              { num: 2, label: 'Enter Rank' },
              { num: 3, label: 'View Results' },
            ].map((s, i) => (
              <div key={s.num} className="flex items-center">
                <div className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
                  step >= s.num
                    ? 'bg-white/20 text-white'
                    : 'bg-white/5 text-white/40'
                )}>
                  <span className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300',
                    step >= s.num ? 'bg-white text-primary-900' : 'bg-white/10 text-white/40'
                  )}>
                    {step > s.num ? '✓' : s.num}
                  </span>
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
                {i < 2 && <div className={cn('w-8 h-0.5 mx-1', step > s.num ? 'bg-white/40' : 'bg-white/10')} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Step 1: Pick Exam */}
        {step === 1 && (
          <div className="animate-fade-up max-w-2xl mx-auto">
            <h2 className="font-display text-2xl font-semibold text-primary-900 text-center mb-2">Which exam did you take?</h2>
            <p className="text-gray-500 text-center mb-8">Select your entrance exam to get started</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {EXAMS.map((e) => {
                const Icon = e.icon;
                return (
                  <button
                    key={e.id}
                    onClick={() => handleExamSelect(e.id)}
                    className={cn(
                      'group relative card p-8 text-left hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden',
                      exam === e.id && 'ring-2 ring-primary-500'
                    )}
                  >
                    <div className={cn('absolute -top-8 -right-8 w-32 h-32 rounded-full blur-3xl opacity-50', e.bgGlow)} />
                    <div className={cn('w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-4', e.gradient)}>
                      <Icon size={24} className="text-white" />
                    </div>
                    <h3 className="font-display text-xl font-semibold text-primary-900 mb-1">{e.name}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{e.description}</p>
                    <div className="mt-4 flex items-center text-primary-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Select <ArrowRight size={14} className="ml-1" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Enter Rank + Category */}
        {step === 2 && (
          <div className="animate-fade-up max-w-lg mx-auto">
            <button onClick={() => setStep(1)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 mb-6 transition-colors">
              <ArrowLeft size={14} /> Back to exam selection
            </button>

            <div className="card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className={cn(
                  'w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center',
                  exam === 'JEE' ? 'from-blue-500 to-indigo-600' : 'from-emerald-500 to-teal-600'
                )}>
                  {exam === 'JEE' ? <GraduationCap size={18} className="text-white" /> : <Stethoscope size={18} className="text-white" />}
                </div>
                <div>
                  <h2 className="font-display text-xl font-semibold text-primary-900">Enter Your Details</h2>
                  <p className="text-gray-500 text-sm">{exam === 'JEE' ? 'JEE Advanced' : 'NEET UG'} Rank</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Your All India Rank (AIR)</label>
                  <input
                    type="number"
                    value={rank}
                    onChange={(e) => setRank(e.target.value)}
                    placeholder="e.g. 5000"
                    min={1}
                    required
                    className="input text-lg py-3"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                  <div className="grid grid-cols-5 gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={cn(
                          'py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border',
                          category === cat
                            ? 'bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-200'
                            : 'bg-white text-gray-600 border-surface-200 hover:border-primary-300 hover:text-primary-600'
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <button type="submit" className="btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2">
                  <Sparkles size={18} />
                  Find My Colleges
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Step 3: Results */}
        {step === 3 && (
          <div className="animate-fade-up">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div>
                <button onClick={() => { setStep(2); setSubmitted(false); }} className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 mb-2 transition-colors">
                  <ArrowLeft size={14} /> Modify search
                </button>
                <h2 className="font-display text-2xl font-semibold text-primary-900">
                  Your College Predictions
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {exam} · Rank {Number(rank).toLocaleString()} · {category} category
                </p>
              </div>
              <button onClick={handleReset} className="btn-secondary text-sm flex items-center gap-1.5">
                <RotateCcw size={14} /> Start Over
              </button>
            </div>

            {isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card p-5 space-y-3">
                    <div className="skeleton h-40 w-full" />
                    <div className="skeleton h-5 w-3/4" />
                    <div className="skeleton h-4 w-1/2" />
                    <div className="skeleton h-8 w-full" />
                  </div>
                ))}
              </div>
            )}

            {isError && (
              <div className="text-center py-16">
                <p className="text-red-500 text-lg mb-2">Something went wrong</p>
                <p className="text-gray-500 mb-4">Failed to load predictions. Please try again.</p>
                <button onClick={handleReset} className="btn-primary">Try Again</button>
              </div>
            )}

            {results && results.length === 0 && (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <Target size={36} className="text-amber-400" />
                </div>
                <h3 className="font-display text-xl font-semibold text-primary-900 mb-2">No colleges found</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  No colleges match your rank of {Number(rank).toLocaleString()} in {exam} ({category} category).
                  Try a different rank or category.
                </p>
                <button onClick={handleReset} className="btn-primary">Try Different Criteria</button>
              </div>
            )}

            {results && results.length > 0 && (
              <>
                {/* Summary badges */}
                <div className="flex flex-wrap gap-3 mb-6">
                  {(['Excellent', 'Good', 'Possible'] as const).map((level) => {
                    const count = results.filter((r) => r.matchLevel === level).length;
                    if (count === 0) return null;
                    const colors = getMatchColor(level);
                    return (
                      <div key={level} className={cn('badge py-1.5 px-3 text-sm', colors.bg, colors.text, 'border', colors.border)}>
                        {level}: {count} college{count > 1 ? 's' : ''}
                      </div>
                    );
                  })}
                  <div className="badge py-1.5 px-3 text-sm bg-surface-50 text-gray-600 border border-surface-200">
                    Total: {results.length} matches
                  </div>
                </div>

                {/* Result cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {results.map((result: PredictorResult, index: number) => {
                    const colors = getMatchColor(result.matchLevel);
                    const placements = result.college.placements as any;
                    return (
                      <div
                        key={result.college.id}
                        className={cn('card group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col', `hover:${colors.glow}`)}
                        style={{ animationDelay: `${index * 60}ms` }}
                      >
                        {/* Image */}
                        <div className="relative h-40 overflow-hidden bg-gradient-to-br from-primary-100 to-primary-200 flex-shrink-0">
                          <img
                            src={result.college.image || 'https://images.unsplash.com/photo-1562774053-701939374585?w=600'}
                            alt={result.college.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1562774053-701939374585?w=600'; }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                          {/* Match badge */}
                          <div className={cn('absolute top-3 left-3 badge py-1.5 px-3 text-xs font-bold border', colors.bg, colors.text, colors.border)}>
                            <Trophy size={12} /> {result.matchLevel}
                          </div>

                          {/* Score */}
                          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-lg px-2 py-1">
                            <span className="text-xs font-bold text-primary-800">{Math.round(result.score * 100)}%</span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 flex flex-col flex-1">
                          <div className="flex-1">
                            <h3 className="font-display font-semibold text-primary-900 text-base leading-snug mb-1 line-clamp-2 group-hover:text-primary-600 transition-colors">
                              {result.college.name}
                            </h3>
                            <div className="flex items-center gap-1 text-gray-500 text-xs mb-3">
                              <MapPin size={11} className="flex-shrink-0" />
                              <span className="truncate">{result.college.location}</span>
                            </div>

                            {/* Rank range */}
                            <div className="bg-surface-50 rounded-xl p-3 mb-3">
                              <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                                <span>Opening: <span className="font-semibold text-primary-700">{result.openingRank.toLocaleString()}</span></span>
                                <span>Closing: <span className="font-semibold text-primary-700">{result.closingRank.toLocaleString()}</span></span>
                              </div>
                              <div className="w-full bg-surface-200 rounded-full h-2 overflow-hidden">
                                <div
                                  className={cn('h-full rounded-full transition-all duration-700', colors.bar)}
                                  style={{ width: `${Math.max(5, result.score * 100)}%` }}
                                />
                              </div>
                              <p className="text-[10px] text-gray-400 mt-1 text-center">
                                Your rank: {Number(rank).toLocaleString()} · Comfort: {Math.round(result.score * 100)}%
                              </p>
                            </div>

                            {/* Quick stats */}
                            <div className="grid grid-cols-2 gap-2">
                              <div className="text-center p-2 rounded-lg bg-surface-50">
                                <p className="text-[10px] text-gray-400 uppercase">Fees</p>
                                <p className="text-xs font-bold text-primary-700">{formatFees(result.college.fees)}</p>
                              </div>
                              <div className="text-center p-2 rounded-lg bg-surface-50">
                                <p className="text-[10px] text-gray-400 uppercase">Avg Pkg</p>
                                <p className="text-xs font-bold text-emerald-600">{formatPackage(placements?.avgPackage || 0)}</p>
                              </div>
                            </div>

                            {placements?.placementRate && (
                              <div className="flex items-center gap-1.5 mt-2">
                                <TrendingUp size={11} className="text-emerald-500" />
                                <span className="text-xs text-gray-600">
                                  <span className="font-semibold text-emerald-600">{placements.placementRate}%</span> placement rate
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Action */}
                          <div className="pt-3 mt-3 border-t border-surface-100">
                            <Link
                              to={`/colleges/${result.college.slug}`}
                              className="btn-primary w-full text-sm py-2 text-center flex items-center justify-center gap-1.5"
                            >
                              View Details <ChevronRight size={13} />
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
