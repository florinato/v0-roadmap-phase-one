'use client';

import { useState } from 'react';
import { X, Camera } from 'lucide-react';

interface ImageUploaderUIProps {
  onImageAdd?: () => void;
}

export default function ImageUploaderUI({ onImageAdd }: ImageUploaderUIProps) {
  const [images, setImages] = useState<string[]>([]);

  const handleAddImage = () => {
    // Simulamos agregar una imagen
    setImages([...images, `image-${Date.now()}`]);
    onImageAdd?.();
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Images Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="relative w-full aspect-square bg-gray-200 rounded-lg overflow-hidden group"
            >
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
                <Camera size={24} className="text-gray-600" />
              </div>
              <button
                onClick={() => handleRemoveImage(idx)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={16} />
              </button>
            </div>
          ))}

          {/* Add button if less than 6 images */}
          {images.length < 6 && (
            <button
              onClick={handleAddImage}
              className="w-full aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-1 hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <Camera size={24} className="text-gray-400" />
              <span className="text-xs text-gray-500">Añadir</span>
            </button>
          )}
        </div>
      )}

      {/* Initial Upload Box */}
      {images.length === 0 && (
        <button
          onClick={handleAddImage}
          className="w-full border-2 border-dashed border-gray-300 rounded-lg py-12 flex flex-col items-center justify-center gap-2 hover:border-blue-500 hover:bg-blue-50 transition-colors"
        >
          <Camera size={32} className="text-gray-400" />
          <p className="text-sm font-medium text-gray-700">Añade fotos del artículo</p>
          <p className="text-xs text-gray-500">Máximo 6 fotos</p>
        </button>
      )}
    </div>
  );
}
