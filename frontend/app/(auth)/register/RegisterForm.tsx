'use client';
import { useState } from 'react';
<<<<<<< HEAD
// Asegúrate de que esta ruta sea correcta en tu proyecto
import { validateRegister } from '@/lib/validations/validateRegister'; 
import RoleTabs from './RoleTabs';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; 
=======
import { validateRegister } from '@/lib/validations/validateRegister';
import RoleTabs from './RoleTabs';
import Link from 'next/link';
>>>>>>> origin/frontend-fisio

export default function RegisterForm() {
  const [role, setRole] = useState<'paciente' | 'fisioterapeuta'>('paciente');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
    phone: '',
    cedula: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
<<<<<<< HEAD
  const [loading, setLoading] = useState<boolean>(false); 
  const [apiError, setApiError] = useState<string>('');    

  const router = useRouter(); 
=======
>>>>>>> origin/frontend-fisio

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

<<<<<<< HEAD
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { isValid, errors: regErrors } = validateRegister(form, role);
    setErrors(regErrors);
    setApiError('');

    if (!isValid) return;

    setLoading(true);

    const dataToSend = {
      name: form.name,
      email: form.email,
      password: form.password,
      phone: form.phone,
      role: role,
      cedula: role === 'fisioterapeuta' ? form.cedula : undefined,
    };
    
    try {
      // Usando el proxy configurado en next.config.js
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (!response.ok) {
        setApiError(data.msg || 'Error al crear la cuenta. Inténtalo de nuevo.');
        return;
      }

      console.log('Registro exitoso:', data);
      setForm({ name: '', email: '', password: '', confirm: '', phone: '', cedula: '' });
      setErrors({});

      router.push('/login?registered=true'); 
      
    } catch (error) {
      console.error('Error de conexión:', error);
      setApiError('No se pudo conectar con el servidor. Revisa tu conexión.');
    } finally {
      setLoading(false);
    }
=======
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { isValid, errors: regErrors } = validateRegister(form, role);
    setErrors(regErrors);
    if (!isValid) return;
    console.log('Registro válido:', { ...form, role });
>>>>>>> origin/frontend-fisio
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
<<<<<<< HEAD
      <RoleTabs role={role} setRole={setRole} />
      
      {apiError && (
        <p className="p-3 bg-red-100 text-red-700 border border-red-300 rounded-md">
          {apiError}
        </p>
      )}

      {/* INICIO DE CAMPOS DE ENTRADA */}
      
      {/* Campo Nombre completo */}
=======
      {/* Selector de rol */}
      <RoleTabs role={role} setRole={setRole} />

>>>>>>> origin/frontend-fisio
      <div>
        <label className="font-medium text-gray-700">Nombre completo</label>
        <input
          name="name"
          placeholder="Tu nombre completo"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md"
<<<<<<< HEAD
          disabled={loading}
=======
>>>>>>> origin/frontend-fisio
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>

<<<<<<< HEAD
      {/* Campo Correo electrónico (FALTABA) */}
      <div>
        <label className="font-medium text-gray-700">Correo electrónico</label>
        <input
          name="email"
          type="email"
=======
      <div>
        <label className="font-medium text-gray-700">Correo</label>
        <input
          name="email"
>>>>>>> origin/frontend-fisio
          placeholder="correo@ejemplo.com"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md"
<<<<<<< HEAD
          disabled={loading}
=======
>>>>>>> origin/frontend-fisio
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
      </div>

<<<<<<< HEAD
      {/* Campo Contraseña (FALTABA) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
=======
      <div className="flex gap-2">
        <div className="flex-1">
>>>>>>> origin/frontend-fisio
          <label className="font-medium text-gray-700">Contraseña</label>
          <input
            name="password"
            type="password"
<<<<<<< HEAD
            placeholder="Mínimo 6 caracteres"
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            disabled={loading}
=======
            placeholder="******"
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
>>>>>>> origin/frontend-fisio
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password}</p>
          )}
        </div>
<<<<<<< HEAD

        {/* Campo Confirmar Contraseña (FALTABA) */}
        <div>
          <label className="font-medium text-gray-700">Confirmar contraseña</label>
          <input
            name="confirm"
            type="password"
            placeholder="Repite la contraseña"
            value={form.confirm}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            disabled={loading}
=======
        <div className="flex-1">
          <label className="font-medium text-gray-700">Confirmar</label>
          <input
            name="confirm"
            type="password"
            placeholder="******"
            value={form.confirm}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
>>>>>>> origin/frontend-fisio
          />
          {errors.confirm && (
            <p className="text-sm text-red-500">{errors.confirm}</p>
          )}
        </div>
      </div>
<<<<<<< HEAD
      
      {/* Campo Teléfono (FALTABA) */}
=======

>>>>>>> origin/frontend-fisio
      <div>
        <label className="font-medium text-gray-700">Teléfono</label>
        <input
          name="phone"
          placeholder="1234567890"
          value={form.phone}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md"
<<<<<<< HEAD
          disabled={loading}
=======
>>>>>>> origin/frontend-fisio
        />
        {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
      </div>

<<<<<<< HEAD
      {/* Campo visible solo para fisioterapeutas (Ya existía, pero se incluye para integridad) */}
=======
      {/* Campo visible solo para fisioterapeutas */}
>>>>>>> origin/frontend-fisio
      {role === 'fisioterapeuta' && (
        <div>
          <label className="font-medium text-gray-700">Cédula profesional</label>
          <input
            name="cedula"
            placeholder="Cédula profesional"
            value={form.cedula}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
<<<<<<< HEAD
            disabled={loading}
=======
>>>>>>> origin/frontend-fisio
          />
          {errors.cedula && (
            <p className="text-sm text-red-500">{errors.cedula}</p>
          )}
        </div>
      )}

      <button
        type="submit"
        className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
<<<<<<< HEAD
        disabled={loading}
      >
        {loading ? 'Creando cuenta...' : 'Crear cuenta'}
      </button>

      <p className="text-sm text-center text-gray-600 mt-4">
        ¿Ya tienes cuenta?{' '}
        <Link href="/login" className="text-blue-600 hover:underline">
          Iniciar sesión
=======
      >
        Crear cuenta
      </button>

      {/* Enlace de redirección */}
      <p className="text-sm text-center text-gray-600 mt-4">
        ¿Ya tienes una cuenta?{' '}
        <Link href="/login" className="text-blue-600 hover:underline">
          Inicia sesión
>>>>>>> origin/frontend-fisio
        </Link>
      </p>
    </form>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> origin/frontend-fisio
