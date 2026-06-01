'use client';

import { useState } from 'react';
import ImageUploaderUI from './ImageUploaderUI';
import { Button } from '@/components/ui/button';

interface FormData {
  title: string;
  description: string;
  category: string;
  course: string;
  price: string;
  condition: string;
}

export default function UploadForm() {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    category: '',
    course: '',
    price: '',
    condition: 'used',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simular envío del formulario
    console.log('[v0] Formulario enviado:', formData);
    setTimeout(() => {
      setIsSubmitting(false);
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        course: '',
        price: '',
        condition: 'used',
      });
    }, 1000);
  };

  const isFormValid = formData.title && formData.price && formData.category && formData.course;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Image Uploader */}
      <ImageUploaderUI />

      {/* Title Input */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-900">
          Título del artículo
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Ej: Libro Matemáticas 4º ESO"
          maxLength={60}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <p className="text-xs text-gray-500">{formData.title.length}/60</p>
      </div>

      {/* Description Input */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-900">
          Descripción
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe el estado, incluye detalles importantes..."
          maxLength={300}
          rows={3}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
        />
        <p className="text-xs text-gray-500">{formData.description.length}/300</p>
      </div>

      {/* Grid: Category + Course */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-900">
            Categoría
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="">Seleccionar</option>
            <option value="books">Libros</option>
            <option value="uniforms">Uniformes</option>
            <option value="bags">Mochilas</option>
            <option value="supplies">Material escolar</option>
            <option value="tech">Electrónica</option>
            <option value="other">Otros</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-900">
            Curso
          </label>
          <select
            name="course"
            value={formData.course}
            onChange={handleChange}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="">Seleccionar</option>
            <option value="primaria1">1º Primaria</option>
            <option value="primaria6">6º Primaria</option>
            <option value="eso1">1º ESO</option>
            <option value="eso4">4º ESO</option>
            <option value="bach1">1º Bachiller</option>
            <option value="bach2">2º Bachiller</option>
          </select>
        </div>
      </div>

      {/* Grid: Price + Condition */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-900">
            Precio (€)
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="0"
            min="0"
            step="0.50"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-900">
            Estado
          </label>
          <select
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="new">Nuevo</option>
            <option value="like-new">Como nuevo</option>
            <option value="used">Usado</option>
            <option value="fair">Defectos</option>
          </select>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={!isFormValid || isSubmitting}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold py-3 rounded-lg transition-colors"
      >
        {isSubmitting ? 'Publicando...' : 'Publicar Anuncio'}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        Tu anuncio será visible en el mercado instantáneamente
      </p>
    </form>
  );
}
