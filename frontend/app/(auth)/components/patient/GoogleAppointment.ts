export interface AppointmentData {
  title: string;
  date: string;        // Formato: YYYY-MM-DD
  startTime: string;   // Formato: HH:mm
  endTime: string;     // Formato: HH:mm
  doctor: string;
  specialty?: string;
  location: string;
  details: string;
  timezone?: string;   // Por defecto será México
}

export class GoogleCalendarService {
  private static readonly BASE_URL = 'https://calendar.google.com/calendar/render';
  private static readonly DEFAULT_TIMEZONE = '-06:00'; // México (CST)

  /**
   * Convierte fecha y hora a formato UTC para Google Calendar
   */
  private static formatDateForGoogle(date: Date): string {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  }

  /**
   * Genera la URL completa para agregar evento a Google Calendar
   */
  public static generateCalendarURL(appointment: AppointmentData): string {
    const { title, date, startTime, endTime, location, details, timezone = this.DEFAULT_TIMEZONE } = appointment;
    
    // Crear objetos Date con zona horaria
    const startDateTime = new Date(`${date}T${startTime}:00${timezone}`);
    const endDateTime = new Date(`${date}T${endTime}:00${timezone}`);
    
    // Validar fechas
    if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
      throw new Error('Fechas inválidas proporcionadas');
    }
    
    if (startDateTime >= endDateTime) {
      throw new Error('La fecha de inicio debe ser anterior a la fecha de fin');
    }
    
    // Formatear para Google Calendar
    const startFormatted = this.formatDateForGoogle(startDateTime);
    const endFormatted = this.formatDateForGoogle(endDateTime);
    
    // Construir parámetros
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: title,
      dates: `${startFormatted}/${endFormatted}`,
      details: details,
      location: location
    });
    
    return `${this.BASE_URL}?${params.toString()}`;
  }

  /**
   * Abre Google Calendar en nueva ventana con el evento precargado
   */
  public static addToCalendar(appointment: AppointmentData): void {
    try {
      const calendarURL = this.generateCalendarURL(appointment);
      window.open(calendarURL, '_blank');
    } catch (error) {
      console.error('Error al abrir Google Calendar:', error);
      alert('Error al generar el enlace del calendario. Verifica los datos de la cita.');
    }
  }

  /**
   * Obtiene datos de cita desde la base de datos (futuro)
   * Por ahora retorna datos estáticos
   */
  public static getAppointmentData(appointmentId?: string): AppointmentData {
    // TODO: Aquí irá la llamada a la API cuando esté lista
    // const response = await fetch(`/api/appointments/${appointmentId}`);
    // return await response.json();
    
    // Datos estáticos por ahora
    return {
      title: "Cita de Fisioterapia - Dr. María González",
      date: "2025-12-15",
      startTime: "10:00",
      endTime: "11:00",
      doctor: "Dr. María González",
      specialty: "Especialista en Rehabilitación",
      location: "Clínica FisioSalud, Av. Principal #123, Col. Centro, CDMX",
      details: "Cita de seguimiento de rehabilitación. Traer estudios médicos y ropa cómoda para ejercicios."
    };
  }
}