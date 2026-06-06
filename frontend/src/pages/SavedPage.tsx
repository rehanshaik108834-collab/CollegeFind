import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Heart, ArrowRight, BookmarkX } from 'lucide-react';
import { savedApi } from '../api';
import { CollegeCard } from '../components/college/CollegeCard';
import { CollegeCardSkeleton } from '../components/ui/Skeleton';

export function SavedPage() {
  const { data: colleges = [], isLoading } = useQuery({
    queryKey: ['saved'],
    queryFn: savedApi.getAll,
  });

  const { data: savedIds = [] } = useQuery({
    queryKey: ['saved-ids'],
    queryFn: savedApi.getIds,
  });

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="bg-white border-b border-surface-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
              <Heart size={18} className="text-red-500 fill-red-500" />
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl text-primary-900">Saved Colleges</h1>
              <p className="text-gray-500 text-sm">
                {isLoading ? 'Loading...' : `${colleges.length} college${colleges.length !== 1 ? 's' : ''} saved`}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <CollegeCardSkeleton key={i} />)}
          </div>
        ) : colleges.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-5">
            <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center">
              <BookmarkX size={36} className="text-red-300" />
            </div>
            <div className="text-center">
              <h2 className="font-display font-bold text-xl text-primary-900 mb-2">No saved colleges yet</h2>
              <p className="text-gray-500 max-w-xs">
                Browse colleges and click the heart icon to save them for later.
              </p>
            </div>
            <Link to="/colleges" className="btn-primary flex items-center gap-2">
              Explore Colleges <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {colleges.map((college, i) => (
              <CollegeCard key={college.id} college={college} savedIds={savedIds} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
