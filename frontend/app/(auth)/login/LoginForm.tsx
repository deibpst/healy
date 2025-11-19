'use client';
import { useState } from 'react';
import { validateLogin } from '@/lib/validations/validateLogin'; // Asegúrate de que esta ruta sea correcta
import Link from 'next/link';
import { useRouter } from 'next/navigation'; 

export default function LoginForm() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string>('');

  const router = useRouter(); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { isValid, errors: validationErrors } = validateLogin({ email, password });
    setErrors(validationErrors);
    setApiError('');

    if (!isValid) return;

    setLoading(true);

    try {
      // LLAMADA CORREGIDA: Usa el proxy que configuraste en next.config.js
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setApiError(data.msg || 'Error al iniciar sesión. Inténtalo de nuevo.');
        return;
      }

      // Login Exitoso: Guardar token y Redirigir
      localStorage.setItem('userToken', data.token);
      console.log(`Inicio de sesión exitoso. Redirigiendo a: ${data.redirectPath}`);
      
      router.push(data.redirectPath); 
      
    } catch (error) {
      console.error('Error de conexión:', error);
      setApiError('No se pudo conectar con el servidor. Revisa tu conexión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {apiError && (
        <p className="p-3 bg-red-100 text-red-700 border border-red-300 rounded-md">
          {apiError}
        </p>
      )}
      
      {/* ... (código de inputs) ... */}
      <div>
        <label className="font-medium text-gray-700">Correo</label>
        <input
          type="email"
          placeholder="correo@ejemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input" 
          disabled={loading}
        />
        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className="font-medium text-gray-700">Contraseña</label>
        <input
          type="password"
          placeholder="Ingresa tu contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
          disabled={loading}
        />
        {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
      </div>

      <button 
        type="submit" 
        className="btn-primary w-full" 
        disabled={loading}
      >
        {loading ? 'Cargando...' : 'Iniciar sesión'}
      </button>

      <p className="text-sm text-center text-gray-600 mt-4">
        ¿No tienes cuenta?{' '}
        <Link href="/register" className="text-blue-600 hover:underline">
          Regístrate
        </Link>
      </p>
    </form>
  );
}
