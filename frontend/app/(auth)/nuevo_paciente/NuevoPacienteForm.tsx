"use client";

import { useState } from "react";

interface NuevoPacienteValues {
  nombreCompleto: string;
  telefono: string;
  edad: string;
  correo: string;
}

interface NuevoPacienteErrors {
  nombreCompleto?: string;
  telefono?: string;
  edad?: string;
  correo?: string;
}

export default function NuevoPacienteForm() {
  const [values, setValues] = useState<NuevoPacienteValues>({
    nombreCompleto: "",
    telefono: "",
    edad: "",
    correo: "",
  });

  const [errors, setErrors] = useState<NuevoPacienteErrors>({});

  const handleChange =
    (field: keyof NuevoPacienteValues) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setValues((prev) => ({ ...prev, [field]: value }));
    };

  const validate = (vals: NuevoPacienteValues): NuevoPacienteErrors => {
    const newErrors: NuevoPacienteErrors = {};

    // Nombre completo: obligatorio, mínimo 3 caracteres y al menos 2 palabras
    const nombreTrim = vals.nombreCompleto.trim();
    if (!nombreTrim) {
      newErrors.nombreCompleto = "El nombre es obligatorio";
    } else {
      const palabras = nombreTrim.split(/\s+/).filter(Boolean);
      if (palabras.length < 2) {
        newErrors.nombreCompleto =
          "Ingresa al menos nombre y apellido";
      } else if (nombreTrim.length < 3) {
        newErrors.nombreCompleto =
          "El nombre debe tener al menos 3 caracteres";
      }
    }

    // Teléfono: obligatorio, exactamente 10 dígitos
    const soloDigitos = vals.telefono.replace(/\D/g, "");
    if (!vals.telefono.trim()) {
      newErrors.telefono = "El teléfono es obligatorio";
    } else if (soloDigitos.length !== 10) {
      newErrors.telefono = "El teléfono debe tener exactamente 10 dígitos";
    }

    // Edad: opcional, pero si viene, debe ser número 0–120
    if (vals.edad.trim()) {
      const edadNum = Number(vals.edad);
      if (Number.isNaN(edadNum)) {
        newErrors.edad = "La edad debe ser un número";
      } else if (edadNum < 0 || edadNum > 120) {
        newErrors.edad = "La edad debe estar entre 0 y 120";
      }
    }

    // Correo: opcional, pero si viene, validar formato
    if (vals.correo.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(vals.correo)) {
        newErrors.correo = "Correo electrónico inválido";
      }
    }

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);

    const isValid = Object.keys(validationErrors).length === 0;
    if (!isValid) return;

    // Aquí luego haces el submit real (API, etc.)
    console.log("Nuevo paciente válido:", values);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
      noValidate // desactiva la validación nativa del navegador
    >
      {/* Nombre completo */}
      <div>
        <label className="text-sm font-medium text-slate-800">
          Nombre completo
        </label>
        <input
          type="text"
          placeholder="Tu nombre completo"
          value={values.nombreCompleto}
          onChange={handleChange("nombreCompleto")}
          className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
        />
        {errors.nombreCompleto && (
          <p className="mt-1 text-xs text-red-500">
            {errors.nombreCompleto}
          </p>
        )}
      </div>

      {/* Teléfono + Edad */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-slate-800">
            Teléfono
          </label>
          <input
            type="tel"
            placeholder="1234567890"
            value={values.telefono}
            onChange={handleChange("telefono")}
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          />
          {errors.telefono && (
            <p className="mt-1 text-xs text-red-500">
              {errors.telefono}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-800">
            Edad
          </label>
          <input
            type="text"
            placeholder="00"
            value={values.edad}
            onChange={handleChange("edad")}
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          />
          {errors.edad && (
            <p className="mt-1 text-xs text-red-500">{errors.edad}</p>
          )}
        </div>
      </div>

      {/* Correo */}
      <div>
        <label className="text-sm font-medium text-slate-800">
          Correo (Opcional)
        </label>
        <input
          type="email"
          placeholder="nombreapellido@gmail.com"
          value={values.correo}
          onChange={handleChange("correo")}
          className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
        />
        {errors.correo && (
          <p className="mt-1 text-xs text-red-500">{errors.correo}</p>
        )}
      </div>

      {/* Botón enviar */}
      <button
        type="submit"
        className="mt-2 w-full rounded-lg bg-teal-700 py-3 text-sm font-semibold text-white hover:bg-teal-800 transition-colors"
      >
        Nuevo Paciente
      </button>
    </form>
  );
}