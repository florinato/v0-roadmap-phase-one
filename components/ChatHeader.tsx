
'use client';

import { supabase } from '@/lib/supabase'; // Importar supabase
import { ArrowLeft, CheckCircle, Lock } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ChatHeaderProps {
  productId: string;
  onBack: () => void;
}

export default function ChatHeader({ productId, onBack }: ChatHeaderProps) {
  const [product, setProduct] = useState<any>(null); // Estado para el producto
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();

        if (error) {
          throw error;
        }
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product in ChatHeader:', error);
        setProduct(null); // Asegurarse de que el producto sea null si hay un error
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Cargando producto...</div>;
  }

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
        className="shrink-0 p-1.5 hover:bg-gray-100 rounded-lg transition"
        aria-label="Atrás"
      >
        <ArrowLeft size={20} className="text-gray-700" />
      </button>

      <img
        src={product.image_url} // Ya se corrigió a image_url
        alt={product.name} // Usar product.name en lugar de product.title (asumiendo que la DB usa 'name')
        className="w-12 h-12 rounded-lg object-cover shrink-0"
      />

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
          {product.name} {/* Usar product.name */}
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
