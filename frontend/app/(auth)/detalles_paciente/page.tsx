'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Phone, Mail, MapPin, Briefcase } from 'lucide-react';
import { Paciente, Ejercicio } from '../types/paciente';
import {
	getPatientById,
	getEjerciciosByPatientId
} from '../data/mockData';

export default function DetallesPaciente() {
	const [activeTab, setActiveTab] = useState<string>('informacion');
	
	// Esta linea solo es para tomar los datos del paciente, se debiaria obtener por la URL
	const patientId = '1'; // Cambiar a '2' o '3' para ver otros pacientes
	
	// Estados para los datos
	const [patient, setPatient] = useState<Paciente | null>(null);
	const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	// aqui se carganlos datos que se guardaron en los archivos
	useEffect(() => {
		const loadPatientData = () => {
			const patientData = getPatientById(patientId);
			
			if (patientData) {
				setPatient(patientData);
				setEjercicios(getEjerciciosByPatientId(patientId));
			}
			
			setLoading(false);
		};

		loadPatientData();
	}, [patientId]);

	// Función para obtener iniciales del nombre
	const getInitials = (nombre: string, apellido: string): string => {
		return `${nombre.charAt(0)}${apellido.charAt(0)}`;
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-full min-h-[500px]">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-700 mx-auto"></div>
					<p className="mt-4 text-gray-600">Cargando información del paciente...</p>
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
		<div className="p-8">
			{/* Header del paciente */}
			<div className="bg-white rounded-xl shadow-sm p-6 mb-6">
				<div className="flex items-start gap-6">
					<div className="w-20 h-20 bg-teal-700 rounded-full flex items-center justify-center flex-shrink-0">
						<span className="text-white text-2xl font-semibold">
							{getInitials(patient.nombre, patient.apellido)}{/*aqui se colocan las iniciales en la foto de perfil*/}
						</span>
					</div>
					
					{/* Información principal */}
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

			{/* Navegacion: aqui se deben poner lo que queremos que esté en la barra de navegacion, junto con su id*/}
			<div className="bg-white rounded-xl shadow-sm mb-6">
				<div className="flex border-b border-gray-200 overflow-x-auto">
					{[
						{ id: 'informacion', label: 'Información' },
						{ id: 'ejercicios', label: 'Ejercicios' }
					].map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
								activeTab === tab.id
									? 'text-teal-700 border-b-2 border-teal-700'
									: 'text-gray-600 hover:text-gray-800'
							}`}
						>
							{tab.label}
						</button>
					))}
				</div>
			</div>

			{/*Tomar esto de ejemplo para la ralizacion de las opciones de citas y antecedentes */}
			{activeTab === 'informacion' && (
				<>
					{/* Información Personal */}
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
								<span className="text-gray-600 font-medium">Fecha de ingreso</span>
								<span className="text-gray-800 font-semibold">
									{patient.fechaIngreso}
								</span>
							</div>
							
							<div className="flex justify-between py-3 border-b border-gray-100">
								<span className="text-gray-600 font-medium">Última sesión</span>
								<span className="text-gray-800 font-semibold">
									{patient.ultimaSesion}
								</span>
							</div>
							
							<div className="flex justify-between py-3 border-b border-gray-100">
								<span className="text-gray-600 font-medium">Próxima sesión</span>
								<span className="text-teal-700 font-semibold">
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
							<button className="bg-teal-700 text-white px-6 py-3 rounded-lg hover:bg-teal-800 transition-colors font-medium flex items-center gap-2">
								<Calendar size={18} />
								Programar próxima cita
							</button>
						</div>
					</div>
				</>
			)}

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
										<tr key={ejercicio.id} className="hover:bg-gray-50 transition-colors">
											<td className="px-6 py-4">
												<div className="text-gray-800 font-medium">
													{ejercicio.nombre}
												</div>
											</td>
											<td className="px-6 py-4 text-center"> 
												<input
													type="checkbox"
													checked={ejercicio.completado}
													onChange={() =>{}} 
													className="w-5 h-5 text-teal-700 rounded focus:ring-teal-500 cursor-pointer"
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
							<button className="mt-4 text-teal-700 hover:text-teal-800 font-medium text-sm">
								Asignar primer ejercicio
							</button>
						</div>
					)}
				</div>
			)}
		</div>
	);
}