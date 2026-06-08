'use client';

import { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import CategoryFilters from './CategoryFilters';
import ProductCard from './ProductCard';
import { getAllProducts, getProductsByCategory } from '@/lib/services/db';

interface MarketViewProps {
  onProductTap?: (productId: string) => void;
}

export default function MarketView({ onProductTap }: MarketViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar productos desde Supabase
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        if (selectedCategory === 'Todos') {
          const data = await getAllProducts();
          setProducts(data);
        } else {
          // Map category names to database values
          const categoryMap: { [key: string]: string } = {
            'Libros': 'libros',
            'Uniformes': 'ropa',
            'Mochilas': 'mochilas',
            'Material': 'utiles',
            'Electrónica': 'tecnologia',
          };
          const dbCategory = categoryMap[selectedCategory] || selectedCategory.toLowerCase();
          const data = await getProductsByCategory(dbCategory);
          setProducts(data);
        }
      } catch (error) {
        console.error('[v0] Error loading products:', error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [selectedCategory]);

  const filteredProducts = products.filter((product) => {
    return product.name.toLowerCase().includes(searchQuery.toLowerCase());
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
                title={product.name}
                price={product.price}
                image={product.image_url || '/placeholder.png'}
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
