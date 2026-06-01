'use client';

import { mockConversations, mockProducts, mockSellers } from '@/lib/mockData';

interface InboxViewProps {
  onSelectConversation?: (conversationId: string) => void;
}

function formatTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);

  if (diffMins < 1) return 'Ahora';
  if (diffMins < 60) return `hace ${diffMins}m`;
  if (diffHours < 24) return `hace ${diffHours}h`;
  return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
}

export default function InboxView({ onSelectConversation }: InboxViewProps) {
  if (mockConversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500 font-medium">No hay conversaciones</p>
          <p className="text-gray-400 text-sm">
            Empieza a contactar con vendedores
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="px-4 py-3 bg-white border-b border-gray-200">
        <h2 className="font-bold text-lg text-gray-900">Mensajes</h2>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-gray-200">
        {mockConversations.map((conversation) => {
          const product = mockProducts.find(
            (p) => p.id === conversation.productId
          );
          const seller = mockSellers[conversation.sellerId];

          if (!product || !seller) return null;

          return (
            <button
              key={conversation.id}
              onClick={() => onSelectConversation?.(conversation.id)}
              className="w-full bg-white hover:bg-gray-50 transition px-4 py-3 text-left"
            >
              <div className="flex gap-3">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
                      {product.title}
                    </h3>
                    <span className="text-xs text-gray-500 flex-shrink-0">
                      {formatTime(conversation.lastMessageTime)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-blue-600 font-bold text-sm">
                      {product.price}€
                    </p>
                    <p className="text-xs text-gray-500">•</p>
                    <p className="text-xs text-gray-600">{seller.name}</p>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-1 mt-1">
                    {conversation.lastMessage}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
