import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PaginationMeta } from '../../types';
import { cn } from '../../utils';

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export function Pagination({ meta, onPageChange }: PaginationProps) {
  const { page, totalPages, total, limit } = meta;
  if (totalPages <= 1) return null;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  const pages = [];
  const delta = 2;
  for (let i = Math.max(1, page - delta); i <= Math.min(totalPages, page + delta); i++) {
    pages.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
      <p className="text-sm text-gray-500">
        Showing <span className="font-semibold text-primary-900">{from}–{to}</span> of{' '}
        <span className="font-semibold text-primary-900">{total}</span> colleges
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!meta.hasPrev}
          className="p-2 rounded-xl border border-surface-200 text-gray-500 hover:border-primary-300 hover:text-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft size={16} />
        </button>

        {pages[0] > 1 && (
          <>
            <button onClick={() => onPageChange(1)} className="w-9 h-9 rounded-xl text-sm text-gray-600 hover:bg-primary-50 transition-colors">1</button>
            {pages[0] > 2 && <span className="px-1 text-gray-400">…</span>}
          </>
        )}

        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={cn(
              'w-9 h-9 rounded-xl text-sm font-medium transition-all',
              p === page
                ? 'bg-primary-600 text-white shadow-md shadow-primary-200'
                : 'text-gray-600 hover:bg-primary-50'
            )}
          >
            {p}
          </button>
        ))}

        {pages[pages.length - 1] < totalPages && (
          <>
            {pages[pages.length - 1] < totalPages - 1 && <span className="px-1 text-gray-400">…</span>}
            <button onClick={() => onPageChange(totalPages)} className="w-9 h-9 rounded-xl text-sm text-gray-600 hover:bg-primary-50 transition-colors">{totalPages}</button>
          </>
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!meta.hasNext}
          className="p-2 rounded-xl border border-surface-200 text-gray-500 hover:border-primary-300 hover:text-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
