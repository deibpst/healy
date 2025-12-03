'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Phone, Mail } from 'lucide-react';
import { Paciente, Ejercicio, Cita, Antecedente } from '../types/paciente';
import {
  getPatientById,
  getEjerciciosByPatientId,
  getCitasByPatientId,
  getAntecedentesByPatientId,
} from '../data/mockData';

export default function DetallesPaciente() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<string>('informacion');

  // Por ahora fijo, luego se obtiene de la URL
  const patientId = '1';

  // Estados principales
  const [patient, setPatient] = useState<Paciente | null>(null);
  const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [antecedentes, setAntecedentes] = useState<Antecedente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Estado para el modal de programar cita
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [scheduleMessage, setScheduleMessage] = useState('');

  // Cargar datos desde mockData
  useEffect(() => {
    const loadPatientData = () => {
      const patientData = getPatientById(patientId);

      if (patientData) {
        setPatient(patientData);
        setEjercicios(getEjerciciosByPatientId(patientId));
        setCitas(getCitasByPatientId(patientId));
        setAntecedentes(getAntecedentesByPatientId(patientId));
      }

      setLoading(false);
    };

    loadPatientData();
  }, [patientId]);

  // Iniciales del paciente
  const getInitials = (nombre: string, apellido: string): string => {
    return `${nombre.charAt(0)}${apellido.charAt(0)}`;
  };

  const openScheduleModal = () => {
    setScheduleDate('');
    setScheduleTime('');
    setScheduleMessage('');
    setIsScheduleModalOpen(true);
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patient) return;
    if (!scheduleDate || !scheduleTime) return;

    const msg = `Cita agendada para ${patient.nombre} ${patient.apellido} el ${scheduleDate} a las ${scheduleTime}`;
    setScheduleMessage(msg);
    // Aquí, en un futuro, mandarías los datos al backend
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[500px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#337790] mx-auto"></div>
          <p className="mt-4 text-gray-600">
            Cargando información del paciente...
          </p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex items-center justify-center h-full min-h-[500px]">
        <div className="text-center">
          <p className="text-xl text-gray-600">Paciente no encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-8">
        {/* HEADER DEL PACIENTE */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-[#337790] rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-2xl font-semibold">
                {getInitials(patient.nombre, patient.apellido)}
              </span>
            </div>

            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800 mb-1">
                Detalle del paciente
              </h1>
              <p className="text-xl text-gray-700 font-medium mb-3">
                {patient.nombre} {patient.apellido}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-gray-400" />
                  <span>{patient.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-gray-400" />
                  <span>{patient.telefono}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {[
              { id: 'informacion', label: 'Información' },
              { id: 'ejercicios', label: 'Ejercicios' },
              { id: 'citas', label: 'Citas' },
              { id: 'antecedentes', label: 'Antecedentes' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-[#337790] border-b-2 border-[#337790]'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ================== TAB INFORMACIÓN ================== */}
        {activeTab === 'informacion' && (
          <>
            {/* Info personal */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Información Personal
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Edad</span>
                  <span className="text-gray-800 font-semibold">
                    {patient.edad} años
                  </span>
                </div>

                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">
                    Fecha de ingreso
                  </span>
                  <span className="text-gray-800 font-semibold">
                    {patient.fechaIngreso}
                  </span>
                </div>

                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">
                    Última sesión
                  </span>
                  <span className="text-gray-800 font-semibold">
                    {patient.ultimaSesion}
                  </span>
                </div>

                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">
                    Próxima sesión
                  </span>
                  <span className="text-[#337790] font-semibold">
                    {patient.proximaSesion}
                  </span>
                </div>
              </div>
            </div>

            {/* Notas médicas */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Notas médicas
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {patient.notasMedicas}
              </p>
            </div>

            {/* Acciones rápidas */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Acciones rápidas
              </h2>
              <div className="flex flex-wrap gap-3">
                {/* Programar (abre modal) */}
                <button
                  onClick={openScheduleModal}
                  className="bg-[#337790] text-white px-6 py-3 rounded-lg hover:bg-teal-800 transition-colors font-medium flex items-center gap-2"
                >
                  <Calendar size={18} />
                  Programar próxima cita
                </button>

                {/* Registrar (redirige a /citas) */}
                <button
                  onClick={() =>
                    router.push(`/citas?patientId=${patientId}`)
                  }
                  className="bg-[#337790] text-white px-6 py-3 rounded-lg hover:bg-teal-800 transition-colors font-medium flex items-center gap-2"
                >
                  <Calendar size={18} />
                  Registrar cita
                </button>
              </div>
            </div>
          </>
        )}

        {/* ================== TAB EJERCICIOS ================== */}
        {activeTab === 'ejercicios' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {ejercicios.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Ejercicio
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                        Completado
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                        Fecha de asignación
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {ejercicios.map((ejercicio) => (
                      <tr
                        key={ejercicio.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="text-gray-800 font-medium">
                            {ejercicio.nombre}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <input
                            type="checkbox"
                            checked={ejercicio.completado}
                            onChange={() => {}}
                            className="w-5 h-5 accent-[#337790] rounded cursor-pointer"
                          />
                        </td>
                        <td className="px-6 py-4 text-right text-gray-600">
                          {ejercicio.fecha}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No hay ejercicios asignados</p>
                <button className="mt-4 text-[#337790] hover:text-teal-800 font-medium text-sm">
                  Asignar primer ejercicio
                </button>
              </div>
            )}
          </div>
        )}

        {/* ================== TAB CITAS ================== */}
        {activeTab === 'citas' && (
          <div className="space-y-4">
            {citas.length > 0 ? (
              citas.map((cita, index) => (
                <div
                  key={cita.id}
                  className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-between"
                >
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      Cita {index + 1}
                    </p>
                    {cita.notas && (
                      <p className="text-sm text-gray-600 mt-1">
                        {cita.notas}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Fecha</p>
                      <p className="text-gray-800 font-medium">
                        {cita.fecha}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        router.push(`/citas?id=${cita.id}&patientId=${patientId}`)
                      }
                      className="px-5 py-2 rounded-full bg-[#337790] text-white text-sm font-medium hover:bg-teal-800 transition-colors"
                    >
                      Ver detalles
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                <p className="text-gray-500">
                  No hay citas registradas para este paciente.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ================== TAB ANTECEDENTES ================== */}
        {activeTab === 'antecedentes' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Antecedentes del paciente
              </h2>

              {antecedentes.length > 0 ? (
                <div className="space-y-3">
                  {antecedentes.map((ant) => (
                    <div
                      key={ant.id}
                      className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-b-0"
                    >
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {ant.tipo.toUpperCase()}
                        </p>
                        <p className="text-sm text-gray-600">
                          {ant.descripcion}
                        </p>
                      </div>
                      <span className="text-sm text-gray-500">
                        {ant.fecha}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">
                  No hay antecedentes registrados para este paciente.
                </p>
              )}

              <button
                onClick={() =>
                  router.push(`/antecedentes?patientId=${patientId}`)
                }
                className="mt-6 px-6 py-3 bg-[#337790] text-white rounded-lg text-sm font-medium hover:bg-teal-800 transition-colors"
              >
                Ver / editar antecedentes
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ============ MODAL PROGRAMAR NUEVA CITA ============ */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
            {/* Botón cerrar (X) */}
            <button
              onClick={() => setIsScheduleModalOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl leading-none"
              aria-label="Cerrar"
            >
              ×
            </button>

            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Programar nueva cita
            </h3>

            <form onSubmit={handleScheduleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha
                </label>
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-[#337790]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora
                </label>
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-[#337790]"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 bg-[#337790] text-white rounded-md py-2 font-medium hover:bg-teal-800 transition-colors"
              >
                Agendar
              </button>
            </form>

            {scheduleMessage && (
              <p className="mt-4 text-sm text-green-600 font-medium">
                {scheduleMessage}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
