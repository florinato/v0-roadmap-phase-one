'use client';

import { mockUserProducts } from '@/lib/mockData';

interface TransactionItem {
  id: string;
  productTitle: string;
  productImage: string;
  price: number;
  type: 'purchase' | 'sale';
  date: Date;
  buyerName?: string;
  sellerName?: string;
}

interface HistoryViewProps {
  transactions?: TransactionItem[];
  onClose?: () => void;
}

export default function HistoryView({ transactions = [], onClose }: HistoryViewProps) {
  // Usar transacciones pasadas o mockData como fallback
  const transactionHistory: TransactionItem[] = transactions.length > 0 ? transactions : [
    {
      id: 'th1',
      productTitle: 'Uniforme Talla S',
      productImage: 'https://images.unsplash.com/photo-1618886723857-ba0b32e2a1e9?w=100&h=100&fit=crop',
      price: 30,
      type: 'sale',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      buyerName: 'María López',
    },
    {
      id: 'th2',
      productTitle: 'Libros de Literatura 2º ESO',
      productImage: 'https://images.unsplash.com/photo-1507842217343-583f7270bfba?w=100&h=100&fit=crop',
      price: 18,
      type: 'sale',
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      buyerName: 'Juan Pérez',
    },
    {
      id: 'th3',
      productTitle: 'Diccionario Inglés-Español',
      productImage: 'https://images.unsplash.com/photo-1507842721554-8ee5dd3f7e26?w=100&h=100&fit=crop',
      price: 12,
      type: 'purchase',
      date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      sellerName: 'Carlos Martín',
    },
    {
      id: 'th4',
      productTitle: 'Mochila Escolar Azul',
      productImage: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop',
      price: 40,
      type: 'purchase',
      date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      sellerName: 'Ana García',
    },
  ];

  const formatDate = (date: Date) => {
    const days = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Hoy';
    if (days === 1) return 'Ayer';
    if (days < 7) return `Hace ${days} días`;
    return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="px-4 py-4 bg-white border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900">Historial de Transacciones</h2>
        <p className="text-sm text-gray-600 mt-1">Compras y ventas realizadas</p>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto">
        {transactionHistory.length === 0 ? (
          <div className="flex items-center justify-center h-40">
            <p className="text-gray-500 text-center">No hay transacciones aún</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {transactionHistory.map((transaction) => (
              <div key={transaction.id} className="bg-white p-4 hover:bg-gray-50 transition-colors">
                <div className="flex gap-3">
                  {/* Product Image */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={transaction.productImage}
                      alt={transaction.productTitle}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-gray-900 line-clamp-2">
                      {transaction.productTitle}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {transaction.type === 'sale'
                        ? `Vendido a ${transaction.buyerName}`
                        : `Comprado a ${transaction.sellerName}`}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-bold text-blue-600">{transaction.price}€</span>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          transaction.type === 'sale'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {transaction.type === 'sale' ? 'Vendido' : 'Comprado'}
                      </span>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="text-xs text-gray-500 whitespace-nowrap">
                    {formatDate(transaction.date)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
