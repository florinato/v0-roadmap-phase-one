'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="sticky top-0 bg-white z-10 p-4 border-b border-gray-200">
      <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
        <Search size={20} className="text-gray-400" />
        <Input
          type="text"
          placeholder="Buscar libros, uniformes..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-transparent border-0 text-sm placeholder-gray-500 focus:outline-none focus:ring-0"
        />
      </div>
    </div>
  );
}
