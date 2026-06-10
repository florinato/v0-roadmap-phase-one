
'use client';

import { ArrowLeft, Star } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  price: number;
  image_url: string; // CAMBIO: imageUrl a image_url
  condition: string;
  course: string;
  state: 'en_venta' | 'reservado' | 'vendido'; // Actualizar posibles estados
  description?: string;
  sellerId: string;
}

interface Seller {
  id: string;
  name: string;
  avatarUrl: string;
  rating: number;
  reviewsCount: number;
}

interface ProductDetailProps {
  product: Product;
  seller: Seller;
  onClose: () => void;
  onContact: () => void;
}

export default function ProductDetail({
  product,
  seller,
  onClose,
  onContact,
}: ProductDetailProps) {
  // Ya no necesitamos isDisabled global, la lógica de visibilidad y estado se maneja directamente en el JSX
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col max-w-md mx-auto">
      {/* Image Gallery Header */}
      <div className="relative w-full bg-gray-100 aspect-square flex items-center justify-center overflow-hidden">
        <img
          src={product.image_url} // CAMBIO: imageUrl a image_url
          alt={product.title}
          className="w-full h-full object-cover"
        />
        <button
          onClick={onClose}
          className="absolute top-4 left-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
          aria-label="Atrás"
        >
          <ArrowLeft size={24} className="text-gray-800" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-24 px-4 pt-4">
        {/* Product Info */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.title}</h1>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-3xl font-bold text-blue-600">{product.price}€</span>
            <span className="text-sm text-gray-500">{product.condition}</span>
          </div>
          <span className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
            {product.course}
          </span>
        </div>

        {/* Description */}
        {product.description && (
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">Descripción</h3>
            <p className="text-gray-700 text-sm leading-relaxed">{product.description}</p>
          </div>
        )}

        {/* Seller Badge */}
        <div className="border border-gray-200 rounded-lg p-4 flex items-center gap-3">
          <img
            src={seller.avatarUrl}
            alt={seller.name}
            className="w-14 h-14 rounded-full object-cover"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{seller.name}</h3>
            <div className="flex items-center gap-1 mt-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < Math.floor(seller.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-700">
                {seller.rating} ({seller.reviewsCount})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Contact Button */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 p-4">
        {product.state === 'en_venta' && (
          <button
            onClick={onContact}
            className="w-full py-4 rounded-lg font-semibold text-lg bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 transition-colors"
          >
            Contactar a {seller.name}
          </button>
        )}
        {product.state === 'reservado' && (
          <button
            disabled
            className="w-full py-4 rounded-lg font-semibold text-lg bg-gray-200 text-gray-500 cursor-not-allowed"
          >
            Reservado
          </button>
        )}
        {product.state === 'vendido' && (
          // El botón se oculta si el producto está vendido
          <button
            disabled
            className="w-full py-4 rounded-lg font-semibold text-lg bg-gray-200 text-gray-500 cursor-not-allowed"
          >
            Vendido
          </button>
        )}
      </div>
    </div>
  );
}
