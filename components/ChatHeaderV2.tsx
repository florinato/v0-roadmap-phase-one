'use client';

import { ArrowLeft, MoreVertical } from 'lucide-react';

interface ChatHeaderProps {
  productImage: string;
  productTitle: string;
  productPrice: number;
  productState: 'active' | 'reserved' | 'sold';
  sellerName: string;
  isCurrentUserSeller: boolean;
  onBack: () => void;
  onMarkReserved?: () => void;
  onMarkSold?: () => void;
}

export default function ChatHeader({
  productImage,
  productTitle,
  productPrice,
  productState,
  sellerName,
  isCurrentUserSeller,
  onBack,
  onMarkReserved,
  onMarkSold,
}: ChatHeaderProps) {
  const stateConfig = {
    active: { label: 'Disponible', color: 'bg-green-100 text-green-700' },
    reserved: { label: 'Reservado', color: 'bg-amber-100 text-amber-700' },
    sold: { label: 'Vendido', color: 'bg-red-100 text-red-700' },
  };

  const state = stateConfig[productState] || { label: 'Desconocido', color: 'bg-gray-100 text-gray-700' };

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      {/* Back Button Row */}
      <div className="flex items-center gap-2 mb-3">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <span className="text-sm font-medium text-gray-600">
          Conversación sobre: {productTitle.substring(0, 20)}...
        </span>
      </div>

      {/* Product Card */}
      <div className="flex gap-3 bg-gray-50 p-3 rounded-lg">
        {/* Product Image */}
        <img
          src={productImage}
          alt={productTitle}
          className="w-16 h-16 object-cover rounded"
        />

        {/* Product Info */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-sm text-gray-900 line-clamp-1">
              {productTitle}
            </h3>
            <p className="text-lg font-bold text-blue-600">{productPrice}€</p>
          </div>
          <span className={`text-xs font-medium px-2 py-1 rounded-full w-fit ${state.color}`}>
            {state.label}
          </span>
        </div>

        {/* Menu Button (only for seller) */}
        {isCurrentUserSeller && (
          <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
            <MoreVertical size={18} className="text-gray-500" />
          </button>
        )}
      </div>

      {/* Action Buttons (only for seller and if active) */}
      {isCurrentUserSeller && productState === 'active' && (
        <div className="flex gap-2 mt-3">
          <button
            onClick={onMarkReserved}
            className="flex-1 py-2 px-3 bg-amber-500 text-white text-sm font-semibold rounded-lg hover:bg-amber-600 transition-colors"
          >
            Reservar
          </button>
          <button
            onClick={onMarkSold}
            className="flex-1 py-2 px-3 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors"
          >
            Vendido
          </button>
        </div>
      )}

      {/* Status Info */}
      {productState !== 'active' && (
        <div className="mt-3 p-3 bg-gray-100 rounded-lg text-center">
          <p className="text-xs text-gray-700 font-medium">
            Este producto está {productState === 'reserved' ? 'reservado' : 'vendido'}
          </p>
        </div>
      )}
    </div>
  );
}
