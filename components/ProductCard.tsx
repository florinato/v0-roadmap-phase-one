'use client';

interface ProductCardProps {
  title: string;
  price: number;
  course: string;
  image: string;
  onClick?: () => void;
}

export default function ProductCard({ title, price, course, image, onClick }: ProductCardProps) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow text-left w-full"
    >
      {/* Image Container */}
      <div className="relative w-full h-40 bg-gray-100 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Title (truncated) */}
        <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1">
          {title}
        </h3>

        {/* Price */}
        <p className="text-lg font-bold text-blue-600 mb-2">
          {price}€
        </p>

        {/* Course Badge */}
        <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded">
          {course}
        </span>
      </div>
    </button>
  );
}
