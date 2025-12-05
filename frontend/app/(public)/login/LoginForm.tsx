// app/login/page.tsx
'use client';
import { useState } from 'react';
import { validateLogin } from '@/lib/validations/validateLogin';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import RoleTabs from '../register/RoleTabs';
import { toast } from 'react-hot-toast';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [role, setRole] = useState<'paciente' | 'fisioterapeuta'>('paciente');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { isValid, errors: validationErrors } = validateLogin({ email, password });
    setErrors(validationErrors);

    if (!isValid) {
      setIsLoading(false);
      return;
    }
    
    try {
      // Llamar al backend para login
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          contrasena: password 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Guardar el token y datos del usuario en localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user_id', data.id);
        localStorage.setItem('user_name', data.nombre);
        localStorage.setItem('user_email', data.email);
        localStorage.setItem('user_role', data.rol);
        
        // Mostrar mensaje de éxito
        toast.success('Inicio de sesión exitoso');
        
        // Redirigir según la ruta proporcionada por el backend
        setTimeout(() => {
          if (data.redirectPath) {
            router.push(data.redirectPath);
          } else if (role === 'fisioterapeuta') {
            router.push('/calendar');
          } else {
            router.push('/patient-dashboard');
          }
        }, 1000);
      } else {
        toast.error(data.msg || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Error en login:', error);
      toast.error('Error de conexión con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Selector de rol - igual que en registro */}
      <RoleTabs role={role} setRole={setRole} />

      <div>
        <label className="font-medium text-gray-700">Correo</label>
        <input
          type="email"
          placeholder="correo@ejemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
          disabled={isLoading}
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
          disabled={isLoading}
        />
        {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
      </div>

      <button 
        type="submit" 
        className="w-full py-2 bg-[#337790] text-white rounded-md hover:bg-[#337790] transition disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
      </button>

      <p className="text-sm text-center text-gray-600 mt-4">
        ¿No tienes cuenta?{' '}
        <Link href="/register" className="text-[#337790] hover:underline">
          Regístrate
        </Link>
      </p>
    </form>
  );
}