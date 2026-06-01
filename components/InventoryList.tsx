'use client';

import { MoreVertical } from 'lucide-react';
import { useState } from 'react';

interface InventoryItem {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  condition: string;
  state: 'active' | 'reserved' | 'sold';
  interestedBuyers: number;
}

interface InventoryListProps {
  items: InventoryItem[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function InventoryList({
  items,
  onEdit,
  onDelete,
}: InventoryListProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <p className="text-gray-500 text-center mb-4">No hay productos en esta categoría</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {items.map((item) => (
        <div key={item.id} className="flex gap-3 p-4 hover:bg-gray-50 transition-colors">
          {/* Image */}
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
          />

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Title */}
            <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1">
              {item.title}
            </h3>

            {/* Price and Condition */}
            <p className="text-lg font-bold text-blue-600 mb-1">{item.price}€</p>
            <p className="text-xs text-gray-500 mb-2">{item.condition}</p>

            {/* Interested Buyers Badge */}
            {item.state === 'active' && item.interestedBuyers > 0 && (
              <div className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                {item.interestedBuyers} interesado{item.interestedBuyers > 1 ? 's' : ''}
              </div>
            )}

            {/* State Badge */}
            {item.state === 'reserved' && (
              <div className="inline-block px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">
                Reservado
              </div>
            )}

            {item.state === 'sold' && (
              <div className="inline-block px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
                Vendido
              </div>
            )}
          </div>

          {/* Menu Button */}
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === item.id ? null : item.id)}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            >
              <MoreVertical size={18} className="text-gray-500" />
            </button>

            {/* Dropdown Menu */}
            {activeMenu === item.id && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => {
                    onEdit?.(item.id);
                    setActiveMenu(null);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Editar
                </button>
                <button
                  onClick={() => {
                    onDelete?.(item.id);
                    setActiveMenu(null);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-gray-200"
                >
                  Eliminar
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
