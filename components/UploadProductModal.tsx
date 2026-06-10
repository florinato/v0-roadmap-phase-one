
'use client';

import { useAuth } from '@/lib/authContext';
import { supabase } from '@/lib/supabase'; // Importar supabase
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation'; // Importar useRouter
import React, { useRef, useState } from 'react';

interface UploadProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UploadProductModal({ isOpen, onClose, onSuccess }: UploadProductModalProps) {
  const { user } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter(); // Inicializar router
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'libros',
    state: 'en_venta',
  });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!user?.id) {
      setError('Usuario no autenticado');
      setIsLoading(false);
      return;
    }

    try {
      let imageUrl: string | null = null;

      if (image) {
        const fileExtension = image.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExtension}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('product-images') // Coincide con el nombre del bucket en Supabase
          .upload(fileName, image, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);

        imageUrl = publicUrlData.publicUrl;
      }

      const { data, error: insertError } = await supabase.from('products').insert([
        {
          seller_id: user.id, // CAMBIO: user_id a seller_id
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          category: formData.category,
          state: 'en_venta',
          image_url: imageUrl,
        },
      ]);

      if (insertError) {
        throw insertError;
      }

      setFormData({ name: '', description: '', price: '', category: 'libros', state: 'en_venta' });
      setImage(null);
      setPreview(null);
      router.push('/profile'); // Redirigir a /profile
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Subir Artículo</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
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
              <div className="relative">
                <img src={preview} alt="Preview" className="w-full h-40 object-cover rounded" />
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setPreview(null);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleUploadClick}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition"
              >
                <div className="text-gray-500">
                  <p className="font-medium text-lg">Haz clic para subir foto</p>
                  <p className="text-sm">PNG, JPG, GIF hasta 10MB</p>
                </div>
              </button>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full border rounded px-3 py-2"
              placeholder="Ej: Libro de Matemáticas"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full border rounded px-3 py-2 h-20"
              placeholder="Describe el artículo..."
              required
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium mb-1">Precio</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              className="w-full border rounded px-3 py-2"
              placeholder="0.00"
              step="0.01"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-1">Categoría</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full border rounded px-3 py-2"
            >
              <option value="libros">Libros</option>
              <option value="ropa">Uniformes</option>
              <option value="mochilas">Mochilas</option>
              <option value="utiles">Material Escolar</option>
              <option value="tecnologia">Tecnología</option>
            </select>
          </div>

          {/* State */}
          <div>
            <label className="block text-sm font-medium mb-1">Condición</label>
            <select
              value={formData.state}
              onChange={(e) => setFormData({...formData, state: e.target.value})}
              className="w-full border rounded px-3 py-2"
            >
              <option value="perfecto">Perfecto</option>
              <option value="bueno">Bueno</option>
              <option value="regular">Regular</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-2 rounded font-medium hover:bg-blue-600 disabled:bg-gray-400"
          >
            {isLoading ? 'Subiendo...' : 'Subir Artículo'}
          </button>
        </form>
      </div>
    </div>
  );
}
