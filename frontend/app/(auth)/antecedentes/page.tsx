"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AntecedentesPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    condiciones: "",
    cirugias: "",
    actividadFisica: null as null | boolean,
    regularidadActividad: "",
    tipoActividad: "",
    habitos: "",
    doloresPasados: "",
    fisioAntes: null as null | boolean,
    regularidadFisio: "",
    periodicidadFisio: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    // Campos obligatorios básicos
    if (!form.condiciones.trim()) {
      newErrors.condiciones = "Este campo es obligatorio.";
    }
    if (!form.cirugias.trim()) {
      newErrors.cirugias = "Este campo es obligatorio.";
    }
    if (!form.habitos.trim()) {
      newErrors.habitos = "Este campo es obligatorio.";
    }
    if (!form.doloresPasados.trim()) {
      newErrors.doloresPasados = "Este campo es obligatorio.";
    }

    // Si hay errores, los mostramos y NO seguimos
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      console.log("Validación fallida:", newErrors);
      return;
    }

    console.log("Datos enviados:", form);

    // Aquí conectarás con tu backend:
    // await fetch("/api/antecedentes", { method: "POST", body: JSON.stringify(form) });

    // Mostrar modal de éxito
    setShowSuccess(true);
  };

  const toggle = (field: "actividadFisica" | "fisioAntes", value: boolean) => {
    setForm({ ...form, [field]: value });
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    router.push("/detalles_paciente");
  };

  return (
    <>
      <div className="w-full max-w-2xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Antecedentes</h1>
          <a href="/detalles_paciente" className="text-[#337790] underline">
            Omitir por ahora
          </a>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Condiciones médicas */}
          <div>
            <label className="font-semibold">
              Antecedentes crónicos o condición médica
            </label>
            <input
              type="text"
              placeholder="(diabetes, hipertensión, asma, etc.)"
              className="w-full border rounded-md px-3 py-2 mt-1"
              value={form.condiciones}
              onChange={(e) =>
                setForm({ ...form, condiciones: e.target.value })
              }
            />
            {errors.condiciones && (
              <p className="text-sm text-red-600 mt-1">
                {errors.condiciones}
              </p>
            )}
          </div>

          {/* Cirugías */}
          <div>
            <label className="font-semibold">
              Cirugías o lesiones previas importantes
            </label>
            <input
              type="text"
              className="w-full border rounded-md px-3 py-2 mt-1"
              value={form.cirugias}
              onChange={(e) =>
                setForm({ ...form, cirugias: e.target.value })
              }
            />
            {errors.cirugias && (
              <p className="text-sm text-red-600 mt-1">
                {errors.cirugias}
              </p>
            )}
          </div>

          {/* Actividad física */}
          <div>
            <label className="font-semibold">Actividad física</label>

            <div className="flex items-center gap-3 mt-2">
              <button
                type="button"
                className={`px-4 py-2 border rounded-md ${
                  form.actividadFisica === true
                    ? "bg-[#337790] text-white"
                    : ""
                }`}
                onClick={() => toggle("actividadFisica", true)}
              >
                Sí
              </button>

              <button
                type="button"
                className={`px-4 py-2 border rounded-md ${
                  form.actividadFisica === false
                    ? "bg-[#337790] text-white"
                    : ""
                }`}
                onClick={() => toggle("actividadFisica", false)}
              >
                No
              </button>

              <input
                type="text"
                placeholder="Regularidad"
                className="flex-1 border rounded-md px-3 py-2"
                value={form.regularidadActividad}
                onChange={(e) =>
                  setForm({
                    ...form,
                    regularidadActividad: e.target.value,
                  })
                }
              />

              <input
                type="text"
                placeholder="Tipo"
                className="flex-1 border rounded-md px-3 py-2"
                value={form.tipoActividad}
                onChange={(e) =>
                  setForm({ ...form, tipoActividad: e.target.value })
                }
              />
            </div>
          </div>

          {/* Hábitos */}
          <div>
            <label className="font-semibold">
              Hábitos que puedan influir en tu salud
            </label>
            <input
              type="text"
              placeholder="(fumar, alcohol, dormir poco)"
              className="w-full border rounded-md px-3 py-2 mt-1"
              value={form.habitos}
              onChange={(e) =>
                setForm({ ...form, habitos: e.target.value })
              }
            />
            {errors.habitos && (
              <p className="text-sm text-red-600 mt-1">
                {errors.habitos}
              </p>
            )}
          </div>

          {/* Dolores pasados */}
          <div>
            <label className="font-semibold">
              Lesiones o dolores importantes en el pasado
            </label>
            <input
              type="text"
              placeholder="Describe aquí..."
              className="w-full border rounded-md px-3 py-2 mt-1"
              value={form.doloresPasados}
              onChange={(e) =>
                setForm({ ...form, doloresPasados: e.target.value })
              }
            />
            {errors.doloresPasados && (
              <p className="text-sm text-red-600 mt-1">
                {errors.doloresPasados}
              </p>
            )}
          </div>

          {/* Fisioterapia previa */}
          <div>
            <label className="font-semibold">
              ¿Has recibido fisioterapia antes?
            </label>

            <div className="flex items-center gap-3 mt-2">
              <button
                type="button"
                className={`px-4 py-2 border rounded-md ${
                  form.fisioAntes === true
                    ? "bg-[#337790] text-white"
                    : ""
                }`}
                onClick={() => toggle("fisioAntes", true)}
              >
                Sí
              </button>

              <button
                type="button"
                className={`px-4 py-2 border rounded-md ${
                  form.fisioAntes === false
                    ? "bg-[#337790] text-white"
                    : ""
                }`}
                onClick={() => toggle("fisioAntes", false)}
              >
                No
              </button>

              <input
                type="text"
                placeholder="Regularidad"
                className="flex-1 border rounded-md px-3 py-2"
                value={form.regularidadFisio}
                onChange={(e) =>
                  setForm({
                    ...form,
                    regularidadFisio: e.target.value,
                  })
                }
              />

              <input
                type="text"
                placeholder="Periodicidad"
                className="flex-1 border rounded-md px-3 py-2"
                value={form.periodicidadFisio}
                onChange={(e) =>
                  setForm({
                    ...form,
                    periodicidadFisio: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* Botón */}
          <button
            type="submit"
            className="w-full bg-[#337790] hover:bg-[#337790] text-white py-3 rounded-lg text-lg font-semibold transition-colors"
          >
            Guardar o Actualizar
          </button>
        </form>
      </div>

      {/* MODAL DE ÉXITO */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 text-center">
            <p className="text-lg font-semibold text-[#337790] mb-4">
              Datos guardados correctamente
            </p>
            <button
              onClick={handleSuccessClose}
              className="mt-2 px-6 py-2 bg-[#337790] text-white rounded-md font-medium hover:bg-[#285f73] transition-colors"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
