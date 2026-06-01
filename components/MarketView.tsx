'use client';

import { useState } from 'react';
import SearchBar from './SearchBar';
import CategoryFilters from './CategoryFilters';
import ProductCard, { Product } from './ProductCard';

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Libro de Matemáticas 4º ESO - Anaya',
    price: 18,
    course: '4º ESO',
    image: 'https://images.unsplash.com/photo-1507842217343-583f7270bfba?w=400&h=300&fit=crop',
    seller: 'María García',
    rating: 4.8,
  },
  {
    id: '2',
    title: 'Uniforme escolar - Falda azul marino T10',
    price: 25,
    course: 'Primaria',
    image: 'https://images.unsplash.com/photo-1523381294911-8d3cead67c5e?w=400&h=300&fit=crop',
    seller: 'Elena Ruiz',
    rating: 4.9,
  },
  {
    id: '3',
    title: 'Mochila Eastpak gris - Como nueva',
    price: 35,
    course: 'Secundaria',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop',
    seller: 'Juan López',
    rating: 4.7,
  },
  {
    id: '4',
    title: 'Diccionario Inglés-Español Oxford',
    price: 12,
    course: '2º Bachiller',
    image: 'https://images.unsplash.com/photo-1507842217343-583f7270bfba?w=400&h=300&fit=crop',
    seller: 'Carlos Pérez',
    rating: 4.5,
  },
  {
    id: '5',
    title: 'Cuadernos Oxford 100 páginas x5',
    price: 8,
    course: 'Primaria',
    image: 'https://images.unsplash.com/photo-1507842217343-583f7270bfba?w=400&h=300&fit=crop',
    seller: 'Ana Martínez',
    rating: 4.6,
  },
  {
    id: '6',
    title: 'Calculadora gráfica CASIO fx-9860GII',
    price: 42,
    course: 'Bachiller',
    image: 'https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=400&h=300&fit=crop',
    seller: 'David Sánchez',
    rating: 4.9,
  },
];

interface MarketViewProps {
  onProductTap?: (product: Product) => void;
}

export default function MarketView({ onProductTap }: MarketViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const filteredProducts = MOCK_PRODUCTS.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'Todos' ||
      (selectedCategory === 'Libros' && product.title.toLowerCase().includes('libro')) ||
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
              product={product}
              onTap={onProductTap || (() => {})}
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
