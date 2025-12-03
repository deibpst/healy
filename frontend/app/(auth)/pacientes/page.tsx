"use client";

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from "next/navigation";
import { mockPatients } from '../data/mockData';

// Colores
const primaryColor = '#6ed0eb';
const secondaryColor = '#337790 ';

// Interface
interface Paciente {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  edad: number;
  fechaIngreso: string;
  ultimaSesion: string;
  proximaSesion: string;
  notasMedicas: string;
}

export default function ListaPacientesPage() {

  const searchParams = useSearchParams();
  const searchTerm = (searchParams.get("search") || "").toLowerCase();

  // Remover acentos
  const normalize = (str: string) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const initialPacientes: Paciente[] = mockPatients;

  // FILTRO FINAL
  const filteredPacientes = initialPacientes.filter((paciente) => {
    const search = normalize(searchTerm);

    const nombreCompleto = normalize(
      `${paciente.nombre} ${paciente.apellido}`.toLowerCase()
    );

    return (
      nombreCompleto.includes(search) ||
      normalize(paciente.telefono).includes(search) ||
      normalize(paciente.email.toLowerCase()).includes(search)
    );
  });

  // Avatar
  const Avatar = ({ nombre, apellido }: { nombre: string; apellido: string }) => {
    const iniciales = `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
    return (
      <div className="flex-shrink-0">
        <div className="w-16 h-16 bg-gradient-to-br from-[#337790] to-cyan-600 rounded-full flex items-center justify-center text-white shadow-lg font-bold text-lg">
          {iniciales}
        </div>
      </div>
    );
  };

  // Fila de paciente
  const PacienteRow = ({ paciente }: { paciente: Paciente }) => {
    const nombreCompleto = `${paciente.nombre} ${paciente.apellido}`;
    
    return (
      <div className="border-b border-gray-300 pb-8 mb-8 last:border-b-0 last:mb-0 last:pb-0">
        <div className="flex gap-4 items-start">

          <Avatar nombre={paciente.nombre} apellido={paciente.apellido} />

          <div className="grow">
            {/* Nombre */}
            <div className="mb-3">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {nombreCompleto}
              </h2>
              <p className="text-gray-700">
                {paciente.notasMedicas.split('.')[0]}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                <span>Edad: {paciente.edad} años</span>
                <span>•</span>
                <span>Ingreso: {paciente.fechaIngreso}</span>
              </div>
            </div>

            {/* Email / Tel */}
            <div className="space-y-1 mb-2">
              <div className="flex items-center text-gray-700">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>{paciente.email}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{paciente.telefono}</span>
              </div>
            </div>

            {/* Info */}
            <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-1">
                <span className="font-medium">Próxima sesión:</span>
                <span>{paciente.proximaSesion}</span>
              </div>
            </div>

            {/* Última + botones */}
            <div className="flex items-center justify-end space-x-4 mt-2">
              <div className="text-gray-700 text-right">
                <span className="font-medium">Última sesión: </span>
                <span className="font-semibold">{paciente.ultimaSesion}</span>
              </div>

              <div className="flex flex-col space-y-2">
                <Link href="/detalles_paciente">
                  <button
                    className="px-6 py-2 text-white rounded-lg font-semibold text-sm hover:opacity-90 transition-colors w-full"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Perfil
                  </button>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Mis Pacientes
          </h1>
        </div>

        <div className="border-t border-gray-300 mb-8"></div>

        {/* LISTA */}
        <div className="space-y-0">
          {filteredPacientes.length > 0 ? (
            filteredPacientes.map((paciente) => (
              <PacienteRow key={paciente.id} paciente={paciente} />
            ))
          ) : (
            <p className="text-center text-lg text-gray-500 py-10">
              No se encontraron pacientes que coincidan con la búsqueda.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-300 flex justify-between items-center">
          <p className="text-gray-600 font-medium">
            Total de pacientes: {initialPacientes.length}
            {searchTerm && (
              <span className="ml-2 text-blue-500">
                ({filteredPacientes.length} encontrados)
              </span>
            )}
          </p>

          <Link 
            href="/nuevo_paciente"
            className="flex items-center px-6 py-3 text-white rounded-full hover:opacity-90 transition-colors font-medium shadow-md"
            style={{ backgroundColor: '#337790' }}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Agregar Paciente
          </Link>
        </div>

      </div>
    </div>
  );
}
