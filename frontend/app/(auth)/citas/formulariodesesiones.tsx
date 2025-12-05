'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// ===============================================
// 1. TIPADO DE PROPIEDADES Y ESTADO
// ===============================================
interface FormularioProps {
    onGuardar?: () => void; 
}

interface EstadoFormularioLesion {
    zonaAfectada: string;
    causaLesion: string;
    fechaLesion: string;
    descripcionDolor: string;
    nivelDolor: number; 
    factoresEmpeoran: string;
    factoresMejoran: string;
    adormecimientoDebilidad: boolean;
    perdidaFuerza: boolean;
    fiebrePerdidaPeso: boolean;
    actividadesDiarias: boolean;
    rigidezMoverse: boolean;
    ayudaExterna: boolean;
    asignacionEjercicios: string;
    notas: string;
}

// Quitar para el backend, aquí debe jalar los ejercicios de la BD
const ejerciciosDisponibles = ['Estiramiento de Cuádriceps', 'Fortalecimiento de Núcleo', 'Movilización de Hombro'];


// ===============================================
// 2. COMPONENTE PRINCIPAL
// ===============================================
export default function FormularioRegistroLesion({ onGuardar }: FormularioProps) {
    const router = useRouter();

    const [datosFormulario, setDatosFormulario] = useState<EstadoFormularioLesion>({
        zonaAfectada: '',
        causaLesion: '',
        fechaLesion: '',
        descripcionDolor: '',
        nivelDolor: 5, // Valor inicial
        factoresEmpeoran: '',
        factoresMejoran: '',
        adormecimientoDebilidad: false,
        perdidaFuerza: false,
        fiebrePerdidaPeso: false,
        actividadesDiarias: false,
        rigidezMoverse: false,
        ayudaExterna: false,
        asignacionEjercicios: '',
        notas: '',
    });

    const [errores, setErrores] = useState<Record<string, string>>({});
    const [mostrarSelectorEjercicios, setMostrarSelectorEjercicios] = useState(false); 
    const [showSuccess, setShowSuccess] = useState(false);

    const obtenerFechaHoy = () => {
        const hoy = new Date();
        const año = hoy.getFullYear();
        const mes = String(hoy.getMonth() + 1).padStart(2, '0');
        const dia = String(hoy.getDate()).padStart(2, '0');
        return `${año}-${mes}-${dia}`;
    };

    const fechaMaxima = obtenerFechaHoy();

    // Lógica para añadir ejercicios a la lista de texto (PF17-V407)
    const manejarSeleccionEjercicio = (ejercicio: string) => {
        setDatosFormulario(prev => ({
            ...prev,
            asignacionEjercicios: prev.asignacionEjercicios 
                ? `${prev.asignacionEjercicios}\n- ${ejercicio}` 
                : `- ${ejercicio}`
        }));
        setMostrarSelectorEjercicios(false); 
    };


    const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type, checked } = e.target;
        
        let valorFinal: string | number | boolean = value;

        if (type === 'checkbox') {
            valorFinal = checked; 
        } else if (name === 'nivelDolor' && type === 'number') {
            valorFinal = parseInt(value, 10);
            if (valorFinal < 1) valorFinal = 1;
            if (valorFinal > 10) valorFinal = 10;
        }

        setDatosFormulario({ ...datosFormulario, [name]: valorFinal });
    };

    // 4. Función para manejar el envío con validaciones (PF11-V403)
    const manejarEnvio = (e: React.FormEvent) => {
        e.preventDefault();

        const erroresValidacion: Record<string, string> = {};

        // PF11-V401: Validar campos obligatorios básicos
        if (!datosFormulario.zonaAfectada.trim()) {
            erroresValidacion.zonaAfectada = 'La zona afectada es obligatoria.';
        }
        if (!datosFormulario.causaLesion.trim()) {
            erroresValidacion.causaLesion = 'La descripción de la causa es obligatoria.';
        }

        // PF12-V402: Validar Fecha (obligatoria y no futura)
        if (!datosFormulario.fechaLesion) {
            erroresValidacion.fechaLesion = 'La fecha es obligatoria.';
        } else {
            // Obtener fecha de hoy en formato YYYY-MM-DD (zona horaria local)
            const hoy = new Date();
            const añoHoy = hoy.getFullYear();
            const mesHoy = String(hoy.getMonth() + 1).padStart(2, '0');
            const diaHoy = String(hoy.getDate()).padStart(2, '0');
            const fechaHoyStr = `${añoHoy}-${mesHoy}-${diaHoy}`;
            
            // Comparar directamente las strings en formato YYYY-MM-DD
            if (datosFormulario.fechaLesion > fechaHoyStr) {
                erroresValidacion.fechaLesion = 'La fecha no puede ser futura.';
            }
        }

        // PF13-V403: Validar Nivel de Dolor (rango 1-10)
        if (datosFormulario.nivelDolor < 1 || datosFormulario.nivelDolor > 10) {
            erroresValidacion.nivelDolor = 'El nivel de dolor debe estar entre 1 y 10.';
        }
        
        setErrores(erroresValidacion);

        if (Object.keys(erroresValidacion).length > 0) {
            console.log('Validación fallida. Por favor, revisa los campos.', erroresValidacion);
            return; 
        }
        
        // PF16-V406: Lógica de Envío
        console.log('Registro de lesión y estado actual enviado:', datosFormulario);
        
        // Mostrar mensaje de "cita guardada correctamente"
        setShowSuccess(true);
    };

    const handleSuccessClose = () => {
        setShowSuccess(false);
        if (onGuardar) {
            onGuardar();
        }
        router.push('/detalles_paciente');
    };

    // 5. ESTRUCTURA DEL FORMULARIO (JSX)
    return (
        <>
            <div className="max-w-xl mx-auto p-8 bg-white shadow-xl">
                
                <form onSubmit={manejarEnvio} className="space-y-8">
                    
                    {/* ============================================== */}
                    {/* SECCIÓN 1: REGISTRO DE LESIÓN */}
                    {/* ============================================== */}
                    <div className='space-y-6'>
                        <h2 className="text-3xl font-bold text-gray-800">Registro de lesión</h2>

                        {/* Zona afectada / Historial médico (PF11-V401) */}
                        <div>
                            <label htmlFor="zonaAfectada" className="block text-sm font-medium text-gray-700">
                                Zona afectada / Historial (Osteoporosis, Artritis, Fibromialgia, cirugías previas, problemas neurológicos, etc.)
                            </label>
                            <input
                                id="zonaAfectada"
                                name="zonaAfectada"
                                type="text"
                                value={datosFormulario.zonaAfectada}
                                onChange={manejarCambio}
                                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholder="(Osteoporosis, Artritis, Fibromialgia, cirugías previas, problemas neurológicos, etc.)"
                            />
                            {errores.zonaAfectada && <p className="mt-1 text-sm text-red-600">{errores.zonaAfectada}</p>}
                        </div>

                        {/* ¿Cómo ocurrió la lesión? (PF11-V401) */}
                        <div>
                            <label htmlFor="causaLesion" className="block text-sm font-medium text-gray-700">
                                ¿Cómo ocurrió la lesión?
                            </label>
                            <input
                                id="causaLesion"
                                name="causaLesion"
                                type="text"
                                value={datosFormulario.causaLesion}
                                onChange={manejarCambio}
                                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                            {errores.causaLesion && <p className="mt-1 text-sm text-red-600">{errores.causaLesion}</p>}
                        </div>

                        {/* Fila de Fecha y Descripción/Nivel de Dolor */}
                        <div className="grid grid-cols-3 gap-4">
                            
                        {/* Fecha de la lesión (PF12-V402) */}
                        <div className="col-span-1">
                            <label htmlFor="fechaLesion" className="block text-sm font-medium text-gray-700">
                                Fecha de la lesión
                            </label>
                            <input
                                id="fechaLesion"
                                name="fechaLesion"
                                type="date"
                                value={datosFormulario.fechaLesion}
                                onChange={manejarCambio}
                                max={fechaMaxima}
                                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                            {errores.fechaLesion && <p className="mt-1 text-sm text-red-600">{errores.fechaLesion}</p>}
                        </div>
                            {/* Descripción de dolor */}
                            <div className="col-span-1">
                                <label htmlFor="descripcionDolor" className="block text-sm font-medium text-gray-700">
                                    Descripción de dolor
                                </label>
                                <input
                                    id="descripcionDolor"
                                    name="descripcionDolor"
                                    type="text"
                                    value={datosFormulario.descripcionDolor}
                                    onChange={manejarCambio}
                                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            
                            {/* Nivel de Dolor (1-10) (PF13-V403) */}
                            <div className="col-span-1">
                                <label htmlFor="nivelDolor" className="block text-sm font-medium text-gray-700">
                                    Nivel (1-10)
                                </label>
                                <input
                                    id="nivelDolor"
                                    name="nivelDolor"
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={datosFormulario.nivelDolor}
                                    onChange={manejarCambio}
                                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-center"
                                />
                                {errores.nivelDolor && <p className="mt-1 text-sm text-red-600">{errores.nivelDolor}</p>}
                            </div>
                        </div>

                        {/* Factores que lo empeoran */}
                        <div>
                            <label htmlFor="factoresEmpeoran" className="block text-sm font-medium text-gray-700">
                                Factores que lo empeoran
                            </label>
                            <input
                                id="factoresEmpeoran"
                                name="factoresEmpeoran"
                                type="text"
                                value={datosFormulario.factoresEmpeoran}
                                onChange={manejarCambio}
                                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Movimientos, clima, etc"
                            />
                        </div>

                        {/* Factores que lo mejoran */}
                        <div>
                            <label htmlFor="factoresMejoran" className="block text-sm font-medium text-gray-700">
                                Factores que lo mejoran
                            </label>
                            <input
                                id="factoresMejoran"
                                name="factoresMejoran"
                                type="text"
                                value={datosFormulario.factoresMejoran}
                                onChange={manejarCambio}
                                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Movimientos, clima, etc"
                            />
                        </div>
                    </div>

                    {/* ============================================== */}
                    {/* SECCIÓN 2: ESTADO ACTUAL DEL PACIENTE */}
                    {/* ============================================== */}
                    <div className="space-y-6 pt-4 border-t border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-800">Estado Actual del Paciente</h2>

                        {/* CHECKBOXES */}
                        <div className="space-y-3">
                            {[
                                { label: 'Adormecimiento, hormigueo o debilidad reciente', name: 'adormecimientoDebilidad' },
                                { label: 'Pérdida de fuerza', name: 'perdidaFuerza' },
                                { label: 'Fiebre o pérdida de peso sin motivo', name: 'fiebrePerdidaPeso' },
                                { label: 'Puede realizar sus actividades diarias', name: 'actividadesDiarias' },
                                { label: 'Rigidez al moverse', name: 'rigidezMoverse' },
                                { label: 'Ayuda externa o apoyo para algun movimiento', name: 'ayudaExterna' },
                            ].map(({ label, name }) => (
                                <div key={name} className="flex items-center">
                                    <input
                                        id={name}
                                        name={name}
                                        type="checkbox"
                                        checked={datosFormulario[name as keyof EstadoFormularioLesion] as boolean} 
                                        onChange={manejarCambio}
                                        className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <label htmlFor={name} className="ml-3 block text-sm font-medium text-gray-700">
                                        {label}
                                    </label>
                                </div>
                            ))}
                        </div>

                        {/* Asignación de ejercicios (TEXTAREA con ADD+) */}
                        <div>
                            <label htmlFor="asignacionEjercicios" className="block text-sm font-medium text-gray-700">
                                Asignación de ejercicios:
                            </label>
                            <div className="relative mt-1">
                                <textarea
                                    id="asignacionEjercicios"
                                    name="asignacionEjercicios"
                                    rows={5}
                                    value={datosFormulario.asignacionEjercicios}
                                    onChange={manejarCambio}
                                    className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 pr-12"
                                    placeholder="Lista de ejercicios asignados al paciente"
                                />
                                
                                {/* Botón "Add +" (PF17-V407) */}
                                <button 
                                    type="button" 
                                    onClick={() => setMostrarSelectorEjercicios(!mostrarSelectorEjercicios)}
                                    className="absolute bottom-2 right-2 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"
                                >
                                    Add +
                                </button>

                                {/* Selector de Ejercicios (Simulado) */}
                                {mostrarSelectorEjercicios && (
                                    <div className="absolute z-10 top-full right-0 mt-1 w-80 bg-white border border-gray-300 rounded-md shadow-lg">
                                        <h4 className='p-2 text-xs font-semibold text-gray-600 border-b'>Seleccionar ejercicio:</h4>
                                        {ejerciciosDisponibles.map((ejercicio) => (
                                            <div 
                                                key={ejercicio} 
                                                onClick={() => manejarSeleccionEjercicio(ejercicio)}
                                                className="p-2 text-sm cursor-pointer hover:bg-blue-100"
                                            >
                                                {ejercicio}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* NOTAS (INPUT) */}
                        <div>
                            <label htmlFor="notas" className="block text-sm font-medium text-gray-700">
                                NOTAS:
                            </label>
                            <input
                                id="notas"
                                name="notas"
                                type="text"
                                value={datosFormulario.notas}
                                onChange={manejarCambio}
                                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholder="(Descripción de la situación actual del paciente breve)"
                            />
                        </div>
                    </div>

                    {/* Botón de Envío Final (PF16-V406) - Color Personalizado */}
                    <button
                        type="submit"
                        className="w-full py-3 bg-[#2E748E] text-white font-semibold rounded-md hover:bg-[#23596D] transition duração-150 mt-6"
                    >
                        Guardar
                    </button>
                </form>
            </div>

            {/* MODAL DE ÉXITO */}
            {showSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 text-center">
                        <p className="text-lg font-semibold text-[#337790] mb-4">
                            Cita guardada correctamente
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