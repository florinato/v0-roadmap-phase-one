'use client';

import { ArrowLeft, Lock, CheckCircle } from 'lucide-react';
import { mockProducts, mockSellers } from '@/lib/mockData';

interface ChatHeaderProps {
  productId: string;
  onBack: () => void;
}

export default function ChatHeader({ productId, onBack }: ChatHeaderProps) {
  const product = mockProducts.find((p) => p.id === productId);
  if (!product) return null;

  const getStateInfo = () => {
    if (product.state === 'reserved') {
      return { text: 'Reservado', icon: Lock, color: 'text-amber-600' };
    }
    if (product.state === 'sold') {
      return { text: 'Vendido', icon: CheckCircle, color: 'text-green-600' };
    }
    return { text: 'Disponible', icon: CheckCircle, color: 'text-green-600' };
  };

  const stateInfo = getStateInfo();
  const StateIcon = stateInfo.icon;

  return (
    <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 shadow-sm">
      <button
        onClick={onBack}
        className="flex-shrink-0 p-1.5 hover:bg-gray-100 rounded-lg transition"
        aria-label="Atrás"
      >
        <ArrowLeft size={20} className="text-gray-700" />
      </button>

      <img
        src={product.imageUrl}
        alt={product.title}
        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
      />

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
          {product.title}
        </h3>
        <div className="flex items-center gap-2">
          <p className="text-lg font-bold text-blue-600">{product.price}€</p>
          <StateIcon size={14} className={stateInfo.color} />
          <span className="text-xs text-gray-600">{stateInfo.text}</span>
        </div>
      </div>
    </div>
  );
}
