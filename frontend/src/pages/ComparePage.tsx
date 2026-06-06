import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { GitCompare, Plus, X, CheckCircle, XCircle, ArrowRight, Trophy } from 'lucide-react';
import { useCompareStore } from '../stores';
import { compareApi } from '../api';
import { formatFees, formatPackage, getTypeColor, cn } from '../utils';
import { StarRating } from '../components/ui/StarRating';
import { College } from '../types';

export function ComparePage() {
  const { ids, names, remove, clear } = useCompareStore();
  const navigate = useNavigate();

  const { data: colleges = [], isLoading } = useQuery({
    queryKey: ['compare', ids],
    queryFn: () => compareApi.compare(ids),
    enabled: ids.length >= 2,
  });

  if (ids.length === 0) {
    return <EmptyCompare />;
  }

  if (ids.length === 1) {
    return (
      <div className="min-h-screen bg-surface-50 flex flex-col items-center justify-center gap-4 px-4">
        <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center">
          <GitCompare size={28} className="text-primary-600" />
        </div>
        <h2 className="font-display font-bold text-2xl text-primary-900">Add one more college</h2>
        <p className="text-gray-500 text-center max-w-xs">You need at least 2 colleges to compare. Browse and add another.</p>
        <div className="flex items-center gap-3">
          <Link to="/colleges" className="btn-primary flex items-center gap-2">
            Browse Colleges <ArrowRight size={15} />
          </Link>
          <button onClick={clear} className="btn-secondary text-sm">Clear all</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 pb-16">
      {/* Header */}
      <div className="bg-white border-b border-surface-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display font-bold text-2xl text-primary-900">Compare Colleges</h1>
              <p className="text-gray-500 text-sm mt-0.5">Side-by-side comparison of {ids.length} colleges</p>
            </div>
            <div className="flex items-center gap-2">
              {ids.length < 3 && (
                <Link to="/colleges" className="btn-secondary text-sm flex items-center gap-2">
                  <Plus size={14} /> Add College
                </Link>
              )}
              <button onClick={clear} className="btn-ghost text-sm text-red-500 hover:bg-red-50 flex items-center gap-1.5">
                <X size={14} /> Clear all
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {isLoading ? (
          <CompareTableSkeleton count={ids.length} />
        ) : (
          <CompareTable colleges={colleges} onRemove={remove} />
        )}
      </div>
    </div>
  );
}

function CompareTable({ colleges, onRemove }: { colleges: College[]; onRemove: (id: string) => void }) {
  const navigate = useNavigate();
  const placements = colleges.map((c) => c.placements as any);

  // Helper: find best (lowest / highest) among numeric values
  const bestLowest = (values: number[]) => Math.min(...values);
  const bestHighest = (values: number[]) => Math.max(...values);

  const fees = colleges.map((c) => c.fees);
  const ratings = colleges.map((c) => c.rating);
  const avgPkg = placements.map((p) => p?.avgPackage || 0);
  const highPkg = placements.map((p) => p?.highestPackage || 0);
  const placementRate = placements.map((p) => p?.placementRate || 0);

  const isBestFees = (val: number) => val === bestLowest(fees);
  const isBestRating = (val: number) => val === bestHighest(ratings);
  const isBestAvgPkg = (val: number) => val === bestHighest(avgPkg);
  const isBestHighPkg = (val: number) => val === bestHighest(highPkg);
  const isBestPlacement = (val: number) => val === bestHighest(placementRate);

  return (
    <div className="space-y-5">
      {/* College header cards */}
      <div className={`grid gap-4`} style={{ gridTemplateColumns: `repeat(${colleges.length}, 1fr)` }}>
        {colleges.map((college) => (
          <div key={college.id} className="card p-5 relative">
            <button
              onClick={() => onRemove(college.id)}
              className="absolute top-3 right-3 p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <X size={14} />
            </button>
            <div className="h-32 rounded-xl overflow-hidden mb-4 bg-primary-50">
              <img
                src={college.image}
                alt={college.name}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1562774053-701939374585?w=400'; }}
              />
            </div>
            <span className={cn('tag border text-xs mb-2', getTypeColor(college.type))}>{college.type}</span>
            <h3 className="font-display font-semibold text-primary-900 text-sm leading-snug mb-1">{college.name}</h3>
            <p className="text-xs text-gray-500 mb-3">{college.location}</p>
            <StarRating rating={college.rating} size="sm" />
            <button
              onClick={() => navigate(`/colleges/${college.slug}`)}
              className="mt-3 w-full btn-secondary text-xs py-2"
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* Comparison table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <tbody className="divide-y divide-surface-100">
              {/* Metric rows */}
              <MetricRow
                label="Annual Fees"
                values={colleges.map((c, i) => ({
                  display: formatFees(c.fees),
                  isBest: isBestFees(c.fees),
                  bestLabel: 'Lowest fees',
                  badgeType: 'good',
                }))}
              />
              <MetricRow
                label="Rating"
                values={colleges.map((c) => ({
                  display: <StarRating rating={c.rating} size="sm" />,
                  isBest: isBestRating(c.rating),
                  bestLabel: 'Highest rated',
                  badgeType: 'good',
                }))}
              />
              <MetricRow
                label="Avg Package"
                values={colleges.map((c, i) => ({
                  display: formatPackage(avgPkg[i]),
                  isBest: isBestAvgPkg(avgPkg[i]),
                  bestLabel: 'Best avg package',
                  badgeType: 'good',
                }))}
              />
              <MetricRow
                label="Highest Package"
                values={colleges.map((c, i) => ({
                  display: formatPackage(highPkg[i]),
                  isBest: isBestHighPkg(highPkg[i]),
                  bestLabel: 'Best highest package',
                  badgeType: 'good',
                }))}
              />
              <MetricRow
                label="Placement Rate"
                values={colleges.map((c, i) => ({
                  display: `${placementRate[i]}%`,
                  isBest: isBestPlacement(placementRate[i]),
                  bestLabel: 'Best placement',
                  badgeType: 'good',
                }))}
              />
              <MetricRow
                label="State"
                values={colleges.map((c) => ({ display: c.state, isBest: false, bestLabel: '', badgeType: 'none' }))}
              />
              <MetricRow
                label="Established"
                values={colleges.map((c) => ({ display: String(c.established), isBest: false, bestLabel: '', badgeType: 'none' }))}
              />
              <MetricRow
                label="Accreditation"
                values={colleges.map((c) => ({ display: c.accreditation || '—', isBest: false, bestLabel: '', badgeType: 'none' }))}
              />
              <MetricRow
                label="Courses Offered"
                values={colleges.map((c) => ({ display: `${c.courses?.length || 0} programs`, isBest: false, bestLabel: '', badgeType: 'none' }))}
              />
              {/* Top recruiters row */}
              <tr className="align-top">
                <td className="py-4 px-5 bg-surface-50 text-sm font-medium text-gray-600 w-40 border-r border-surface-100">
                  Top Recruiters
                </td>
                {colleges.map((c) => (
                  <td key={c.id} className="py-4 px-5">
                    <div className="flex flex-wrap gap-1.5">
                      {((c.placements as any)?.topRecruiters || []).slice(0, 4).map((r: string) => (
                        <span key={r} className="text-xs bg-surface-100 text-gray-600 px-2.5 py-1 rounded-full">{r}</span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
              {/* Facilities row */}
              <tr className="align-top">
                <td className="py-4 px-5 bg-surface-50 text-sm font-medium text-gray-600 w-40 border-r border-surface-100">
                  Facilities
                </td>
                {colleges.map((c) => (
                  <td key={c.id} className="py-4 px-5">
                    <div className="space-y-1.5">
                      {(c.facilities || []).slice(0, 4).map((f) => (
                        <div key={f} className="flex items-center gap-1.5 text-xs text-gray-600">
                          <CheckCircle size={11} className="text-emerald-500 flex-shrink-0" /> {f}
                        </div>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span className="w-4 h-4 bg-emerald-100 border border-emerald-200 rounded" />
          Best value in category
        </span>
        <Trophy size={12} className="text-amber-500" />
        <span>Winner badge</span>
      </div>
    </div>
  );
}

interface MetricValue {
  display: React.ReactNode;
  isBest: boolean;
  bestLabel: string;
  badgeType: 'good' | 'bad' | 'none';
}

function MetricRow({ label, values }: { label: string; values: MetricValue[] }) {
  return (
    <tr className="hover:bg-surface-50/50 transition-colors">
      <td className="py-4 px-5 bg-surface-50 text-sm font-medium text-gray-600 border-r border-surface-100 w-40 whitespace-nowrap">
        {label}
      </td>
      {values.map((v, i) => (
        <td key={i} className={cn('py-4 px-5 text-sm transition-colors', v.isBest && 'bg-emerald-50/60')}>
          <div className="flex items-center gap-2">
            <span className={cn('font-medium', v.isBest ? 'text-emerald-700' : 'text-primary-900')}>
              {v.display}
            </span>
            {v.isBest && (
              <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-semibold whitespace-nowrap">
                <Trophy size={9} /> Best
              </span>
            )}
          </div>
        </td>
      ))}
    </tr>
  );
}

function CompareTableSkeleton({ count }: { count: number }) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${count}, 1fr)` }}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="card p-5 animate-pulse space-y-3">
            <div className="h-32 skeleton rounded-xl" />
            <div className="h-4 skeleton w-3/4" />
            <div className="h-3 skeleton w-1/2" />
            <div className="h-8 skeleton rounded-xl" />
          </div>
        ))}
      </div>
      <div className="card p-6 animate-pulse space-y-4">
        {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-10 skeleton rounded" />)}
      </div>
    </div>
  );
}

function EmptyCompare() {
  return (
    <div className="min-h-screen bg-surface-50 flex flex-col items-center justify-center gap-6 px-4">
      <div className="w-20 h-20 bg-primary-100 rounded-3xl flex items-center justify-center">
        <GitCompare size={36} className="text-primary-600" />
      </div>
      <div className="text-center">
        <h2 className="font-display font-bold text-2xl text-primary-900 mb-2">No colleges to compare</h2>
        <p className="text-gray-500 max-w-sm">Browse colleges and click the compare icon on any card to add them here. You can compare up to 3 at once.</p>
      </div>
      <Link to="/colleges" className="btn-primary flex items-center gap-2">
        Browse Colleges <ArrowRight size={15} />
      </Link>
    </div>
  );
}
