'use client';

import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  onChange?: (rating: number) => void;
  interactive?: boolean;
}

export default function StarRating({ rating, onChange, interactive = false }: StarRatingProps) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => interactive && onChange?.(star)}
          disabled={!interactive}
          className={`transition-colors ${
            interactive ? 'cursor-pointer' : 'cursor-default'
          } ${
            star <= rating
              ? 'text-yellow-400'
              : 'text-gray-300'
          }`}
        >
          <Star size={20} fill={star <= rating ? 'currentColor' : 'none'} />
        </button>
      ))}
    </div>
  );
}
