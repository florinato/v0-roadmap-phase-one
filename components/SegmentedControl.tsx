'use client';

interface SegmentedControlProps {
  selectedFilter: 'active' | 'reserved' | 'sold';
  onFilterChange: (filter: 'active' | 'reserved' | 'sold') => void;
}

export default function SegmentedControl({
  selectedFilter,
  onFilterChange,
}: SegmentedControlProps) {
  return (
    <div className="flex gap-0 bg-gray-100 p-1 rounded-lg mx-4 my-4">
      {[
        { key: 'active', label: 'En Venta' },
        { key: 'reserved', label: 'Reservados' },
        { key: 'sold', label: 'Vendidos' },
      ].map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onFilterChange(key as 'active' | 'reserved' | 'sold')}
          className={`flex-1 py-2 px-3 rounded font-medium text-sm transition-colors ${
            selectedFilter === key
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
