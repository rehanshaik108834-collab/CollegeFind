import { Link } from 'react-router-dom';
import { MapPin, Heart, GitCompare, TrendingUp, ChevronRight } from 'lucide-react';
import { College } from '../../types';
import { useAuthStore, useCompareStore } from '../../stores';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { savedApi } from '../../api';
import { formatFees, formatPackage, getTypeColor, cn } from '../../utils';
import { StarRating } from '../ui/StarRating';
import { useNavigate } from 'react-router-dom';

interface CollegeCardProps {
  college: College;
  savedIds?: string[];
  index?: number;
}

export function CollegeCard({ college, savedIds = [], index = 0 }: CollegeCardProps) {
  const { isAuthenticated } = useAuthStore();
  const { add, remove, has } = useCompareStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const isSaved = savedIds.includes(college.id);
  const inCompare = has(college.id);

  const saveMutation = useMutation({
    mutationFn: () => isSaved ? savedApi.unsave(college.id) : savedApi.save(college.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-ids'] });
      queryClient.invalidateQueries({ queryKey: ['saved'] });
    },
  });

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) { navigate('/login'); return; }
    saveMutation.mutate();
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inCompare) remove(college.id);
    else add(college.id, college.name);
  };

  const placements = college.placements as any;

  return (
    <div
      className="card group hover:shadow-lg hover:shadow-primary-100 hover:-translate-y-1 transition-all duration-300 flex flex-col"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-primary-100 to-primary-200 flex-shrink-0">
        <img
          src={college.image || `https://images.unsplash.com/photo-1562774053-701939374585?w=600`}
          alt={college.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1562774053-701939374585?w=600`; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Type badge */}
        <span className={cn('absolute top-3 left-3 tag border', getTypeColor(college.type))}>
          {college.type}
        </span>

        {/* Rating badge */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
          <span className="text-amber-500">★</span>
          <span className="text-xs font-bold text-gray-800">{college.rating.toFixed(1)}</span>
        </div>

        {/* Accreditation */}
        {college.accreditation && (
          <div className="absolute bottom-3 left-3 bg-emerald-500/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
            {college.accreditation}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex-1">
          <h3 className="font-display font-semibold text-primary-900 text-base leading-snug mb-1 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {college.name}
          </h3>
          <div className="flex items-center gap-1 text-gray-500 text-xs mb-3">
            <MapPin size={11} className="flex-shrink-0" />
            <span className="truncate">{college.location}</span>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-surface-50 rounded-xl p-2.5">
              <p className="text-[10px] text-gray-400 mb-0.5 uppercase tracking-wide">Annual Fees</p>
              <p className="text-sm font-bold text-primary-700">{formatFees(college.fees)}</p>
            </div>
            <div className="bg-surface-50 rounded-xl p-2.5">
              <p className="text-[10px] text-gray-400 mb-0.5 uppercase tracking-wide">Avg Package</p>
              <p className="text-sm font-bold text-emerald-600">{formatPackage(placements?.avgPackage || 0)}</p>
            </div>
          </div>

          {/* Placement rate */}
          {placements?.placementRate && (
            <div className="flex items-center gap-1.5 mb-3">
              <TrendingUp size={12} className="text-emerald-500" />
              <span className="text-xs text-gray-600">
                <span className="font-semibold text-emerald-600">{placements.placementRate}%</span> placement rate
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-surface-100">
          <Link
            to={`/colleges/${college.slug}`}
            className="flex-1 btn-primary text-sm py-2 text-center flex items-center justify-center gap-1.5"
          >
            View Details <ChevronRight size={13} />
          </Link>
          <button
            onClick={handleCompare}
            className={cn(
              'p-2 rounded-xl border transition-all duration-200',
              inCompare
                ? 'bg-primary-100 border-primary-300 text-primary-700'
                : 'border-surface-200 text-gray-400 hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50'
            )}
            title={inCompare ? 'Remove from compare' : 'Add to compare'}
          >
            <GitCompare size={15} />
          </button>
          <button
            onClick={handleSave}
            disabled={saveMutation.isPending}
            className={cn(
              'p-2 rounded-xl border transition-all duration-200',
              isSaved
                ? 'bg-red-50 border-red-200 text-red-500'
                : 'border-surface-200 text-gray-400 hover:border-red-200 hover:text-red-400 hover:bg-red-50'
            )}
            title={isSaved ? 'Remove from saved' : 'Save college'}
          >
            <Heart size={15} className={isSaved ? 'fill-red-500' : ''} />
          </button>
        </div>
      </div>
    </div>
  );
}
