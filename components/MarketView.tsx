'use client';

import { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import CategoryFilters from './CategoryFilters';
import ProductCard from './ProductCard';
import { getProducts } from '@/lib/services/db';

interface Product {
  id: string;
  title: string;
  price: number;
  images: string[];
  category: string;
}

interface MarketViewProps {
  onProductTap?: (productId: string) => void;
}

export default function MarketView({ onProductTap }: MarketViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar productos desde Firestore
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const data = await getProducts();
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

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'Todos' ||
      (selectedCategory === 'Libros' && product.category === 'books') ||
      (selectedCategory === 'Uniformes' && product.category === 'uniforms') ||
      (selectedCategory === 'Mochilas' && product.category === 'bags') ||
      (selectedCategory === 'Material' && product.category === 'supplies') ||
      (selectedCategory === 'Electrónica' && product.category === 'tech');

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <SearchBar value={searchQuery} onChange={setSearchQuery} />
      <CategoryFilters selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

      {/* Product Grid */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <p className="text-gray-500">Cargando productos...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                title={product.title}
                price={product.price}
                image={product.images?.[0] || '/placeholder.png'}
                course={product.category}
                onClick={() => onProductTap?.(product.id)}
              />
            ))}
          </div>
        )}

        {!isLoading && filteredProducts.length === 0 && (
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
