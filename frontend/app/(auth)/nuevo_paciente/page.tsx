import NuevoPacienteForm from "./NuevoPacienteForm";

export default function NuevoPacientePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm px-6 py-8">
        {}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Nuevo Paciente
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Completa tus datos para registrar
            </p>
          </div>

          <button
            type="button"
            className="text-sm font-medium text-slate-500 hover:text-slate-700"
          >
            Cancelar
          </button>
        </div>

        {}
        <div className="mb-6 bg-slate-100 rounded-full p-1 flex">
          <button
            type="button"
            className="flex-1 rounded-full bg-white text-sm font-medium text-slate-900 py-2 shadow-sm"
          >
            Paciente
          </button>
        </div>

        {}
        <NuevoPacienteForm />
      </div>
    </main>
  );
}