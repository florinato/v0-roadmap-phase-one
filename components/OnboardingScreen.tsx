'use client';

import { Smartphone, MessageCircle, DollarSign, CheckCircle } from 'lucide-react';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      {/* Logo */}
      <div className="flex-1 flex flex-col justify-center gap-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto flex items-center justify-center mb-4">
            <DollarSign size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">EscolarApp</h1>
          <p className="text-gray-600">Compra y vende entre compañeros</p>
        </div>

        {/* Features */}
        <div className="space-y-4">
          <div className="flex gap-4 items-start">
            <Smartphone className="text-blue-600 flex-shrink-0 mt-1" size={24} />
            <div>
              <h3 className="font-semibold text-gray-900">Descubre productos</h3>
              <p className="text-sm text-gray-600">
                Explora libros, uniformes y más de tus compañeros
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <DollarSign className="text-blue-600 flex-shrink-0 mt-1" size={24} />
            <div>
              <h3 className="font-semibold text-gray-900">Vende fácil</h3>
              <p className="text-sm text-gray-600">
                Publicar es rápido: foto, descripción, precio y listo
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <MessageCircle className="text-blue-600 flex-shrink-0 mt-1" size={24} />
            <div>
              <h3 className="font-semibold text-gray-900">Negocia en chat</h3>
              <p className="text-sm text-gray-600">
                Comunícate directamente con compradores o vendedores
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <CheckCircle className="text-blue-600 flex-shrink-0 mt-1" size={24} />
            <div>
              <h3 className="font-semibold text-gray-900">Confía en reseñas</h3>
              <p className="text-sm text-gray-600">
                Lee reseñas reales de otros estudiantes
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <button
        onClick={onComplete}
        className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Comenzar
      </button>
    </div>
  );
}
