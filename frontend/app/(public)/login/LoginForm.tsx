'use client';
import { useState } from 'react';
import { validateLogin } from '@/lib/validations/validateLogin';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import RoleTabs from '../register/RoleTabs'; // Importamos el mismo componente que usas en register

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [role, setRole] = useState<'paciente' | 'fisioterapeuta'>('paciente');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { isValid, errors: validationErrors } = validateLogin({ email, password });
    setErrors(validationErrors);

    if (!isValid) return;
    
    console.log('Login válido:', { email, password, role });
    
    // Redirigir según el rol seleccionado
    if (role === 'fisioterapeuta') {
      router.push('/calendar');
    } else {
      router.push('/patient-dashboard');
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
        />
        {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
      </div>

      <button type="submit" className="w-full py-2 bg-[#337790] text-white rounded-md hover:bg-[#337790] transition">
        Iniciar sesión
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