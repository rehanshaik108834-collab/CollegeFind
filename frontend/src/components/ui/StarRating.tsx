import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md';
  showNumber?: boolean;
}

export function StarRating({ rating, size = 'sm', showNumber = true }: StarRatingProps) {
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);
  const sz = size === 'sm' ? 12 : 16;

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {stars.map((s) => (
          <Star
            key={s}
            size={sz}
            className={s <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}
          />
        ))}
      </div>
      {showNumber && (
        <span className={`font-semibold ${size === 'sm' ? 'text-xs' : 'text-sm'} text-gray-700`}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
