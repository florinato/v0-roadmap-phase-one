'use client';

import { useState, useEffect } from 'react';
import { Home, Plus, MessageCircle, User } from 'lucide-react';
import MarketView from '@/components/MarketView';
import ProductDetail from '@/components/ProductDetail';
import SellView from '@/components/SellView';
import InboxView from '@/components/InboxView';
import ChatRoom from '@/components/ChatRoom';
import ProfileView from '@/components/ProfileView';
import OnboardingScreen from '@/components/OnboardingScreen';
import AuthScreen from '@/components/AuthScreen';
import { mockProducts, mockSellers, mockConversations } from '@/lib/mockData';
import { useAuth } from '@/lib/authContext';

export default function EscolarApp() {
  const { user, isLoading, hasSeenOnboarding, completeOnboarding } = useAuth();
  const [activeTab, setActiveTab] = useState('market');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  // Calculate unread messages count
  const unreadMessagesCount = mockConversations.length;

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

  const selectedProduct = selectedProductId
    ? mockProducts.find((p) => p.id === selectedProductId)
    : null;

  const selectedSeller = selectedProduct
    ? mockSellers[selectedProduct.sellerId]
    : null;

  const selectedConversation = selectedConversationId
    ? mockConversations.find((c) => c.id === selectedConversationId)
    : null;

  const renderView = () => {
    // Chat Room view (prioritary)
    if (selectedConversation) {
      return (
        <ChatRoom
          conversationId={selectedConversation.id}
          productId={selectedConversation.productId}
          initialMessages={selectedConversation.messages}
          onBack={() => setSelectedConversationId(null)}
        />
      );
    }

    // Product Detail view
    if (selectedProduct && selectedSeller) {
      return (
        <ProductDetail
          product={selectedProduct}
          seller={selectedSeller}
          onClose={() => setSelectedProductId(null)}
          onContact={() => console.log('Contactar a', selectedSeller.name)}
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
        return <InboxView onSelectConversation={setSelectedConversationId} />;
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
      {!selectedProduct && !selectedConversation && (
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
            onClick={() => setActiveTab('sell')}
            className={`flex flex-col items-center justify-center w-16 h-16 rounded-lg transition-colors ${
              activeTab === 'sell'
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
    </div>
  );
}
