'use client';

import { useState } from 'react';
import ProfileHeader from './ProfileHeader';
import SegmentedControl from './SegmentedControl';
import InventoryList from './InventoryList';
import { mockCurrentUser, mockUserProducts } from '@/lib/mockData';

export default function ProfileView() {
  const [selectedFilter, setSelectedFilter] = useState<'active' | 'reserved' | 'sold'>('active');

  const filteredProducts = mockUserProducts.filter((p) => p.state === selectedFilter);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <ProfileHeader
        name={mockCurrentUser.name}
        avatarUrl={mockCurrentUser.avatarUrl}
        rating={mockCurrentUser.rating}
        reviewsCount={mockCurrentUser.reviewsCount}
      />

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
