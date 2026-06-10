
'use client';

interface SegmentedControlProps {
  selectedFilter: 'en_venta' | 'reservado' | 'vendido';
  onFilterChange: (filter: 'en_venta' | 'reservado' | 'vendido') => void;
  options: { label: string; value: 'en_venta' | 'reservado' | 'vendido' }[];
}

export default function SegmentedControl({
  selectedFilter,
  onFilterChange,
  options,
}: SegmentedControlProps) {
  return (
    <div className="flex gap-0 bg-gray-100 p-1 rounded-lg mx-4 my-4">
      {options.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => onFilterChange(value)}
          className={`flex-1 py-2 px-3 rounded font-medium text-sm transition-colors ${
            selectedFilter === value
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
