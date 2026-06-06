import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, SlidersHorizontal, X, Grid, List } from 'lucide-react';
import { collegesApi, savedApi } from '../api';
import { CollegeCard } from '../components/college/CollegeCard';
import { FilterPanel } from '../components/college/FilterPanel';
import { Pagination } from '../components/ui/Pagination';
import { CollegeCardSkeleton } from '../components/ui/Skeleton';
import { CollegeQuery } from '../types';
import { useAuthStore } from '../stores';
import { useDebounce } from '../hooks/useDebounce';

export function CollegesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuthStore();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const debouncedSearch = useDebounce(searchInput, 350);

  const [query, setQuery] = useState<CollegeQuery>({
    search: searchParams.get('search') || undefined,
    state: searchParams.get('state') || undefined,
    type: searchParams.get('type') || undefined,
    minFees: searchParams.get('minFees') ? Number(searchParams.get('minFees')) : undefined,
    maxFees: searchParams.get('maxFees') ? Number(searchParams.get('maxFees')) : undefined,
    minRating: searchParams.get('minRating') ? Number(searchParams.get('minRating')) : undefined,
    sortBy: searchParams.get('sortBy') || 'rating',
    sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
    limit: 12,
  });

  // Sync debounced search into query
  useEffect(() => {
    setQuery((q) => ({ ...q, search: debouncedSearch || undefined, page: 1 }));
  }, [debouncedSearch]);

  // Sync query → URL params
  useEffect(() => {
    const params: Record<string, string> = {};
    if (query.search) params.search = query.search;
    if (query.state) params.state = query.state;
    if (query.type) params.type = query.type;
    if (query.minFees) params.minFees = String(query.minFees);
    if (query.maxFees) params.maxFees = String(query.maxFees);
    if (query.minRating) params.minRating = String(query.minRating);
    if (query.sortBy && query.sortBy !== 'rating') params.sortBy = query.sortBy;
    if (query.sortOrder && query.sortOrder !== 'desc') params.sortOrder = query.sortOrder;
    if (query.page && query.page > 1) params.page = String(query.page);
    setSearchParams(params, { replace: true });
  }, [query]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['colleges', query],
    queryFn: () => collegesApi.getAll(query),
    placeholderData: (prev: any) => prev,
  });

  const { data: filters } = useQuery({
    queryKey: ['filters'],
    queryFn: collegesApi.getFilters,
    staleTime: Infinity,
  });

  const { data: savedIds = [] } = useQuery({
    queryKey: ['saved-ids'],
    queryFn: savedApi.getIds,
    enabled: isAuthenticated,
  });

  const updateQuery = useCallback((updates: Partial<CollegeQuery>) => {
    setQuery((q) => ({ ...q, ...updates }));
  }, []);

  const resetFilters = useCallback(() => {
    setSearchInput('');
    setQuery({ sortBy: 'rating', sortOrder: 'desc', page: 1, limit: 12 });
  }, []);

  const hasActiveFilters = !!(query.state || query.type || query.minFees || query.maxFees || query.minRating || query.search);
  const colleges = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Page header */}
      <div className="bg-white border-b border-surface-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <h1 className="font-display font-bold text-2xl text-primary-900">
                Explore Colleges
              </h1>
              <p className="text-gray-500 text-sm mt-0.5">
                {meta ? `${meta.total} colleges found` : 'Discover top institutions across India'}
              </p>
            </div>

            {/* Search bar */}
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search colleges, cities, states..."
                className="input pl-10 pr-10"
              />
              {searchInput && (
                <button
                  onClick={() => setSearchInput('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Mobile filter toggle */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="sm:hidden btn-secondary flex items-center gap-2 text-sm self-start"
            >
              <SlidersHorizontal size={15} />
              Filters
              {hasActiveFilters && (
                <span className="w-5 h-5 bg-primary-600 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                  !
                </span>
              )}
            </button>
          </div>

          {/* Active filter chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="text-xs text-gray-500">Active:</span>
              {query.search && (
                <Chip label={`"${query.search}"`} onRemove={() => { setSearchInput(''); }} />
              )}
              {query.type && <Chip label={query.type} onRemove={() => updateQuery({ type: undefined, page: 1 })} />}
              {query.state && <Chip label={query.state} onRemove={() => updateQuery({ state: undefined, page: 1 })} />}
              {query.minRating && <Chip label={`★ ${query.minRating}+`} onRemove={() => updateQuery({ minRating: undefined, page: 1 })} />}
              {(query.minFees || query.maxFees) && (
                <Chip label="Fees filter" onRemove={() => updateQuery({ minFees: undefined, maxFees: undefined, page: 1 })} />
              )}
              <button onClick={resetFilters} className="text-xs text-red-500 hover:text-red-600 font-medium ml-1">
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-6">
          {/* Sidebar filters — desktop */}
          <aside className="hidden sm:block w-64 flex-shrink-0">
            <FilterPanel filters={filters} query={query} onChange={updateQuery} onReset={resetFilters} />
          </aside>

          {/* College grid */}
          <main className="flex-1 min-w-0">
            {/* Loading overlay for pagination */}
            <div className={`relative transition-opacity ${isFetching && !isLoading ? 'opacity-60' : 'opacity-100'}`}>
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {Array.from({ length: 9 }).map((_, i) => <CollegeCardSkeleton key={i} />)}
                </div>
              ) : colleges.length === 0 ? (
                <EmptyState onReset={resetFilters} />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {colleges.map((college, i) => (
                    <CollegeCard key={college.id} college={college} savedIds={savedIds} index={i} />
                  ))}
                </div>
              )}
            </div>

            {meta && meta.totalPages > 1 && (
              <Pagination meta={meta} onPageChange={(p) => updateQuery({ page: p })} />
            )}
          </main>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 sm:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-primary-900">Filters</h3>
              <button onClick={() => setMobileFiltersOpen(false)} className="p-2 rounded-xl hover:bg-surface-100">
                <X size={18} />
              </button>
            </div>
            <FilterPanel filters={filters} query={query} onChange={(u) => { updateQuery(u); setMobileFiltersOpen(false); }} onReset={() => { resetFilters(); setMobileFiltersOpen(false); }} />
          </div>
        </div>
      )}
    </div>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 bg-primary-100 text-primary-700 text-xs font-medium px-2.5 py-1 rounded-full">
      {label}
      <button onClick={onRemove} className="hover:text-primary-900 ml-0.5"><X size={11} /></button>
    </span>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="text-center py-20">
      <div className="w-20 h-20 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-5">
        <Search size={32} className="text-gray-300" />
      </div>
      <h3 className="font-display font-semibold text-xl text-primary-900 mb-2">No colleges found</h3>
      <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">
        Try adjusting your search or filters to find what you're looking for.
      </p>
      <button onClick={onReset} className="btn-primary">Clear all filters</button>
    </div>
  );
}
