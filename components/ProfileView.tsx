'use client';

import { useState, useEffect } from 'react';
import { LogOut, Edit2, Plus } from 'lucide-react';
import ProfileHeader from './ProfileHeader';
import SegmentedControl from './SegmentedControl';
import InventoryList from './InventoryList';
import ReviewsList from './ReviewsList';
import ReviewModal from './ReviewModal';
import EditProfileModal from './EditProfileModal';
import UploadProductModal from './UploadProductModal';
import HistoryView from './HistoryView';
import { useAuth } from '@/lib/authContext';
import {
  getUserProducts,
  getUserReviews,
  getUserTransactions,
  getCurrentUserData,
} from '@/lib/services/db';
import { mockCurrentUser, mockUserProducts, mockUserReviews } from '@/lib/mockData';

export default function ProfileView() {
  const { logout, user } = useAuth();
  const [selectedTab, setSelectedTab] = useState<'inventory' | 'reviews' | 'history'>('inventory');
  const [selectedFilter, setSelectedFilter] = useState<'active' | 'reserved' | 'sold'>('active');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [userProducts, setUserProducts] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [userTransactions, setUserTransactions] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar datos del usuario desde la base de datos
  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.id) return;

      setIsLoading(true);
      try {
        // Cargar datos del usuario
        const currentUserData = await getCurrentUserData(user.id);
        setUserData(currentUserData || { name: user.name, rating: 5.0, reviewsCount: 0 });

        // Cargar productos del usuario
        const products = await getUserProducts(user.id);
        setUserProducts(products.length > 0 ? products : mockUserProducts);

        // Cargar reseñas del usuario
        const reviews = await getUserReviews(user.id);
        setUserReviews(reviews.length > 0 ? reviews : mockUserReviews);

        // Cargar transacciones del usuario
        const transactions = await getUserTransactions(user.id);
        setUserTransactions(transactions);
      } catch (error) {
        console.error('[v0] Error loading user data:', error);
        // Fallback a mockData
        setUserData(mockCurrentUser);
        setUserProducts(mockUserProducts);
        setUserReviews(mockUserReviews);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [user?.id]); // ✅ Solo depende del ID del usuario, no del objeto completo

  const filteredProducts = userProducts.filter((p) => p.state === selectedFilter);

  const handleSubmitReview = async (rating: number, comment: string) => {
    console.log('[v0] Nueva reseña:', { rating, comment });
    // TODO: Implementar guardado en Firebase
  };

  const handleEditProduct = (id: string) => {
    console.log('[v0] Editar producto:', id);
  };

  const handleDeleteProduct = (id: string) => {
    console.log('[v0] Eliminar producto:', id);
  };

  const handleSaveProfile = async (data: { name: string; bio: string }) => {
    console.log('[v0] Perfil actualizado:', data);
    // TODO: Implementar update en Firebase
  };

  const displayName = userData?.name || user?.name || 'Usuario';
  const displayRating = userData?.rating || 5.0;
  const displayReviewsCount = userData?.reviewsCount || 0;

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Cargando perfil...</div>;
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <ProfileHeader
          name={displayName}
          avatarUrl={user?.avatarUrl || 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop'}
          rating={displayRating}
          reviewsCount={displayReviewsCount}
        />
        <div className="flex gap-2">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
            aria-label="Subir artículo"
          >
            <Plus size={20} />
          </button>
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
          Reseñas ({userReviews.length})
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
            <ReviewsList reviews={userReviews} />
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
          <HistoryView transactions={userTransactions} />
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
      <UploadProductModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={() => {
          setIsUploadModalOpen(false);
          // Recargar productos
          if (user?.id) {
            getUserProducts(user.id).then((products) => {
              setUserProducts(products.length > 0 ? products : mockUserProducts);
            });
          }
        }}
      />
    </div>
  );
}
