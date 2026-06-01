'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { mockCurrentUser } from '@/lib/mockData';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; bio: string }) => void;
}

export default function EditProfileModal({ isOpen, onClose, onSave }: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    name: mockCurrentUser.name,
    bio: 'Estudiante responsable. Vendo mis cosas de escuela en buen estado.',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
      <div className="w-full bg-white rounded-t-2xl p-6 max-w-md mx-auto animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Editar Perfil</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Cerrar"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">
          {/* Name */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-900">Nombre</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Tu nombre"
              maxLength={50}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <span className="text-xs text-gray-500">{formData.name.length}/50</span>
          </div>

          {/* Bio */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-900">Bio (Opcional)</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Cuéntanos sobre ti..."
              maxLength={150}
              rows={3}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
            />
            <span className="text-xs text-gray-500">{formData.bio.length}/150</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2 border border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
