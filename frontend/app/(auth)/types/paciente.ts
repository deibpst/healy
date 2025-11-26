// este archivo se mantiene incluso cuando ya se tenga la base, esto para
// mantener la estructura de los datos
//ejemplo de implementacion con back: 
// // Antes (con mock)
//const patient = getPatientById('1');

// Después (con API real) - MISMAS INTERFACES
//const response = await fetch('/api/patients/1');
//const patient: Patient = await response.json(); 

export interface Paciente {
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
	avatar?: string;
}

export interface Ejercicio {
	id: string;
	nombre: string;
	fecha: string;
	completado: boolean;
}

export interface Cita {//esto se tiene que modificar, poniendo la info que se necesite
	//los datos que están aqui solo son para ejemplificarlo
	id: string;
	fecha: string;
	hora: string;
	tipo: 'evaluacion' | 'seguimiento' | 'tratamiento';
	estado: 'pendiente' | 'completada' | 'cancelada';
	notas?: string;
	duracion: number; // en minutos
}

export interface Antecedente {//esto se tiene que modificar, poniendo la info que se necesite
	//los datos que están aqui solo son para ejemplificarlo
	id: string;
	tipo: 'medico' | 'quirurgico' | 'familiar' | 'alergias';
	descripcion: string;
	fecha: string;
}