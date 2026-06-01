'use client';

import { useState } from 'react';
import SearchBar from './SearchBar';
import CategoryFilters from './CategoryFilters';
import ProductCard from './ProductCard';
import { mockProducts, mockSellers } from '@/lib/mockData';

interface MarketViewProps {
  onProductTap?: (productId: string) => void;
}

export default function MarketView({ onProductTap }: MarketViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'Todos' ||
      (selectedCategory === 'Libros' && product.title.toLowerCase().includes('matemática')) ||
      (selectedCategory === 'Uniformes' && product.title.toLowerCase().includes('uniforme')) ||
      (selectedCategory === 'Mochilas' && product.title.toLowerCase().includes('mochila')) ||
      (selectedCategory === 'Cuadernos' && product.title.toLowerCase().includes('cuaderno'));

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <SearchBar value={searchQuery} onChange={setSearchQuery} />
      <CategoryFilters selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

      {/* Product Grid */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-4">
        <div className="grid grid-cols-2 gap-3">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              title={product.title}
              price={product.price}
              image={product.imageUrl}
              course={product.course}
              onClick={() => onProductTap?.(product.id)}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="flex items-center justify-center h-40">
            <p className="text-gray-500 text-center">
              No encontramos productos con esos criterios
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
