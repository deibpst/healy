'use client';
import { useState } from 'react';
import { validateRegister } from '@/lib/validations/validateRegister';
import RoleTabs from './RoleTabs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterForm() {
  const router = useRouter();

  const [role, setRole] = useState<'paciente' | 'fisioterapeuta'>('paciente');

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirm: '',
    phone: '52', // prefijo fijo por defecto
    codigo: '', // solo fisio
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // SOLO para el input del número (10 dígitos)
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 10); // máximo 10
    setForm(prev => ({
      ...prev,
      phone: '52' + digits, // siempre fuerza el prefijo
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { isValid, errors: regErrors } = validateRegister(form, role);
    setErrors(regErrors);
    setSuccessMsg('');
    if (!isValid) return;

    try {
      const res = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.firstName,
          apellidos: form.lastName,
          email: form.email,
          contrasena: form.password,
          telefono: form.phone,
          rol: role,
          cedula: role === 'fisioterapeuta' ? form.codigo : null, // 🔑 envío cédula solo si es fisio
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.msg || 'Error en el registro');
      }

      setSuccessMsg('¡Registro exitoso!');
      router.push('/login');
    } catch (err: any) {
      console.error('Error en el registro:', err.message);
      setErrors({ general: err.message });
    }
  };

  // lo que el usuario escribe (sin el 52)
  const phoneNumberOnly = form.phone.slice(2);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <RoleTabs role={role} setRole={setRole} />

      <div>
        <label className="font-medium text-gray-700">Nombre(s)</label>
        <input
          name="firstName"
          placeholder="Tu(s) nombre(s)"
          value={form.firstName}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        {errors.firstName && (
          <p className="text-sm text-red-500">{errors.firstName}</p>
        )}
      </div>

      <div>
        <label className="font-medium text-gray-700">Apellidos</label>
        <input
          name="lastName"
          placeholder="Tus apellidos"
          value={form.lastName}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        {errors.lastName && (
          <p className="text-sm text-red-500">{errors.lastName}</p>
        )}
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
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email}</p>
        )}
      </div>

      <div>
        <label className="font-medium text-gray-700">Contraseña</label>
        <input
          type="password"
          name="password"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password}</p>
        )}
      </div>

      <div>
        <label className="font-medium text-gray-700">Confirmar contraseña</label>
        <input
          type="password"
          name="confirm"
          placeholder="••••••••"
          value={form.confirm}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        {errors.confirm && (
          <p className="text-sm text-red-500">{errors.confirm}</p>
        )}
      </div>

      <div>
        <label className="font-medium text-gray-700">Teléfono</label>
        <input
          name="phone"
          placeholder="Tu número (10 dígitos)"
          value={phoneNumberOnly}
          onChange={handlePhoneNumberChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        {errors.phone && (
          <p className="text-sm text-red-500">{errors.phone}</p>
        )}
      </div>

      {/* 🔑 Campo extra solo para fisioterapeuta */}
      {role === 'fisioterapeuta' && (
        <div>
          <label className="font-medium text-gray-700">Cédula profesional</label>
          <input
            name="codigo"
            placeholder="Tu cédula"
            value={form.codigo}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.codigo && (
            <p className="text-sm text-red-500">{errors.codigo}</p>
          )}
        </div>
      )}

      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">
        Registrarse
      </button>

      {successMsg && <p className="text-green-600">{successMsg}</p>}
      {errors.general && <p className="text-red-600">{errors.general}</p>}

      <p className="text-sm">
        ¿Ya tienes cuenta? <Link className="text-blue-600 underline" href="/login">Inicia sesión</Link>
      </p>
    </form>
  );
}
