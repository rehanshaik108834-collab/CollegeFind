import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import {
  MessageSquare, Search, ThumbsUp, Eye, MessageCircle,
  Plus, Clock, TrendingUp, ChevronRight, GraduationCap,
} from 'lucide-react';
import { discussionsApi } from '../api';
import { useAuthStore } from '../stores';
import { cn } from '../utils';

const CATEGORIES = ['All', 'Admissions', 'Placements', 'Campus Life', 'Exams', 'General'];

function getCategoryColor(category: string) {
  const map: Record<string, string> = {
    Admissions: 'bg-blue-50 text-blue-700 border-blue-200',
    Placements: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Campus Life': 'bg-purple-50 text-purple-700 border-purple-200',
    Exams: 'bg-amber-50 text-amber-700 border-amber-200',
    General: 'bg-gray-50 text-gray-700 border-gray-200',
  };
  return map[category] || 'bg-gray-50 text-gray-700 border-gray-200';
}

function timeAgo(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function DiscussionsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuthStore();
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');

  const category = searchParams.get('category') || '';
  const sort = (searchParams.get('sort') as 'newest' | 'votes') || 'newest';
  const page = Number(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || '';

  const { data, isLoading } = useQuery({
    queryKey: ['discussions', category, sort, page, search],
    queryFn: () => discussionsApi.getAll({
      category: category || undefined,
      sort,
      page,
      search: search || undefined,
    }),
  });

  const updateParams = (updates: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) newParams.set(key, value);
      else newParams.delete(key);
    });
    if (updates.category !== undefined || updates.search !== undefined || updates.sort !== undefined) {
      newParams.delete('page');
    }
    setSearchParams(newParams);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ search: searchInput });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-white to-primary-50/30">
      {/* Hero */}
      <div className="bg-gradient-to-r from-primary-900 via-primary-800 to-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <MessageSquare size={24} className="text-primary-200" />
              </div>
              <div>
                <h1 className="font-display text-3xl sm:text-4xl font-bold">Discussions</h1>
                <p className="text-primary-200 text-sm mt-1">Ask questions, share experiences, help fellow students</p>
              </div>
            </div>
            <Link
              to={isAuthenticated ? '/discussions/ask' : '/login'}
              className="btn-primary flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/20"
            >
              <Plus size={16} /> Ask a Question
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Filters row */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Category tabs */}
          <div className="flex-1 flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const isActive = (cat === 'All' && !category) || cat === category;
              return (
                <button
                  key={cat}
                  onClick={() => updateParams({ category: cat === 'All' ? '' : cat })}
                  className={cn(
                    'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border',
                    isActive
                      ? 'bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-200'
                      : 'bg-white text-gray-600 border-surface-200 hover:border-primary-300 hover:text-primary-600'
                  )}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search + Sort */}
          <div className="flex gap-2">
            <form onSubmit={handleSearch} className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search discussions..."
                className="input pl-10 pr-4 py-2 w-56"
              />
            </form>
            <div className="flex border border-surface-200 rounded-xl overflow-hidden">
              <button
                onClick={() => updateParams({ sort: 'newest' })}
                className={cn(
                  'px-3 py-2 text-sm font-medium flex items-center gap-1 transition-colors',
                  sort === 'newest' ? 'bg-primary-50 text-primary-700' : 'bg-white text-gray-500 hover:text-primary-600'
                )}
              >
                <Clock size={14} /> New
              </button>
              <button
                onClick={() => updateParams({ sort: 'votes' })}
                className={cn(
                  'px-3 py-2 text-sm font-medium flex items-center gap-1 transition-colors border-l border-surface-200',
                  sort === 'votes' ? 'bg-primary-50 text-primary-700' : 'bg-white text-gray-500 hover:text-primary-600'
                )}
              >
                <TrendingUp size={14} /> Top
              </button>
            </div>
          </div>
        </div>

        {/* Thread list */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="card p-5 space-y-3">
                <div className="skeleton h-5 w-3/4" />
                <div className="skeleton h-4 w-full" />
                <div className="flex gap-4">
                  <div className="skeleton h-4 w-16" />
                  <div className="skeleton h-4 w-16" />
                  <div className="skeleton h-4 w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : data?.data.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-primary-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <MessageSquare size={36} className="text-primary-300" />
            </div>
            <h3 className="font-display text-xl font-semibold text-primary-900 mb-2">No discussions yet</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              Be the first to start a discussion! Ask a question or share your experience.
            </p>
            <Link to={isAuthenticated ? '/discussions/ask' : '/login'} className="btn-primary">
              Ask a Question
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {data?.data.map((thread) => (
              <Link
                key={thread.id}
                to={`/discussions/${thread.id}`}
                className="card group flex gap-4 p-5 hover:shadow-md hover:shadow-primary-100 transition-all duration-200"
              >
                {/* Vote count */}
                <div className="flex flex-col items-center justify-start pt-1 min-w-[48px]">
                  <div className={cn(
                    'flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl',
                    thread.upvotes > 10 ? 'bg-primary-50 text-primary-700' : 'bg-surface-50 text-gray-500'
                  )}>
                    <ThumbsUp size={14} />
                    <span className="text-sm font-bold">{thread.upvotes}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 mb-1">
                    <h3 className="font-display font-semibold text-primary-900 text-base group-hover:text-primary-600 transition-colors line-clamp-1">
                      {thread.title}
                    </h3>
                  </div>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-3">{thread.body}</p>

                  <div className="flex flex-wrap items-center gap-3">
                    <span className={cn('badge text-xs border', getCategoryColor(thread.category))}>
                      {thread.category}
                    </span>

                    {thread.college && (
                      <span className="badge text-xs bg-primary-50 text-primary-700 border border-primary-200">
                        <GraduationCap size={10} /> {thread.college.name}
                      </span>
                    )}

                    <span className="text-xs text-gray-400">by {thread.author.name}</span>
                    <span className="text-xs text-gray-400">{timeAgo(thread.createdAt)}</span>

                    <div className="flex items-center gap-3 ml-auto text-xs text-gray-400">
                      <span className="flex items-center gap-1"><MessageCircle size={12} /> {thread._count.answers}</span>
                      <span className="flex items-center gap-1"><Eye size={12} /> {thread.views}</span>
                    </div>
                  </div>
                </div>

                <div className="hidden sm:flex items-center text-gray-300 group-hover:text-primary-400 transition-colors">
                  <ChevronRight size={18} />
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {data?.meta && data.meta.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => updateParams({ page: String(page - 1) })}
              disabled={!data.meta.hasPrev}
              className="btn-secondary text-sm py-2 px-4 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-500">
              Page {data.meta.page} of {data.meta.totalPages}
            </span>
            <button
              onClick={() => updateParams({ page: String(page + 1) })}
              disabled={!data.meta.hasNext}
              className="btn-secondary text-sm py-2 px-4 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
