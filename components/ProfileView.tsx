
'use client';

import { useAuth } from '@/lib/authContext';
import { supabase } from '@/lib/supabase'; // Importar supabase
import { Edit2, LogOut, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import EditProfileModal from './EditProfileModal';
import HistoryView from './HistoryView';
import InventoryList from './InventoryList';
import ProfileHeader from './ProfileHeader';
import ReviewModal from './ReviewModal';
import ReviewsList from './ReviewsList';
import SegmentedControl from './SegmentedControl';
import UploadProductModal from './UploadProductModal';

export default function ProfileView() {
  const { logout, user } = useAuth();
  const [selectedTab, setSelectedTab] = useState<'inventory' | 'reviews' | 'history'>('inventory');
  const [selectedFilter, setSelectedFilter] = useState<'en_venta' | 'reservado' | 'vendido'>('en_venta'); // Cambiado a 'en_venta'
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [userProducts, setUserProducts] = useState<any[]>([]);
  const [userReviews, setUserReviews] = useState<any[]>([]);
  const [userTransactions, setUserTransactions] = useState<any[]>([]); // Se inicializa como array vacío
  const [userData, setUserData] = useState<any>(null); // Usar any para simplificar, idealmente definir UserData
  const [isLoading, setIsLoading] = useState(true);

  // Cargar datos del usuario desde la base de datos
  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // Cargar datos del usuario
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, name, bio, avatar_url, rating, reviews_count')
          .eq('id', user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('[v0] Error fetching profile data:', profileError);
        }

        setUserData({
          id: profileData?.id || user?.id || '',
          name: profileData?.name || user?.user_metadata?.full_name || '',
          rating: profileData?.rating || 5.0,
          reviewsCount: profileData?.reviews_count || 0,
          avatar_url: profileData?.avatar_url || user?.user_metadata?.avatar_url || '',
          bio: profileData?.bio || '',
        });

        // Cargar productos del usuario filtrados por el estado seleccionado
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select('id, name, description, price, image_url, category, seller_id, created_at, state')
          .eq('seller_id', user!.id)
          .eq('state', selectedFilter); // Filtrar por el estado seleccionado
        if (productsError) throw new Error(productsError.message || 'Error al cargar los productos del usuario');
        setUserProducts(products || []);

        // Cargar reseñas del usuario
        const { data: reviews, error: reviewsError } = await supabase
          .from('reviews')
          .select('*, reviewer:reviewer_id(name, avatar_url)') // Corregido: reviewer es el alias, reviewer_id es la FK
          .eq('reviewed_user_id', user.id); // reviewed_user_id es el usuario reseñado
        if (reviewsError) throw new Error(reviewsError.message || 'Error al cargar las reseñas del usuario');
        setUserReviews(reviews || []);

        // Eliminar la carga de transacciones, ya que la tabla fue eliminada
        // const { data: transactions, error: transactionsError } = await supabase
        //   .from('transactions')
        //   .select('id, product_id, buyer_id, seller_id, amount, type, status, created_at, updated_at, completed_at')
        //   .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`);
        // if (transactionsError) throw new Error(transactionsError.message || 'Error al cargar las transacciones del usuario');
        // setUserTransactions(transactions || []);
        setUserTransactions([]); // Se inicializa como array vacío

      } catch (error) {
        console.error('[v0] Error loading user data:', error);

      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [user?.id, selectedFilter]); // Añadir selectedFilter a las dependencias del useEffect

  // filteredProducts ya está haciendo el filtro, pero la carga inicial también debe hacerlo
  // const filteredProducts = userProducts.filter((p: any) => p.state === selectedFilter);
  // Ahora userProducts ya contendrá los productos filtrados por selectedFilter
  const filteredProducts = userProducts;

  const handleSubmitReview = async (rating: number, comment: string) => {
    if (!user?.id) return;
    try {
      const { error } = await supabase.from('reviews').insert({
        reviewed_user_id: user.id, // reviewed_user_id es el usuario reseñado
        reviewer_id: user.id, // reviewer_id es el autor de la reseña
        rating,
        comment,
      });
      if (error) throw error;
      console.log('[v0] Reseña guardada con éxito');
      setIsReviewModalOpen(false);
      // Recargar reseñas
      const { data: reviews, error: reviewsError } = await supabase
        .from('reviews')
        .select('*, reviewer:reviewer_id(name, avatar_url)') // Corregido: reviewer es el alias, reviewer_id es la FK
        .eq('reviewed_user_id', user.id);
      if (reviewsError) throw new Error(reviewsError.message || 'Error al recargar las reseñas');
      setUserReviews(reviews || []);
    } catch (error) {
      console.error('[v0] Error al guardar reseña:', error);
    }
  };

  const handleEditProduct = (id: string) => {
    console.log('[v0] Editar producto:', id);
    // TODO: Implementar navegación a edición o modal de edición
  };

  const handleDeleteProduct = async (id: string) => {
    if (!user?.id) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      console.log('[v0] Producto eliminado:', id);
      // Recargar productos
      if (user?.id) {
        supabase
          .from('products')
          .select('id, name, description, price, image_url, category, seller_id, created_at, state')
          .eq('seller_id', user.id)
          .eq('state', selectedFilter) // Filtrar por el estado seleccionado
          .then(({ data, error }) => {
            if (error) console.error('[v0] Error reloading products after delete:', error);
            setUserProducts(data || []);
          });
      }
    } catch (error) {
      console.error('[v0] Error al eliminar producto:', error);
    }
  };

  const handleSaveProfile = async (data: { name: string; bio: string; avatarFile?: File | null }) => {
    if (!user?.id) return;
    let avatarUrl = userData?.avatar_url || null;

    try {
      if (data.avatarFile) {
        const file = data.avatarFile;
        const filePath = `avatars/${user.id}/${Date.now()}-${file.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('product-images') // Usamos el bucket de product-images según especificaciones
          .upload(filePath, file, { cacheControl: '3600', upsert: true });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);
        avatarUrl = publicUrlData.publicUrl;
      }

      const { error } = await supabase
        .from('profiles')
        .update({ name: data.name, bio: data.bio, avatar_url: avatarUrl })
        .eq('id', user.id);
      if (error) throw error;
      console.log('[v0] Perfil actualizado:', data);
      // Actualizar el estado local
      setUserData((prev: any) => ({ ...prev, name: data.name, bio: data.bio, avatar_url: avatarUrl }));
      setIsEditProfileOpen(false);
    } catch (error) {
      console.error('[v0] Error al actualizar perfil:', error);
    }
  };

  const displayName = userData?.name || user?.user_metadata?.full_name || 'Usuario';
  const displayRating = userData?.rating || 5.0;
  const displayReviewsCount = userReviews.length;

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Cargando perfil...</div>;
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <ProfileHeader
          name={displayName}
          avatarUrl={userData?.avatar_url || user?.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop'}
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
            <SegmentedControl 
              selectedFilter={selectedFilter} 
              onFilterChange={setSelectedFilter} 
              options={[
                { label: 'En Venta', value: 'en_venta' },
                { label: 'Reservados', value: 'reservado' },
                { label: 'Vendidos', value: 'vendido' },
              ]} 
            />
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
        initialData={{
          name: userData?.name || '',
          bio: userData?.bio || '',
          avatar_url: userData?.avatar_url || '',
        }}
      />
      <UploadProductModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={() => {
          setIsUploadModalOpen(false);
          // Recargar productos
          if (user?.id) {
            supabase
              .from('products')
              .select('id, name, description, price, image_url, category, seller_id, created_at, state')
              .eq('seller_id', user.id)
              .eq('state', selectedFilter) // Filtrar por el estado seleccionado
              .then(({ data, error }) => {
                if (error) console.error('[v0] Error reloading products after upload:', error);
                setUserProducts(data || []);
              });
          }
        }}
      />
    </div>
  );
}
