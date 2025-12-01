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

    console.log('Registro válido:', { ...form, role });

    setSuccessMsg('¡Registro exitoso!');
    router.push('/login');
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

      {/* Teléfono con 52 fijo */}
      <div>
        <label className="font-medium text-gray-700">Teléfono</label>

        <div className="flex gap-2">
          {/* Prefijo fijo no editable */}
          <input
            value="52"
            disabled
            className="w-16 p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
          />

          {/* Número editable de 10 dígitos */}
          <input
            name="phoneNumber"
            placeholder="7561100133"
            value={phoneNumberOnly}
            onChange={handlePhoneNumberChange}
            className="flex-1 p-2 border border-gray-300 rounded-md"
          />
        </div>

        <p className="text-xs text-gray-500 mt-1">(lada obligatoria de mexico)</p>

        {errors.phone && (
          <p className="text-sm text-red-500">{errors.phone}</p>
        )}
      </div>

      {role === 'fisioterapeuta' && (
        <div>
          <label className="font-medium text-gray-700">Código</label>
          <input
            name="codigo"
            placeholder="Código proporcionado por el encargado"
            value={form.codigo}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.codigo && (
            <p className="text-sm text-red-500">{errors.codigo}</p>
          )}
        </div>
      )}

      <button
        type="submit"
        className="w-full py-2 bg-[#337790] text-white rounded-md hover:bg-[#2b6478] transition"
      >
        Crear cuenta
      </button>

      {successMsg && (
        <p className="text-sm text-green-600 text-center font-medium">
          {successMsg}
        </p>
      )}

      <p className="text-sm text-center text-gray-600 mt-4">
        ¿Ya tienes una cuenta?{' '}
        <Link href="/login" className="text-[#337790] hover:underline">
          Inicia sesión
        </Link>
      </p>
    </form>
  );
}
