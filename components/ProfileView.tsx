'use client';

import { useState } from 'react';
import { LogOut } from 'lucide-react';
import ProfileHeader from './ProfileHeader';
import SegmentedControl from './SegmentedControl';
import InventoryList from './InventoryList';
import { mockCurrentUser, mockUserProducts } from '@/lib/mockData';
import { useAuth } from '@/lib/authContext';

export default function ProfileView() {
  const { logout } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState<'active' | 'reserved' | 'sold'>('active');

  const filteredProducts = mockUserProducts.filter((p) => p.state === selectedFilter);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <ProfileHeader
          name={mockCurrentUser.name}
          avatarUrl={mockCurrentUser.avatarUrl}
          rating={mockCurrentUser.rating}
          reviewsCount={mockCurrentUser.reviewsCount}
        />
        <button
          onClick={logout}
          className="p-2 text-gray-600 hover:text-red-600 transition-colors"
          aria-label="Cerrar sesión"
        >
          <LogOut size={20} />
        </button>
      </div>

      {/* Segmented Control */}
      <SegmentedControl selectedFilter={selectedFilter} onFilterChange={setSelectedFilter} />

      {/* Inventory List */}
      <div className="flex-1 overflow-y-auto">
        <InventoryList
          items={filteredProducts}
          onEdit={(id) => console.log('Editar:', id)}
          onDelete={(id) => console.log('Eliminar:', id)}
        />
      </div>
    </div>
  );
}
