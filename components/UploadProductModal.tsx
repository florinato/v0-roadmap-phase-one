'use client';

import React, { useState, useRef } from 'react';
import { X, Upload } from 'lucide-react';
import { useAuth } from '@/lib/authContext';

interface UploadProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UploadProductModal({ isOpen, onClose, onSuccess }: UploadProductModalProps) {
  const { user } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'libros',
    state: 'perfecto',
  });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('[v0] Image selected:', file.name);
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    console.log('[v0] Upload button clicked');
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('state', formData.state);
      
      if (image) {
        formDataToSend.append('image', image);
      }

      const response = await fetch('/api/products/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.id || ''}`,
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al subir el artículo');
      }

      setFormData({ name: '', description: '', price: '', category: 'libros', state: 'perfecto' });
      setImage(null);
      setPreview(null);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">Subir Artículo</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Imagen</label>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            
            {preview ? (
              <div className="relative group">
                <img src={preview} alt="Preview" className="w-full h-40 object-cover rounded" />
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setPreview(null);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded hover:bg-red-600 opacity-0 group-hover:opacity-100 transition"
                >
                  <X size={16} />
                </button>
                <button
                  type="button"
                  onClick={handleUploadClick}
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded transition"
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={handleUploadClick}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition flex flex-col items-center justify-center"
              >
                <Upload size={32} className="text-gray-400 mb-2" />
                <p className="font-medium text-gray-700">Añade fotos del artículo</p>
                <p className="text-sm text-gray-500">PNG, JPG, GIF hasta 10MB</p>
              </button>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Nombre del artículo</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej: Libro de Matemáticas"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Descripción</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe el estado, detalles importantes..."
              rows={3}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium mb-2">Precio ($)</label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="0.00"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2">Categoría</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value="libros">Libros</option>
              <option value="utiles">Útiles</option>
              <option value="ropa">Ropa</option>
              <option value="tecnologia">Tecnología</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          {/* State */}
          <div>
            <label className="block text-sm font-medium mb-2">Estado</label>
            <select
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value="perfecto">Perfecto</option>
              <option value="muy_bueno">Muy Bueno</option>
              <option value="bueno">Bueno</option>
              <option value="regular">Regular</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {isLoading ? 'Subiendo...' : 'Subir Artículo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
