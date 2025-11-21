// este archivo y su informacion se podrán eliminar o modificar cuando se tenga el back
//solo se están ocupando para testear las vistas 

import { Paciente, Ejercicio, Cita, Antecedente } from '../types/paciente';

export const mockPatients: Paciente[] = [
	{
		id: '1',
		nombre: 'María',
		apellido: 'González',
		email: 'maria@ejemplo.com',
		telefono: '+52 55 1234 5678',
		edad: 28,
		fechaIngreso: '31/12/2023',
		ultimaSesion: '14/01/2024',
		proximaSesion: '21/01/2024',
		notasMedicas: 'Paciente muy colaborativa. Ha mostrado mejoras significativas en los últimos ejercicios de fortalecimiento. Se recomienda continuar con el plan actual y aumentar gradualmente la intensidad.'
	},
	{
		id: '2',
		nombre: 'Juan',
		apellido: 'Pérez',
		email: 'juan@ejemplo.com',
		telefono: '+52 55 9876 5432',
		edad: 35,
		fechaIngreso: '15/01/2024',
		ultimaSesion: '20/01/2024',
		proximaSesion: '27/01/2024',
		notasMedicas: 'Recuperación postoperatoria de rodilla derecha. Progreso satisfactorio. Mantener ejercicios de bajo impacto.'
	},
	{
		id: '3',
		nombre: 'Laura',
		apellido: 'Martínez',
		email: 'laura@ejemplo.com',
		telefono: '+52 55 5555 6666',
		edad: 42,
		fechaIngreso: '05/02/2024',
		ultimaSesion: '18/02/2024',
		proximaSesion: '25/02/2024',
		notasMedicas: 'Dolor crónico de espalda baja. Responde bien a terapia manual y ejercicios de core.'
	}
];

export const mockEjercicios: Record<string, Ejercicio[]> = {
	'1': [
		{
			id: 'e1',
			nombre: 'Sentadillas',
			fecha: '10/01/2024',
			completado: true
		},
		{
			id: 'e2',
			nombre: 'Plancha frontal',
			fecha: '10/01/2024',
			completado: false
		},
		{
			id: 'e3',
			nombre: 'Estiramiento de isquiotibiales',
			fecha: '10/01/2024',
			completado: true
		}
	],
	'2': [
		{
			id: 'e4',
			nombre: 'Extensión de rodilla',
			fecha: '16/01/2024',
			completado: false
		}
	]
};

export const mockCitas: Record<string, Cita[]> = {//esto se tiene que modificar, poniendo la info que se necesite
	//los datos tienen que coincidir con los que se pusieron en el archivo de "types/paciente.ts"
	'1': [
		{
			id: 'c1',
			fecha: '21/01/2024',
			hora: '10:00',
			tipo: 'seguimiento',
			estado: 'pendiente',
			duracion: 45,
			notas: 'Evaluación de progreso mensual'
		},
		{
			id: 'c2',
			fecha: '14/01/2024',
			hora: '15:30',
			tipo: 'tratamiento',
			estado: 'completada',
			duracion: 60,
			notas: 'Sesión de terapia manual'
		},
		{
			id: 'c3',
			fecha: '07/01/2024',
			hora: '11:00',
			tipo: 'tratamiento',
			estado: 'completada',
			duracion: 60
		}
	],
	'2': [
		{
			id: 'c4',
			fecha: '27/01/2024',
			hora: '09:00',
			tipo: 'seguimiento',
			estado: 'pendiente',
			duracion: 30
		}
	]
};

export const mockAntecedentes: Record<string, Antecedente[]> = {//esto se tiene que modificar, poniendo la info que se necesite
	//los datos tienen que coincidir con los que se pusieron en el archivo de "types/paciente.ts"
	'1': [
		{
			id: 'a1',
			tipo: 'medico',
			descripcion: 'Esguince de tobillo derecho',
			fecha: '15/06/2022'
		},
		{
			id: 'a2',
			tipo: 'alergias',
			descripcion: 'Alergia a la penicilina',
			fecha: '01/01/2020'
		},
		{
			id: 'a3',
			tipo: 'familiar',
			descripcion: 'Historial familiar de diabetes tipo 2',
			fecha: '01/01/2024'
		}
	],
	'2': [
		{
			id: 'a4',
			tipo: 'quirurgico',
			descripcion: 'Cirugía de ligamento cruzado anterior - rodilla derecha',
			fecha: '10/12/2023'
		},
		{
			id: 'a5',
			tipo: 'medico',
			descripcion: 'Hipertensión controlada con medicamento',
			fecha: '15/03/2020'
		}
	]
};

// Funciones helper para obtener datos
export const getPatientById = (id: string): Paciente | undefined => {
	return mockPatients.find(patient => patient.id === id);
};

export const getEjerciciosByPatientId = (patientId: string): Ejercicio[] => {
	return mockEjercicios[patientId] || [];
};

export const getCitasByPatientId = (patientId: string): Cita[] => {
	return mockCitas[patientId] || [];
};

export const getAntecedentesByPatientId = (patientId: string): Antecedente[] => {
	return mockAntecedentes[patientId] || [];
};