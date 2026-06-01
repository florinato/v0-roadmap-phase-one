'use client';

import { useState } from 'react';
import { Home, Plus, MessageCircle, User } from 'lucide-react';
import MarketView from '@/components/MarketView';
import ProductDetail from '@/components/ProductDetail';
import SellView from '@/components/SellView';
import { mockProducts, mockSellers } from '@/lib/mockData';

export default function EscolarApp() {
  const [activeTab, setActiveTab] = useState('market');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const selectedProduct = selectedProductId
    ? mockProducts.find((p) => p.id === selectedProductId)
    : null;

  const selectedSeller = selectedProduct
    ? mockSellers[selectedProduct.sellerId]
    : null;

  const renderView = () => {
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

    switch (activeTab) {
      case 'market':
        return <MarketView onProductTap={setSelectedProductId} />;
      case 'sell':
        return <SellView />;
      case 'messages':
        return (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 font-medium">Vista Mensajes</p>
          </div>
        );
      case 'profile':
        return (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 font-medium">Vista Perfil</p>
          </div>
        );
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

      {/* Bottom Navigation Bar - Hidden when product detail is open */}
      {!selectedProduct && (
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
            className={`flex flex-col items-center justify-center w-16 h-16 rounded-lg transition-colors ${
              activeTab === 'messages'
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-400 hover:text-gray-600'
            }`}
            aria-label="Mensajes"
          >
            <MessageCircle size={24} />
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
