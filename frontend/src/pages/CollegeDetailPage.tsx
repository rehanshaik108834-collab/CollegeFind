import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  MapPin, Calendar, Heart, GitCompare, ArrowLeft, ExternalLink,
  Phone, Award, TrendingUp, Users, BookOpen, Star, Building, ChevronRight,
  CheckCircle, Briefcase
} from 'lucide-react';
import { collegesApi, savedApi } from '../api';
import { useAuthStore, useCompareStore } from '../stores';
import { formatFees, formatPackage, getTypeColor, cn } from '../utils';
import { StarRating } from '../components/ui/StarRating';
import { PageSkeleton } from '../components/ui/Skeleton';
import { CollegeCard } from '../components/college/CollegeCard';

const TABS = ['Overview', 'Courses', 'Placements', 'Reviews'] as const;
type Tab = typeof TABS[number];

export function CollegeDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();
  const { add, remove, has } = useCompareStore();
  const [activeTab, setActiveTab] = useState<Tab>('Overview');

  const { data: college, isLoading, isError } = useQuery({
    queryKey: ['college', slug],
    queryFn: () => collegesApi.getBySlug(slug!),
    enabled: !!slug,
  });

  const { data: savedIds = [] } = useQuery({
    queryKey: ['saved-ids'],
    queryFn: savedApi.getIds,
    enabled: isAuthenticated,
  });

  const saveMutation = useMutation({
    mutationFn: () => isSaved ? savedApi.unsave(college!.id) : savedApi.save(college!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-ids'] });
      queryClient.invalidateQueries({ queryKey: ['saved'] });
    },
  });

  if (isLoading) return <PageSkeleton />;
  if (isError || !college) return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h2 className="font-display text-2xl font-bold text-primary-900 mb-3">College not found</h2>
      <button onClick={() => navigate('/colleges')} className="btn-primary">Back to colleges</button>
    </div>
  );

  const isSaved = savedIds.includes(college.id);
  const inCompare = has(college.id);
  const placements = college.placements as any;

  const handleSave = () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    saveMutation.mutate();
  };

  const handleCompare = () => {
    if (inCompare) remove(college.id);
    else add(college.id, college.name);
  };

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-surface-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link to="/colleges" className="hover:text-primary-600 transition-colors">Colleges</Link>
            <ChevronRight size={14} />
            <span className="text-primary-900 font-medium truncate max-w-xs">{college.name}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <div className="relative h-56 sm:h-72 overflow-hidden">
        <img
          src={college.image || 'https://images.unsplash.com/photo-1562774053-701939374585?w=1200'}
          alt={college.name}
          className="w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1562774053-701939374585?w=1200'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 sm:top-6 sm:left-6 bg-white/20 backdrop-blur-sm text-white rounded-xl p-2 hover:bg-white/30 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
      </div>

      {/* College header card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-16 relative z-10 mb-6">
        <div className="card p-6">
          <div className="flex flex-col lg:flex-row lg:items-start gap-5">
            {/* Logo placeholder */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center flex-shrink-0 shadow-md border-4 border-white">
              <Building size={32} className="text-primary-600" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={cn('tag border text-xs', getTypeColor(college.type))}>{college.type}</span>
                {college.accreditation && (
                  <span className="tag border bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                    <Award size={10} /> {college.accreditation}
                  </span>
                )}
              </div>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-primary-900 mb-2 leading-tight">
                {college.name}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                <span className="flex items-center gap-1"><MapPin size={13} />{college.location}</span>
                <span className="flex items-center gap-1"><Calendar size={13} />Est. {college.established}</span>
                {college.phone && <span className="flex items-center gap-1"><Phone size={13} />{college.phone}</span>}
              </div>
              <div className="mt-3">
                <StarRating rating={college.rating} size="md" showNumber />
                <span className="text-xs text-gray-400 ml-2">({college._count?.savedBy || 0} saves)</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap lg:flex-col gap-2 lg:min-w-[160px]">
              <button
                onClick={handleSave}
                disabled={saveMutation.isPending}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border',
                  isSaved
                    ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
                    : 'bg-white border-surface-200 text-gray-600 hover:border-red-200 hover:text-red-500 hover:bg-red-50'
                )}
              >
                <Heart size={15} className={isSaved ? 'fill-red-500 text-red-500' : ''} />
                {isSaved ? 'Saved' : 'Save'}
              </button>
              <button
                onClick={handleCompare}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border',
                  inCompare
                    ? 'bg-primary-100 border-primary-300 text-primary-700'
                    : 'bg-white border-surface-200 text-gray-600 hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50'
                )}
              >
                <GitCompare size={15} />
                {inCompare ? 'In Compare' : 'Compare'}
              </button>
              {college.website && (
                <a
                  href={college.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium btn-primary"
                >
                  <ExternalLink size={14} /> Website
                </a>
              )}
            </div>
          </div>

          {/* Quick stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-surface-100">
            {[
              { label: 'Annual Fees', value: formatFees(college.fees), color: 'text-primary-700' },
              { label: 'Avg Package', value: formatPackage(placements?.avgPackage || 0), color: 'text-emerald-600' },
              { label: 'Highest Package', value: formatPackage(placements?.highestPackage || 0), color: 'text-purple-600' },
              { label: 'Placement Rate', value: `${placements?.placementRate || 0}%`, color: 'text-accent-500' },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-3 bg-surface-50 rounded-xl">
                <p className={`font-bold text-lg ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs + content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="flex gap-6 flex-col lg:flex-row">
          {/* Left: tabs content */}
          <div className="flex-1 min-w-0">
            {/* Tab nav */}
            <div className="bg-white rounded-2xl border border-surface-200 mb-5">
              <div className="flex overflow-x-auto">
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      'flex-shrink-0 px-6 py-4 text-sm font-medium border-b-2 transition-all',
                      activeTab === tab
                        ? 'border-primary-600 text-primary-700'
                        : 'border-transparent text-gray-500 hover:text-primary-600'
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab panels */}
            {activeTab === 'Overview' && (
              <div className="space-y-5 animate-fade-in">
                <div className="card p-6">
                  <h2 className="font-display font-semibold text-lg text-primary-900 mb-3">About</h2>
                  <p className="text-gray-600 leading-relaxed">{college.description}</p>
                </div>

                {college.highlights?.length > 0 && (
                  <div className="card p-6">
                    <h2 className="font-display font-semibold text-lg text-primary-900 mb-4">Key Highlights</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {college.highlights.map((h, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <CheckCircle size={15} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {college.facilities?.length > 0 && (
                  <div className="card p-6">
                    <h2 className="font-display font-semibold text-lg text-primary-900 mb-4">Facilities</h2>
                    <div className="flex flex-wrap gap-2">
                      {college.facilities.map((f, i) => (
                        <span key={i} className="inline-flex items-center gap-1.5 bg-primary-50 text-primary-700 border border-primary-100 text-sm px-3 py-1.5 rounded-xl">
                          <CheckCircle size={12} className="text-primary-500" /> {f}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'Courses' && (
              <div className="space-y-3 animate-fade-in">
                {college.courses?.length ? (
                  <>
                    <p className="text-sm text-gray-500 mb-4">{college.courses.length} programs offered</p>
                    {college.courses.map((course) => (
                      <div key={course.id} className="card p-5 hover:shadow-md transition-shadow">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <h3 className="font-semibold text-primary-900">{course.name}</h3>
                            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <BookOpen size={13} /> {course.degree}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar size={13} /> {course.duration} Year{course.duration > 1 ? 's' : ''}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users size={13} /> {course.seats} seats
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-primary-700 text-lg">{formatFees(course.fees)}</p>
                            <p className="text-xs text-gray-400">per year</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="card p-10 text-center text-gray-400">No courses listed yet</div>
                )}
              </div>
            )}

            {activeTab === 'Placements' && (
              <div className="space-y-5 animate-fade-in">
                {/* Big numbers */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    { icon: TrendingUp, label: 'Avg CTC', value: formatPackage(placements?.avgPackage || 0), color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
                    { icon: Star, label: 'Highest CTC', value: formatPackage(placements?.highestPackage || 0), color: 'bg-purple-50 text-purple-600 border-purple-100' },
                    { icon: Users, label: 'Placed Students', value: `${placements?.placementRate || 0}%`, color: 'bg-primary-50 text-primary-600 border-primary-100' },
                  ].map((stat) => (
                    <div key={stat.label} className={`card border p-5 text-center ${stat.color}`}>
                      <stat.icon size={22} className="mx-auto mb-2" />
                      <p className="font-bold text-2xl">{stat.value}</p>
                      <p className="text-xs mt-1 opacity-75">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Top recruiters */}
                {placements?.topRecruiters?.length > 0 && (
                  <div className="card p-6">
                    <h2 className="font-display font-semibold text-lg text-primary-900 mb-4">
                      <span className="flex items-center gap-2"><Briefcase size={18} /> Top Recruiters</span>
                    </h2>
                    <div className="flex flex-wrap gap-3">
                      {placements.topRecruiters.map((r: string) => (
                        <div key={r} className="flex items-center gap-2 bg-surface-50 border border-surface-200 rounded-xl px-4 py-2.5">
                          <div className="w-7 h-7 rounded-lg bg-primary-100 flex items-center justify-center text-[10px] font-bold text-primary-700">
                            {r.slice(0, 2).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-gray-700">{r}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'Reviews' && (
              <div className="space-y-4 animate-fade-in">
                {/* Rating summary */}
                <div className="card p-6">
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="font-display font-bold text-5xl text-primary-900">{college.rating.toFixed(1)}</p>
                      <StarRating rating={college.rating} size="md" showNumber={false} />
                      <p className="text-xs text-gray-400 mt-1">Overall rating</p>
                    </div>
                    <div className="flex-1">
                      {[5, 4, 3, 2, 1].map((r) => {
                        const pct = r === 5 ? 60 : r === 4 ? 25 : r === 3 ? 10 : r === 2 ? 3 : 2;
                        return (
                          <div key={r} className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-gray-500 w-4">{r}</span>
                            <span className="text-amber-400 text-xs">★</span>
                            <div className="flex-1 h-1.5 bg-surface-200 rounded-full overflow-hidden">
                              <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-xs text-gray-400 w-6">{pct}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {college.reviews?.length ? (
                  college.reviews.map((review) => (
                    <div key={review.id} className="card p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-sm font-bold text-primary-700">
                            {review.author.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-sm text-primary-900">{review.author}</p>
                            <p className="text-xs text-gray-400">Batch of {review.year}</p>
                          </div>
                        </div>
                        <StarRating rating={review.rating} size="sm" />
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <div className="card p-10 text-center text-gray-400">No reviews yet</div>
                )}
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <aside className="lg:w-72 flex-shrink-0">
            <div className="card p-5 sticky top-24 space-y-5">
              <h3 className="font-semibold text-primary-900">Quick Info</h3>
              <div className="space-y-3">
                {[
                  { label: 'Location', value: college.location },
                  { label: 'State', value: college.state },
                  { label: 'Type', value: college.type },
                  { label: 'Established', value: college.established },
                  { label: 'Accreditation', value: college.accreditation || 'Not listed' },
                  { label: 'Annual Fees', value: formatFees(college.fees) },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-medium text-primary-900 text-right max-w-[160px]">{value}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-surface-100 space-y-2">
                <button onClick={handleSave} className={cn('w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition-all', isSaved ? 'bg-red-50 border-red-200 text-red-600' : 'border-surface-200 text-gray-600 hover:border-red-200 hover:bg-red-50')}>
                  <Heart size={15} className={isSaved ? 'fill-red-500 text-red-500' : ''} />
                  {isSaved ? 'Remove from Saved' : 'Save College'}
                </button>
                <button onClick={handleCompare} className={cn('w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition-all', inCompare ? 'bg-primary-100 border-primary-300 text-primary-700' : 'border-surface-200 text-gray-600 hover:border-primary-200 hover:bg-primary-50')}>
                  <GitCompare size={15} />
                  {inCompare ? 'Remove from Compare' : 'Add to Compare'}
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
