
'use client';

import AuthScreen from '@/components/AuthScreen';
import ChatRoom from '@/components/ChatRoom';
import InboxView from '@/components/InboxView';
import MarketView from '@/components/MarketView';
import OnboardingScreen from '@/components/OnboardingScreen';
import ProductDetail from '@/components/ProductDetail';
import ProfileView from '@/components/ProfileView';
import SellView from '@/components/SellView';
import UploadProductModal from '@/components/UploadProductModal'; // Importar UploadProductModal
import { Home, MessageCircle, Plus, User } from 'lucide-react';
import { useEffect, useState } from 'react';

import { useAuth } from '@/lib/authContext';
import { getOrCreateChat, supabase } from '@/lib/supabase'; // Importar getOrCreateChat

export default function EscolarApp() {
  const { user, isLoading, hasSeenOnboarding, completeOnboarding } = useAuth();
  const [activeTab, setActiveTab] = useState('market');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [selectedProductData, setSelectedProductData] = useState<any>(null);
  const [selectedSellerData, setSelectedSellerData] = useState<any>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false); // Estado para el modal de subida

  const handleProductAdded = () => {
    setIsUploadModalOpen(false);
  };

  // Calculate unread messages count
  const unreadMessagesCount = 0; // Se estableció a 0 ya que mockConversations fue eliminado.

  useEffect(() => {
    const fetchProductAndSeller = async () => {
      if (selectedProductId) {
        // Fetch product data
        const { data: product, error: productError } = await supabase
          .from("products")
          .select("*, profiles(id, name, avatar_url, rating, reviews_count)") // Corrected select for seller profile
          .eq("id", selectedProductId)
          .single();

        if (productError) {
          console.error("Error fetching product:", productError);
          setSelectedProductData(null);
          setSelectedSellerData(null);
          return;
        }

        setSelectedProductData(product);
        setSelectedSellerData(product.profiles); // Access seller data directly from joined query

      } else {
        setSelectedProductData(null);
        setSelectedSellerData(null);
      }
    };

    fetchProductAndSeller();
  }, [selectedProductId]);

  // Show loading state while checking localStorage
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-gray-500">Cargando...</div>
      </div>
    );
  }

  // Show onboarding if user hasn't seen it yet
  if (!hasSeenOnboarding) {
    return <OnboardingScreen onComplete={completeOnboarding} />;
  }

  // Show auth screen if not logged in
  if (!user) {
    return <AuthScreen />;
  }

  const renderView = () => {
    // Chat Room view (prioritary)
    if (selectedConversationId) {
      return (
        <ChatRoom
          conversationId={selectedConversationId}
          productId={selectedProductId ?? ''} // Asegurarse de que productId no sea null
          initialMessages={[]}
          onBack={() => {
            setSelectedConversationId(null);
            setSelectedProductId(null);
          }}
        />
      );
    }

    // Product Detail view
    if (selectedProductId && selectedProductData && selectedSellerData) {
      return (
        <ProductDetail
          product={selectedProductData}
          seller={selectedSellerData}
          onClose={() => setSelectedProductId(null)}
          onContact={async () => {
            if (user?.id && selectedProductData && selectedSellerData) {
              try {
                const chatId = await getOrCreateChat(selectedProductData.id, user.id, selectedSellerData.id);
                setSelectedConversationId(chatId);
                // Asegurarse de que productId también se establezca al contactar
                setSelectedProductId(selectedProductData.id);
                setActiveTab("messages"); // Cambiar a la pestaña de mensajes
                // setSelectedProductId(null); // No limpiar el productId aquí si vamos a la vista de chat
              } catch (error) {
                console.error("Error al contactar al vendedor:", error);
              }
            }
          }}
        />
      );
    }

    // Tab views
    switch (activeTab) {
      case 'market':
        return <MarketView onProductTap={setSelectedProductId} />;
      case 'sell':
        return <SellView />;
      case 'messages':
        // Pasar una función que actualiza tanto conversationId como productId
        return <InboxView onSelectConversation={(convId, prodId) => {
          setSelectedConversationId(convId);
          setSelectedProductId(prodId);
        }} />;
      case 'profile':
        return <ProfileView />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white relative">
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto pb-20">
        {renderView()}
      </div>

      {/* Bottom Navigation Bar - Hidden when product detail or chat is open */}
      {!selectedProductId && !selectedConversationId && (
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 flex justify-around items-center h-20">
          <button
            onClick={() => setActiveTab('market')}
            className={`flex flex-col items-center justify-center w-16 h-16 rounded-lg transition-colors ${
              activeTab === 'market'
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-400 hover:text-gray-600'
            }`}
            aria-label="Mercado"
          >
            <Home size={24} />
            <span className="text-xs mt-1 font-medium">Mercado</span>
          </button>

          <button
            onClick={() => setIsUploadModalOpen(true)} // Abrir modal directamente
            className={`flex flex-col items-center justify-center w-16 h-16 rounded-lg transition-colors ${
              activeTab === 'sell' // Mantener el estilo activo si se decide usarlo para el botón, aunque ya no sea una 'tab' real
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-400 hover:text-gray-600'
            }`}
            aria-label="Vender"
          >
            <Plus size={24} />
            <span className="text-xs mt-1 font-medium">Vender</span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`relative flex flex-col items-center justify-center w-16 h-16 rounded-lg transition-colors ${
              activeTab === 'messages'
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-400 hover:text-gray-600'
            }`}
            aria-label="Mensajes"
          >
            <MessageCircle size={24} />
            {unreadMessagesCount > 0 && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
              </div>
            )}
            <span className="text-xs mt-1 font-medium">Mensajes</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center justify-center w-16 h-16 rounded-lg transition-colors ${
              activeTab === 'profile'
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-400 hover:text-gray-600'
            }`}
            aria-label="Perfil"
          >
            <User size={24} />
            <span className="text-xs mt-1 font-medium">Perfil</span>
          </button>
        </nav>
      )}

      {/* Upload Modal - Renderizado globalmente */}
      <UploadProductModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={handleProductAdded}
      />
    </div>
  );
}
