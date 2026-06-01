'use client';

import { useState } from 'react';
import { LogOut, Edit2 } from 'lucide-react';
import ProfileHeader from './ProfileHeader';
import SegmentedControl from './SegmentedControl';
import InventoryList from './InventoryList';
import ReviewsList from './ReviewsList';
import ReviewModal from './ReviewModal';
import EditProfileModal from './EditProfileModal';
import HistoryView from './HistoryView';
import { mockCurrentUser, mockUserProducts, mockUserReviews } from '@/lib/mockData';
import { useAuth } from '@/lib/authContext';

export default function ProfileView() {
  const { logout } = useAuth();
  const [selectedTab, setSelectedTab] = useState<'inventory' | 'reviews' | 'history'>('inventory');
  const [selectedFilter, setSelectedFilter] = useState<'active' | 'reserved' | 'sold'>('active');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

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

  const handleSaveProfile = (data: { name: string; bio: string }) => {
    console.log('[v0] Perfil actualizado:', data);
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
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditProfileOpen(true)}
            className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
            aria-label="Editar perfil"
          >
            <Edit2 size={20} />
          </button>
          <button
            onClick={logout}
            className="p-2 text-gray-600 hover:text-red-600 transition-colors"
            aria-label="Cerrar sesión"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* Tab Selector */}
      <div className="px-4 py-3 border-b border-gray-200 flex gap-2 bg-white overflow-x-auto">
        <button
          onClick={() => setSelectedTab('inventory')}
          className={`pb-2 font-semibold text-sm border-b-2 transition-colors whitespace-nowrap ${
            selectedTab === 'inventory'
              ? 'text-blue-600 border-blue-600'
              : 'text-gray-600 border-transparent'
          }`}
        >
          Inventario
        </button>
        <button
          onClick={() => setSelectedTab('reviews')}
          className={`pb-2 font-semibold text-sm border-b-2 transition-colors whitespace-nowrap ${
            selectedTab === 'reviews'
              ? 'text-blue-600 border-blue-600'
              : 'text-gray-600 border-transparent'
          }`}
        >
          Reseñas ({mockUserReviews.length})
        </button>
        <button
          onClick={() => setSelectedTab('history')}
          className={`pb-2 font-semibold text-sm border-b-2 transition-colors whitespace-nowrap ${
            selectedTab === 'history'
              ? 'text-blue-600 border-blue-600'
              : 'text-gray-600 border-transparent'
          }`}
        >
          Historial
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
        ) : selectedTab === 'reviews' ? (
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
        ) : (
          <HistoryView />
        )}
      </div>

      {/* Modals */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={handleSubmitReview}
      />
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        onSave={handleSaveProfile}
      />
    </div>
  );
}
