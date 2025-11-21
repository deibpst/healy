"use client";

import { useState } from "react";

export default function AntecedentesPage() {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos enviados:", form);

    // Aquí conectarás con tu backend: 
    // await fetch("/api/antecedentes", { method: "POST", body: JSON.stringify(form) });
  };

  const toggle = (field: "actividadFisica" | "fisioAntes", value: boolean) => {
    setForm({ ...form, [field]: value });
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Antecedentes</h1>
        <a href="/home" className="text-blue-600 underline">
          Omitir por ahora
        </a>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Condiciones médicas */}
        <div>
          <label className="font-semibold">Antecedentes crónicos o condición médica</label>
          <input
            type="text"
            placeholder="(diabetes, hipertensión, asma, etc.)"
            className="w-full border rounded-md px-3 py-2 mt-1"
            value={form.condiciones}
            onChange={(e) => setForm({ ...form, condiciones: e.target.value })}
          />
        </div>

        {/* Cirugías */}
        <div>
          <label className="font-semibold">Cirugías o lesiones previas importantes</label>
          <input
            type="text"
            className="w-full border rounded-md px-3 py-2 mt-1"
            value={form.cirugias}
            onChange={(e) => setForm({ ...form, cirugias: e.target.value })}
          />
        </div>

        {/* Actividad física */}
        <div>
          <label className="font-semibold">Actividad física</label>

          <div className="flex items-center gap-3 mt-2">
            <button
              type="button"
              className={`px-4 py-2 border rounded-md ${
                form.actividadFisica === true ? "bg-blue-600 text-white" : ""
              }`}
              onClick={() => toggle("actividadFisica", true)}
            >
              Sí
            </button>

            <button
              type="button"
              className={`px-4 py-2 border rounded-md ${
                form.actividadFisica === false ? "bg-blue-600 text-white" : ""
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
                setForm({ ...form, regularidadActividad: e.target.value })
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
            onChange={(e) => setForm({ ...form, habitos: e.target.value })}
          />
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
            onChange={(e) => setForm({ ...form, doloresPasados: e.target.value })}
          />
        </div>

        {/* Fisioterapia previa */}
        <div>
          <label className="font-semibold">¿Has recibido fisioterapia antes?</label>

          <div className="flex items-center gap-3 mt-2">
            <button
              type="button"
              className={`px-4 py-2 border rounded-md ${
                form.fisioAntes === true ? "bg-blue-600 text-white" : ""
              }`}
              onClick={() => toggle("fisioAntes", true)}
            >
              Sí
            </button>

            <button
              type="button"
              className={`px-4 py-2 border rounded-md ${
                form.fisioAntes === false ? "bg-blue-600 text-white" : ""
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
                setForm({ ...form, regularidadFisio: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Periodicidad"
              className="flex-1 border rounded-md px-3 py-2"
              value={form.periodicidadFisio}
              onChange={(e) =>
                setForm({ ...form, periodicidadFisio: e.target.value })
              }
            />
          </div>
        </div>

        {/* Botón */}
        <button
          type="submit"
          className="w-full bg-[#3B82F6] hover:bg-[#1D4ED8] text-white py-3 rounded-lg text-lg font-semibold transition-colors"
        >
          Guardar o Actualizar
        </button>

      </form>
    </div>
  );
}
