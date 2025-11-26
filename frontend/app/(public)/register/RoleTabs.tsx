'use client';
import React from 'react';

interface RoleTabsProps {
  role: 'paciente' | 'fisioterapeuta';
  setRole: (role: 'paciente' | 'fisioterapeuta') => void;
}

export default function RoleTabs({ role, setRole }: RoleTabsProps) {
  return (
    <div className="flex mb-6 bg-gray-100 rounded-md p-1">
      <button
        type="button"
        onClick={() => setRole('paciente')}
        className={`flex-1 py-2 rounded-md transition ${
          role === 'paciente'
            ? 'bg-white shadow font-semibold text-gray-800'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        Paciente
      </button>
      <button
        type="button"
        onClick={() => setRole('fisioterapeuta')}
        className={`flex-1 py-2 rounded-md transition ${
          role === 'fisioterapeuta'
            ? 'bg-white shadow font-semibold text-gray-800'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        Fisioterapeuta
      </button>
    </div>
  );
}
