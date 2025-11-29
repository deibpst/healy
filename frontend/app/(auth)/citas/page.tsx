'use client';

import FormulariodeSesiones from './formulariodesesiones'; 
import React, { useState } from 'react';

export default function CitasRegistroPage() {
    
    // Estado para el contador de citas
    const [numeroDeCita, setNumeroDeCita] = useState(1);
    const [mostrarFormulario, setMostrarFormulario] = useState(true);
    
    // Función para crear una nueva cita
    const crearNuevaCita = () => {
        setNumeroDeCita(prev => prev + 1);
        setMostrarFormulario(false);
        // Resetear el formulario
        setTimeout(() => setMostrarFormulario(true), 0);
    };
    
    // Formatear el número con ceros a la izquierda (001, 002, etc.)
    const numeroFormateado = String(numeroDeCita).padStart(3, '0');
    
    return (
        <main className="flex min-h-screen flex-col items-center justify-center py-10">
            {/* Botón para crear nueva cita (opcional, puedes mostrarlo después del primer envío) */}
            {numeroDeCita > 1 && (
                <button
                    onClick={crearNuevaCita}
                    className="mb-4 px-6 py-2 bg-[#2E748E] text-white font-semibold rounded-md hover:bg-[#23596D] transition duration-150"
                >
                    Nueva Cita
                </button>
            )}
            
            {/* Renderización del componente */}
            {mostrarFormulario && (
                <FormulariodeSesiones 
                    numeroCita={numeroFormateado}
                    onGuardar={crearNuevaCita} // Pasar función para incrementar después de guardar
                />
            )}
        </main>
    );
}