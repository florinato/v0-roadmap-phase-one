'use client';

import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import UploadProductModal from './UploadProductModal';
import { getAllProducts } from '@/lib/services/db';
import { Plus } from 'lucide-react';

export default function SellView() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Cargar productos reales desde Supabase
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (error) {
        console.error('[v0] Error loading products:', error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleProductAdded = async () => {
    setIsUploadModalOpen(false);
    // Recargar productos después de agregar uno nuevo
    const data = await getAllProducts();
    setProducts(data);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vender</h1>
          <p className="text-sm text-gray-600">Publica tu artículo en segundos</p>
        </div>
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <Plus size={20} />
          Subir artículo
        </button>
      </div>

      {/* Products Grid */}
      <div className="flex-1 overflow-y-auto px-4 py-6 pb-20">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Cargando artículos...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No hay artículos en venta</p>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Sube tu primer artículo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                title={product.name}
                price={product.price}
                image={product.image_url || '/placeholder.png'}
                course={product.category}
              />
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <UploadProductModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={handleProductAdded}
      />
    </div>
  );
}
