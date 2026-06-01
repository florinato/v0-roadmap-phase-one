'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/authContext';

interface AuthScreenProps {
  onAuthSuccess?: () => void;
}

export default function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const { login, signup } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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
      if (isSignup) {
        if (!formData.name) {
          setError('El nombre es obligatorio');
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Las contraseñas no coinciden');
          return;
        }
        await signup(formData.name, formData.email, formData.password);
      } else {
        await login(formData.email, formData.password);
      }
      onAuthSuccess?.();
    } catch (err) {
      setError('Error en la autenticación. Intenta de nuevo.');
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
          {isSignup ? 'Crea tu cuenta' : 'Inicia sesión'}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-6">
        {isSignup && (
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nombre completo"
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

        {isSignup && (
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirmar contraseña"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Cargando...' : isSignup ? 'Registrarse' : 'Iniciar sesión'}
        </button>
      </form>

      {/* Toggle Auth Mode */}
      <div className="text-center text-sm text-gray-600">
        {isSignup ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
        <button
          onClick={() => {
            setIsSignup(!isSignup);
            setError('');
            setFormData({ name: '', email: '', password: '', confirmPassword: '' });
          }}
          className="text-blue-600 font-semibold hover:underline"
        >
          {isSignup ? 'Inicia sesión' : 'Regístrate'}
        </button>
      </div>
    </div>
  );
}
