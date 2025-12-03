"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface NuevoPacienteValues {
  nombres: string;
  apellidos: string;
  telefono: string; // solo los 10 dígitos
  edad: string;
  correo: string;
}

interface NuevoPacienteErrors {
  nombres?: string;
  apellidos?: string;
  telefono?: string;
  edad?: string;
  correo?: string;
}

export default function NuevoPacienteForm() {
  const router = useRouter();

  const [values, setValues] = useState<NuevoPacienteValues>({
    nombres: "",
    apellidos: "",
    telefono: "",
    edad: "",
    correo: "",
  });

  const [errors, setErrors] = useState<NuevoPacienteErrors>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange =
    (field: keyof NuevoPacienteValues) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let v = e.target.value;

      if (field === "telefono") {
        v = v.replace(/\D/g, ""); // solo números
      }

      setValues((prev) => ({ ...prev, [field]: v }));
    };

  const validate = (vals: NuevoPacienteValues): NuevoPacienteErrors => {
    const newErrors: NuevoPacienteErrors = {};

    // Validar nombres
    if (!vals.nombres.trim()) {
      newErrors.nombres = "El nombre es obligatorio";
    } else if (vals.nombres.trim().length < 2) {
      newErrors.nombres = "El nombre debe tener al menos 2 caracteres";
    }

    // Validar apellidos
    if (!vals.apellidos.trim()) {
      newErrors.apellidos = "Los apellidos son obligatorios";
    } else if (vals.apellidos.trim().length < 2) {
      newErrors.apellidos = "Los apellidos deben tener al menos 2 caracteres";
    }

    // Validar teléfono
    const soloDigitos = vals.telefono.replace(/\D/g, "");
    if (soloDigitos.length !== 10) {
      newErrors.telefono = "El teléfono debe tener 10 dígitos";
    }

    // Edad
    if (vals.edad.trim()) {
      const edadNum = Number(vals.edad);
      if (Number.isNaN(edadNum)) {
        newErrors.edad = "La edad debe ser un número";
      } else if (edadNum < 0 || edadNum > 120) {
        newErrors.edad = "Edad inválida";
      }
    }

    // Correo opcional
    if (vals.correo.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(vals.correo)) {
        newErrors.correo = "Correo inválido";
      }
    }

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    const telefonoFinal = "52" + values.telefono;

    console.log("Paciente guardado:", {
      nombres: values.nombres,
      apellidos: values.apellidos,
      telefono: telefonoFinal,
      edad: values.edad,
      correo: values.correo,
    });

    setShowSuccess(true);
  };

  const closeModal = () => {
    setShowSuccess(false);
    router.push("/antecedentes");
  };

  const cancel = () => {
    router.push("/calendar");
  };

  return (
    <>
      {/* 🟦 MODAL DE ÉXITO */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center w-full max-w-sm">
            <p className="text-lg font-semibold text-[#337790] mb-4">
              Registro de paciente exitoso
            </p>

            <button
              onClick={closeModal}
              className="w-full bg-[#337790] hover:bg-[#2a6277] text-white py-2 rounded-md font-medium transition"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}

      {/* FORMULARIO */}
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Nombres */}
        <div>
          <label className="text-sm font-medium text-slate-800">
            Nombre(s)
          </label>
          <input
            type="text"
            placeholder="Juan Carlos"
            value={values.nombres}
            onChange={handleChange("nombres")}
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm"
          />
          {errors.nombres && (
            <p className="text-xs text-red-500">{errors.nombres}</p>
          )}
        </div>

        {/* Apellidos */}
        <div>
          <label className="text-sm font-medium text-slate-800">
            Apellidos
          </label>
          <input
            type="text"
            placeholder="Pérez López"
            value={values.apellidos}
            onChange={handleChange("apellidos")}
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm"
          />
          {errors.apellidos && (
            <p className="text-xs text-red-500">{errors.apellidos}</p>
          )}
        </div>

        {/* Teléfono con +52 fijo */}
        <div>
          <label className="text-sm font-medium text-slate-800">
            Teléfono
          </label>

          <div className="flex items-center mt-1">
            <span className="px-4 py-2 bg-slate-200 border border-slate-300 rounded-l-lg text-slate-700">
              +52
            </span>

            <input
              type="text"
              placeholder="7561100133"
              maxLength={10}
              value={values.telefono}
              onChange={handleChange("telefono")}
              className="w-full border border-slate-300 rounded-r-lg px-4 py-2.5 text-sm"
            />
          </div>

          {errors.telefono && (
            <p className="text-xs text-red-500">{errors.telefono}</p>
          )}
        </div>

        {/* Edad */}
        <div>
          <label className="text-sm font-medium text-slate-800">
            Edad
          </label>
          <input
            type="text"
            placeholder="00"
            value={values.edad}
            onChange={handleChange("edad")}
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm"
          />
          {errors.edad && (
            <p className="text-xs text-red-500">{errors.edad}</p>
          )}
        </div>

        {/* Correo */}
        <div>
          <label className="text-sm font-medium text-slate-800">
            Correo (Opcional)
          </label>
          <input
            type="email"
            placeholder="correo@gmail.com"
            value={values.correo}
            onChange={handleChange("correo")}
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm"
          />
          {errors.correo && (
            <p className="text-xs text-red-500">{errors.correo}</p>
          )}
        </div>

        {/* BOTONES */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={cancel}
            className="w-1/2 bg-gray-300 hover:bg-gray-400 text-black py-3 rounded-lg font-semibold transition"
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="w-1/2 bg-[#337790] hover:bg-[#2a6277] text-white py-3 rounded-lg font-semibold transition"
          >
            Nuevo Paciente
          </button>
        </div>
      </form>
    </>
  );
}
