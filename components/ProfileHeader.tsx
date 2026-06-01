'use client';

import { Star } from 'lucide-react';

interface ProfileHeaderProps {
  name: string;
  avatarUrl: string;
  rating: number;
  reviewsCount: number;
}

export default function ProfileHeader({
  name,
  avatarUrl,
  rating,
  reviewsCount,
}: ProfileHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-6 text-center">
      {/* Avatar */}
      <img
        src={avatarUrl}
        alt={name}
        className="w-20 h-20 rounded-full mx-auto mb-3 border-2 border-blue-600"
      />

      {/* Name */}
      <h1 className="text-lg font-bold text-gray-900 mb-2">{name}</h1>

      {/* Rating */}
      <div className="flex items-center justify-center gap-2 mb-1">
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              className={i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
            />
          ))}
        </div>
        <span className="font-semibold text-gray-900">{rating.toFixed(1)}</span>
      </div>

      {/* Reviews Count */}
      <p className="text-sm text-gray-500">{reviewsCount} valoraciones</p>
    </div>
  );
}
