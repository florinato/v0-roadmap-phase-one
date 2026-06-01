'use client';

import { useState } from 'react';
import { LogOut } from 'lucide-react';
import ProfileHeader from './ProfileHeader';
import SegmentedControl from './SegmentedControl';
import InventoryList from './InventoryList';
import ReviewsList from './ReviewsList';
import ReviewModal from './ReviewModal';
import { mockCurrentUser, mockUserProducts, mockUserReviews } from '@/lib/mockData';
import { useAuth } from '@/lib/authContext';

export default function ProfileView() {
  const { logout } = useAuth();
  const [selectedTab, setSelectedTab] = useState<'inventory' | 'reviews'>('inventory');
  const [selectedFilter, setSelectedFilter] = useState<'active' | 'reserved' | 'sold'>('active');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const filteredProducts = mockUserProducts.filter((p) => p.state === selectedFilter);

  const handleSubmitReview = (rating: number, comment: string) => {
    console.log('Nueva reseña:', { rating, comment });
  };

  const handleEditProduct = (id: string) => {
    console.log('[v0] Editar producto:', id);
  };

  const handleDeleteProduct = (id: string) => {
    console.log('[v0] Eliminar producto:', id);
  };

  const handleMarkAsReserved = (id: string) => {
    console.log('[v0] Producto marcado como reservado:', id);
    // Aquí iría la lógica de actualizar el estado
  };

  const handleMarkAsSold = (id: string) => {
    console.log('[v0] Producto marcado como vendido:', id);
    // Aquí iría la lógica de actualizar el estado
  };

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

      {/* Tab Selector */}
      <div className="px-4 py-3 border-b border-gray-200 flex gap-4 bg-white">
        <button
          onClick={() => setSelectedTab('inventory')}
          className={`pb-2 font-semibold text-sm border-b-2 transition-colors ${
            selectedTab === 'inventory'
              ? 'text-blue-600 border-blue-600'
              : 'text-gray-600 border-transparent'
          }`}
        >
          Mi Inventario
        </button>
        <button
          onClick={() => setSelectedTab('reviews')}
          className={`pb-2 font-semibold text-sm border-b-2 transition-colors ${
            selectedTab === 'reviews'
              ? 'text-blue-600 border-blue-600'
              : 'text-gray-600 border-transparent'
          }`}
        >
          Reseñas ({mockUserReviews.length})
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {selectedTab === 'inventory' ? (
          <>
            <SegmentedControl selectedFilter={selectedFilter} onFilterChange={setSelectedFilter} />
            <InventoryList
              items={filteredProducts}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          </>
        ) : (
          <div className="flex flex-col h-full">
            <ReviewsList reviews={mockUserReviews} />
            <div className="p-4 border-t border-gray-200 bg-white">
              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Agregar reseña
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={handleSubmitReview}
      />
    </div>
  );
}
