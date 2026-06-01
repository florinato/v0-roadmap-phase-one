'use client';

import StarRating from './StarRating';
import { Review } from '@/lib/mockData';

interface ReviewsListProps {
  reviews: Review[];
}

export default function ReviewsList({ reviews }: ReviewsListProps) {
  if (reviews.length === 0) {
    return (
      <div className="px-4 py-8 text-center">
        <p className="text-gray-500 text-sm">Aún no tienes reseñas</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {reviews.map((review) => (
        <div key={review.id} className="px-4 py-4">
          {/* Buyer Info */}
          <div className="flex items-center gap-3 mb-2">
            <img
              src={review.buyerAvatar}
              alt={review.buyerName}
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1">
              <p className="font-semibold text-sm text-gray-900">
                {review.buyerName}
              </p>
              <p className="text-xs text-gray-500">
                {review.date.toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>

          {/* Rating */}
          <div className="mb-2">
            <StarRating rating={review.rating} interactive={false} />
          </div>

          {/* Product & Comment */}
          <p className="text-xs text-gray-500 mb-1">
            En: <span className="font-medium text-gray-700">{review.productTitle}</span>
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            {review.comment}
          </p>
        </div>
      ))}
    </div>
  );
}
