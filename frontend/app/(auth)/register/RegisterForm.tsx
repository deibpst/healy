'use client';
import { useState } from 'react';
// Asegúrate de que esta ruta sea correcta en tu proyecto
import { validateRegister } from '@/lib/validations/validateRegister'; 
import RoleTabs from './RoleTabs';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; 

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
  const [loading, setLoading] = useState<boolean>(false); 
  const [apiError, setApiError] = useState<string>('');    

  const router = useRouter(); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <RoleTabs role={role} setRole={setRole} />
      
      {apiError && (
        <p className="p-3 bg-red-100 text-red-700 border border-red-300 rounded-md">
          {apiError}
        </p>
      )}

      {/* INICIO DE CAMPOS DE ENTRADA */}
      
      {/* Campo Nombre completo */}
      <div>
        <label className="font-medium text-gray-700">Nombre completo</label>
        <input
          name="name"
          placeholder="Tu nombre completo"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md"
          disabled={loading}
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>

      {/* Campo Correo electrónico (FALTABA) */}
      <div>
        <label className="font-medium text-gray-700">Correo electrónico</label>
        <input
          name="email"
          type="email"
          placeholder="correo@ejemplo.com"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md"
          disabled={loading}
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
      </div>

      {/* Campo Contraseña (FALTABA) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="font-medium text-gray-700">Contraseña</label>
          <input
            name="password"
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            disabled={loading}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password}</p>
          )}
        </div>

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
          />
          {errors.confirm && (
            <p className="text-sm text-red-500">{errors.confirm}</p>
          )}
        </div>
      </div>
      
      {/* Campo Teléfono (FALTABA) */}
      <div>
        <label className="font-medium text-gray-700">Teléfono</label>
        <input
          name="phone"
          placeholder="1234567890"
          value={form.phone}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md"
          disabled={loading}
        />
        {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
      </div>

      {/* Campo visible solo para fisioterapeutas (Ya existía, pero se incluye para integridad) */}
      {role === 'fisioterapeuta' && (
        <div>
          <label className="font-medium text-gray-700">Cédula profesional</label>
          <input
            name="cedula"
            placeholder="Cédula profesional"
            value={form.cedula}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            disabled={loading}
          />
          {errors.cedula && (
            <p className="text-sm text-red-500">{errors.cedula}</p>
          )}
        </div>
      )}

      <button
        type="submit"
        className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        disabled={loading}
      >
        {loading ? 'Creando cuenta...' : 'Crear cuenta'}
      </button>

      <p className="text-sm text-center text-gray-600 mt-4">
        ¿Ya tienes cuenta?{' '}
        <Link href="/login" className="text-blue-600 hover:underline">
          Iniciar sesión
        </Link>
      </p>
    </form>
  );
}