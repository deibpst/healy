"use client";

import React, { useState } from 'react';

// Estilo personalizado para usar los colores específicos
const primaryColor = 'rgb(110, 208, 235)'; // Perfil (Claro)
const secondaryColor = 'rgb(46, 116, 143)'; // Archivar (Oscuro)

interface Paciente {
  id: number;
  nombre: string;
  condicion: string;
  email: string;
  telefono: string;
  ultimaSesion: string;
}

export default function ListaPacientesPage() {
  const initialPacientes: Paciente[] = [
    {
      id: 1,
      nombre: "María Gonzalez",
      condicion: "Dolor de espalda baja",
      email: "mariagonzalez@gmail.com",
      telefono: "025 145 23 22",
      ultimaSesion: "30/Oct/2025"
    },
    {
      id: 2,
      nombre: "Luiz Ortiz",
      condicion: "Tensión cervical",
      email: "luisortiz@gmail.com",
      telefono: "025 145 23 22",
      ultimaSesion: "10/Nov/2025"
    }
  ];

  const [searchTerm, setSearchTerm] = useState('');
  
  // Filtra los pacientes basándose en el término de búsqueda
  const filteredPacientes = initialPacientes.filter(paciente => {
    const lowerCaseSearch = searchTerm.toLowerCase();
    return (
      paciente.nombre.toLowerCase().includes(lowerCaseSearch) ||
      paciente.telefono.includes(lowerCaseSearch) ||
      paciente.email.toLowerCase().includes(lowerCaseSearch)
    );
  });

  // Componente para mostrar el icono de usuario
  const Avatar = () => {
    return (
      <div className="flex-shrink-0">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-full flex items-center justify-center text-white shadow-lg">
          <svg 
            className="w-8 h-8" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
            />
          </svg>
        </div>
      </div>
    );
  };
  
  // Componente para la Fila del Paciente
  const PacienteRow = ({ paciente }: { paciente: Paciente }) => {
    return (
      <div className="border-b border-gray-300 pb-8 mb-8 last:border-b-0 last:mb-0 last:pb-0">
        <div className="flex gap-4 items-start">
          
          <Avatar />

          <div className="grow">
            {/* Nombre y condición */}
            <div className="mb-3">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {paciente.nombre}
              </h2>
              <p className="text-gray-700">
                {paciente.condicion}
              </p>
            </div>

            {/* Email y teléfono con iconos */}
            <div className="space-y-1 mb-2">
              <div className="flex items-center text-gray-700">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>{paciente.email}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{paciente.telefono}</span>
              </div>
            </div>

            {/* Última sesión y botones - MÁS ARRIBA */}
            <div className="flex items-center justify-end space-x-4 mt-2">
              {/* Última sesión al lado izquierdo de los botones */}
              <div className="text-gray-700 text-right">
                <span className="font-medium">Última sesión: </span>
                <span className="font-semibold">{paciente.ultimaSesion}</span>
              </div>

              {/* Botones en columna (Perfil arriba, Archivar abajo) */}
              <div className="flex flex-col space-y-2">
                <button
                  className="px-6 py-2 text-white rounded-lg font-semibold text-sm hover:opacity-90 transition-colors"
                  style={{ backgroundColor: primaryColor }}
                >
                  Perfil
                </button>
                <button
                  className="px-6 py-2 text-white rounded-lg font-semibold text-sm hover:opacity-90 transition-colors"
                  style={{ backgroundColor: secondaryColor }}
                >
                  Archivar
                </button>
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
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Mis Pacientes
          </h1>
          
          {/* Search Bar - Estilo minimalista como en la imagen */}
          <div className="relative max-w-2xl">
            <div className="flex items-center border-b border-gray-300 pb-2">
              <svg 
                className="w-5 h-5 text-gray-400 mr-3" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
              <input
                type="text"
                placeholder="Buscar por nombre, teléfono, email..."
                className="w-full bg-transparent text-gray-900 focus:outline-none placeholder-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Separador */}
        <div className="border-t border-gray-300 mb-8"></div>

        {/* Lista de Pacientes */}
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

        {/* Footer con Total y Botón de Añadir */}
        <div className="mt-8 pt-6 border-t border-gray-300 flex justify-between items-center">
          <p className="text-gray-600 font-medium">
            Total de pacientes: {initialPacientes.length}
            {searchTerm && (
              <span className="ml-2 text-blue-500">
                ({filteredPacientes.length} encontrados)
              </span>
            )}
          </p>
          
          <button 
            className="flex items-center px-6 py-3 text-white rounded-full hover:opacity-90 transition-colors font-medium shadow-md"
            style={{ backgroundColor: primaryColor }}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}