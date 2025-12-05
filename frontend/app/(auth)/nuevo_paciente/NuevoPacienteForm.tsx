"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface NuevoPacienteValues {
  nombres: string;
  apellidos: string;
  telefono: string;
  edad: string;
  correo: string;
  contrasena: string;
  confirmarContrasena: string;
}

interface NuevoPacienteErrors {
  nombres?: string;
  apellidos?: string;
  telefono?: string;
  edad?: string;
  correo?: string;
  contrasena?: string;
  confirmarContrasena?: string;
}

export default function NuevoPacienteForm() {
  const router = useRouter();

  const [values, setValues] = useState<NuevoPacienteValues>({
    nombres: "",
    apellidos: "",
    telefono: "",
    edad: "",
    correo: "",
    contrasena: "",
    confirmarContrasena: "",
  });

  const [errors, setErrors] = useState<NuevoPacienteErrors>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleChange =
    (field: keyof NuevoPacienteValues) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let v = e.target.value;

      if (field === "telefono") {
        v = v.replace(/\D/g, "");
      }

      setValues((prev) => ({ ...prev, [field]: v }));
      if (serverError) setServerError(null);
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

    // Correo
    if (!vals.correo.trim()) {
      newErrors.correo = "El correo es obligatorio";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(vals.correo)) {
        newErrors.correo = "Correo inválido";
      }
    }

    // Contraseña
    if (!vals.contrasena.trim()) {
      newErrors.contrasena = "La contraseña es obligatoria";
    } else if (vals.contrasena.length < 6) {
      newErrors.contrasena = "La contraseña debe tener al menos 6 caracteres";
    }

    // Confirmar contraseña
    if (vals.contrasena !== vals.confirmarContrasena) {
      newErrors.confirmarContrasena = "Las contraseñas no coinciden";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const validationErrors = validate(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);

    try {
      // URL DIRECTA del backend
      const apiUrl = `http://localhost:5001/api/auth/register`;
      
      // Preparar datos según tu backend
      const pacienteData = {
        nombre: values.nombres.trim(),
        apellidos: values.apellidos.trim(),
        email: values.correo.trim(),
        telefono: values.telefono,
        contrasena: values.contrasena,
        rol: "paciente",
      };

      console.log("🌐 Enviando a:", apiUrl);
      console.log("📦 Datos:", pacienteData);

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pacienteData),
      });

      // ⚠️ CAMBIO CRÍTICO: Leer primero como TEXTO, no como JSON
      const responseText = await response.text();
      console.log("📥 Respuesta del servidor (status:", response.status, "):", responseText);

      // **SIEMPRE mostrar éxito si el status es 201 (Created)**
      if (response.status === 201) {
        console.log("✅ ¡REGISTRO EXITOSO! Status 201 recibido");
        
        // Mostrar el modal de éxito
        setShowSuccess(true);
        
        // Limpiar formulario
        setValues({
          nombres: "",
          apellidos: "",
          telefono: "",
          edad: "",
          correo: "",
          contrasena: "",
          confirmarContrasena: "",
        });
        
        // No necesitamos procesar más, salimos con éxito
        return;
      }

      // Si no es status 201, intentar procesar como JSON para ver el error
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (jsonError) {
        // Si no es JSON, mostrar error genérico
        console.error("❌ Respuesta no es JSON válido:", responseText);
        throw new Error("Error en el servidor. Intenta nuevamente.");
      }

      // Si llegamos aquí, tenemos JSON pero no fue exitoso
      if (!response.ok) {
        if (data.msg?.includes("correo electrónico ya está registrado")) {
          throw new Error("Este correo ya está registrado. Usa otro.");
        } else if (data.msg?.includes("Faltan campos obligatorios")) {
          throw new Error("Faltan campos obligatorios.");
        } else if (data.msg?.includes("Rol inválido")) {
          throw new Error("Error en el rol. Contacta al administrador.");
        } else {
          throw new Error(data.msg || `Error ${response.status}`);
        }
      }

    } catch (error) {
      console.error("❌ Error completo:", error);
      setServerError(
        error instanceof Error 
          ? error.message 
          : "Error de conexión. Verifica que el backend esté corriendo en puerto 5001."
      );
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowSuccess(false);
    router.push("/calendar");
  };

  const cancel = () => {
    router.push("/calendar");
  };

  return (
    <>
      {/* 🟦 MODAL DE ÉXITO - MEJORADO */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl text-center w-full max-w-md animate-fade-in">
            {/* Icono de éxito */}
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
              <svg className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            {/* Mensaje */}
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              ¡Registro Exitoso!
            </h2>
            
            <p className="text-gray-600 mb-2">
              El paciente <span className="font-semibold text-[#337790]">{values.nombres} {values.apellidos}</span> ha sido registrado correctamente.
            </p>
            
            <p className="text-sm text-gray-500 mb-6">
              Ahora puede iniciar sesión con su correo y contraseña.
            </p>

            {/* Botones */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowSuccess(false);
                  setValues({
                    nombres: "",
                    apellidos: "",
                    telefono: "",
                    edad: "",
                    correo: "",
                    contrasena: "",
                    confirmarContrasena: "",
                  });
                }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-lg font-medium transition"
              >
                Registrar otro
              </button>
              
              <button
                onClick={closeModal}
                className="flex-1 bg-[#337790] hover:bg-[#2a6277] text-white py-3 rounded-lg font-medium transition"
              >
                Ir al calendario
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FORMULARIO */}
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Nombres */}
        <div>
          <label className="text-sm font-medium text-slate-800">
            Nombre(s) *
          </label>
          <input
            type="text"
            placeholder="Juan Carlos"
            value={values.nombres}
            onChange={handleChange("nombres")}
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-[#337790] focus:ring-1 focus:ring-[#337790] outline-none transition"
            disabled={loading}
          />
          {errors.nombres && (
            <p className="text-xs text-red-500 mt-1">{errors.nombres}</p>
          )}
        </div>

        {/* Apellidos */}
        <div>
          <label className="text-sm font-medium text-slate-800">
            Apellidos *
          </label>
          <input
            type="text"
            placeholder="Pérez López"
            value={values.apellidos}
            onChange={handleChange("apellidos")}
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-[#337790] focus:ring-1 focus:ring-[#337790] outline-none transition"
            disabled={loading}
          />
          {errors.apellidos && (
            <p className="text-xs text-red-500 mt-1">{errors.apellidos}</p>
          )}
        </div>

        {/* Teléfono con +52 fijo */}
        <div>
          <label className="text-sm font-medium text-slate-800">
            Teléfono *
          </label>

          <div className="flex items-center mt-1">
            <span className="px-4 py-2.5 bg-slate-100 border border-slate-300 rounded-l-lg text-slate-700 text-sm">
              +52
            </span>

            <input
              type="text"
              placeholder="7561100133"
              maxLength={10}
              value={values.telefono}
              onChange={handleChange("telefono")}
              className="w-full border border-slate-300 rounded-r-lg px-4 py-2.5 text-sm focus:border-[#337790] focus:ring-1 focus:ring-[#337790] outline-none transition"
              disabled={loading}
            />
          </div>

          {errors.telefono && (
            <p className="text-xs text-red-500 mt-1">{errors.telefono}</p>
          )}
        </div>

        {/* Edad (opcional) */}
        <div>
          <label className="text-sm font-medium text-slate-800">
            Edad (Opcional)
          </label>
          <input
            type="text"
            placeholder="00"
            value={values.edad}
            onChange={handleChange("edad")}
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-[#337790] focus:ring-1 focus:ring-[#337790] outline-none transition"
            disabled={loading}
          />
          {errors.edad && (
            <p className="text-xs text-red-500 mt-1">{errors.edad}</p>
          )}
        </div>

        {/* Correo */}
        <div>
          <label className="text-sm font-medium text-slate-800">
            Correo *
          </label>
          <input
            type="email"
            placeholder="correo@gmail.com"
            value={values.correo}
            onChange={handleChange("correo")}
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-[#337790] focus:ring-1 focus:ring-[#337790] outline-none transition"
            disabled={loading}
          />
          {errors.correo && (
            <p className="text-xs text-red-500 mt-1">{errors.correo}</p>
          )}
        </div>

        {/* Contraseña */}
        <div>
          <label className="text-sm font-medium text-slate-800">
            Contraseña *
          </label>
          <input
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={values.contrasena}
            onChange={handleChange("contrasena")}
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-[#337790] focus:ring-1 focus:ring-[#337790] outline-none transition"
            disabled={loading}
          />
          {errors.contrasena && (
            <p className="text-xs text-red-500 mt-1">{errors.contrasena}</p>
          )}
        </div>

        {/* Confirmar Contraseña */}
        <div>
          <label className="text-sm font-medium text-slate-800">
            Confirmar Contraseña *
          </label>
          <input
            type="password"
            placeholder="Repite la contraseña"
            value={values.confirmarContrasena}
            onChange={handleChange("confirmarContrasena")}
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-[#337790] focus:ring-1 focus:ring-[#337790] outline-none transition"
            disabled={loading}
          />
          {errors.confirmarContrasena && (
            <p className="text-xs text-red-500 mt-1">{errors.confirmarContrasena}</p>
          )}
        </div>

        {/* Error del servidor */}
        {serverError && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded">
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="font-medium">{serverError}</p>
            </div>
          </div>
        )}

        {/* BOTONES */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={cancel}
            className="w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-lg font-medium transition disabled:opacity-50"
            disabled={loading}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="w-1/2 bg-[#337790] hover:bg-[#2a6277] text-white py-3 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Registrando...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Registrar Paciente
              </div>
            )}
          </button>
        </div>
      </form>

      {/* Agrega estos estilos para la animación */}
      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}