'use client';

import { useAuth } from '@/lib/authContext';
import { useState } from 'react';

interface AuthScreenProps {
  onAuthSuccess?: () => void;
}

type AuthMode = 'login' | 'signup';

export default function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const { login, signup } = useAuth();
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '', // Added for signup
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (authMode === 'login') {
        await login(formData.email, formData.password);
      } else {
        if (!formData.name) {
          setError('Por favor, ingresa tu nombre.');
          return;
        }
        await signup(formData.email, formData.password, formData.name);
      }
      onAuthSuccess?.();
    } catch (err: any) {
      setError(err.message || 'Error en la autenticación. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white p-6 justify-center">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto flex items-center justify-center mb-4">
          <span className="text-white text-2xl font-bold">E</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">EscolarApp</h1>
        <p className="text-gray-600 text-sm mt-1">
          {authMode === 'login' ? 'Inicia sesión' : 'Regístrate'}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-6">
        {authMode === 'signup' && (
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nombre"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Contraseña"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Cargando...' : (authMode === 'login' ? 'Iniciar sesión' : 'Registrarse')}
        </button>
      </form>

      <div className="text-center text-sm text-gray-600">
        {authMode === 'login' ? (
          <p>
            ¿No tienes una cuenta?{' '}
            <button
              type="button"
              onClick={() => setAuthMode('signup')}
              className="text-blue-600 font-semibold hover:text-blue-700"
            >
              Regístrate
            </button>
          </p>
        ) : (
          <p>
            ¿Ya tienes una cuenta?{' '}
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className="text-blue-600 font-semibold hover:text-blue-700"
            >
              Inicia sesión
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
