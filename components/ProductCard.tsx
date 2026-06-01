'use client';

import Image from 'next/image';

export interface Product {
  id: string;
  title: string;
  price: number;
  course: string;
  image: string;
  seller: string;
  rating: number;
}

interface ProductCardProps {
  product: Product;
  onTap: (product: Product) => void;
}

export default function ProductCard({ product, onTap }: ProductCardProps) {
  return (
    <button
      onClick={() => onTap(product)}
      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow text-left"
    >
      {/* Image Container */}
      <div className="relative w-full h-40 bg-gray-100 overflow-hidden">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Title (truncated) */}
        <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1">
          {product.title}
        </h3>

        {/* Price */}
        <p className="text-lg font-bold text-blue-600 mb-2">
          {product.price}€
        </p>

        {/* Course Badge */}
        <div className="flex items-center gap-2">
          <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded">
            {product.course}
          </span>
          <span className="text-xs text-gray-500">{product.seller}</span>
        </div>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1">
          <span className="text-xs font-medium text-yellow-500">★ {product.rating.toFixed(1)}</span>
        </div>
      </div>
    </button>
  );
}
