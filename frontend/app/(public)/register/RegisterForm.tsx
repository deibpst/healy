'use client';
import { useState } from 'react';
import { validateRegister } from '@/lib/validations/validateRegister';
import RoleTabs from './RoleTabs';
import Link from 'next/link';

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { isValid, errors: regErrors } = validateRegister(form, role);
    setErrors(regErrors);
    if (!isValid) return;
    console.log('Registro válido:', { ...form, role });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Selector de rol */}
      <RoleTabs role={role} setRole={setRole} />

      <div>
        <label className="font-medium text-gray-700">Nombre completo</label>
        <input
          name="name"
          placeholder="Tu nombre completo"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>

      <div>
        <label className="font-medium text-gray-700">Correo</label>
        <input
          name="email"
          placeholder="correo@ejemplo.com"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
      </div>

      <div className="flex gap-2">
        <div className="flex-1">
          <label className="font-medium text-gray-700">Contraseña</label>
          <input
            name="password"
            type="password"
            placeholder="******"
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password}</p>
          )}
        </div>
        <div className="flex-1">
          <label className="font-medium text-gray-700">Confirmar</label>
          <input
            name="confirm"
            type="password"
            placeholder="******"
            value={form.confirm}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.confirm && (
            <p className="text-sm text-red-500">{errors.confirm}</p>
          )}
        </div>
      </div>

      <div>
        <label className="font-medium text-gray-700">Teléfono</label>
        <input
          name="phone"
          placeholder="1234567890"
          value={form.phone}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
      </div>

      {/* Campo visible solo para fisioterapeutas */}
      {role === 'fisioterapeuta' && (
        <div>
          <label className="font-medium text-gray-700">Cédula profesional</label>
          <input
            name="cedula"
            placeholder="Cédula profesional"
            value={form.cedula}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.cedula && (
            <p className="text-sm text-red-500">{errors.cedula}</p>
          )}
        </div>
      )}

      <button
        type="submit"
        className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        Crear cuenta
      </button>

      {/* Enlace de redirección */}
      <p className="text-sm text-center text-gray-600 mt-4">
        ¿Ya tienes una cuenta?{' '}
        <Link href="/login" className="text-blue-600 hover:underline">
          Inicia sesión
        </Link>
      </p>
    </form>
  );
}
