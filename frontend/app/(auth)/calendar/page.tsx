'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  date: number;
  month: number;
  year: number;
  color: string;
  textColor: string;
  description?: string;
  startTime?: string;
  endTime?: string;
}

// Interface más precisa para eventos de Google Calendar
interface GoogleCalendarEvent {
  id: string;
  summary?: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  // Agregar propiedades adicionales que pueda tener la respuesta
  [key: string]: any; // Para aceptar propiedades adicionales
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'Day' | 'Week' | 'Month'>('Month');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [gapiLoaded, setGapiLoaded] = useState<boolean>(false);
  const [gisLoaded, setGisLoaded] = useState<boolean>(false);

  // Modal states
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [editingEvent, setEditingEvent] = useState<string | null>(null);
  const [eventTitle, setEventTitle] = useState<string>('');
  const [eventDescription, setEventDescription] = useState<string>('');

  const eventColors = [
    { bg: 'bg-blue-200', text: 'text-blue-700', colorId: '1' },
    { bg: 'bg-pink-200', text: 'text-pink-700', colorId: '2' },
    { bg: 'bg-orange-200', text: 'text-orange-700', colorId: '3' },
    { bg: 'bg-purple-200', text: 'text-purple-700', colorId: '4' },
    { bg: 'bg-green-200', text: 'text-green-700', colorId: '5' },
    { bg: 'bg-yellow-200', text: 'text-yellow-700', colorId: '6' },
  ];

  // TUS CREDENCIALES REALES
  const CLIENT_ID = '348687061868-00hvvf76imh0qmhcc7eov9qklhicpu1a.apps.googleusercontent.com';
  const API_KEY = 'AIzaSyD2FZkoeASxpV1KPZn8PCiBcJvdaM8B0a8';
  const SCOPES = 'https://www.googleapis.com/auth/calendar';

  useEffect(() => {
    loadGoogleScripts();
  }, []);

  useEffect(() => {
    if (isSignedIn) {
      loadEvents();
    }
  }, [currentDate, isSignedIn]);

  const loadGoogleScripts = () => {
    // Primero verificar si ya están cargadas las bibliotecas
    if ((window as any).gapi && (window as any).google) {
      setGapiLoaded(true);
      setGisLoaded(true);
      initializeGapiClient();
      return;
    }

    // Cargar gapi
    const gapiScript = document.createElement('script');
    gapiScript.src = 'https://apis.google.com/js/api.js';
    gapiScript.async = true;
    gapiScript.defer = true;
    gapiScript.onload = () => {
      console.log('GAPI cargado');
      setGapiLoaded(true);
      // Ahora cargar gis
      loadGisScript();
    };
    gapiScript.onerror = (error) => {
      console.error('Error cargando GAPI:', error);
    };
    document.head.appendChild(gapiScript);
  };

  const loadGisScript = () => {
    const gisScript = document.createElement('script');
    gisScript.src = 'https://accounts.google.com/gsi/client';
    gisScript.async = true;
    gisScript.defer = true;
    gisScript.onload = () => {
      console.log('GIS cargado');
      setGisLoaded(true);
      initializeGapiClient();
    };
    gisScript.onerror = (error) => {
      console.error('Error cargando GIS:', error);
    };
    document.head.appendChild(gisScript);
  };

  const initializeGapiClient = async () => {
    try {
      await (window as any).gapi.load('client', async () => {
        try {
          await (window as any).gapi.client.init({
            apiKey: API_KEY,
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
          });
          console.log('GAPI client inicializado');
          checkAuthStatus();
        } catch (error) {
          console.error('Error inicializando gapi client:', error);
          alert('Error al inicializar Google Calendar. Verifica tu API_KEY.');
        }
      });
    } catch (error) {
      console.error('Error cargando gapi client:', error);
    }
  };

  const checkAuthStatus = () => {
    if (!gapiLoaded) return;
    
    try {
      const token = (window as any).gapi?.client?.getToken?.();
      const signedIn = !!token;
      setIsSignedIn(signedIn);
    } catch (error) {
      console.error('Error verificando estado de autenticación:', error);
      setIsSignedIn(false);
    }
  };

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      
      // Verificar que las bibliotecas estén cargadas
      if (!gapiLoaded || !gisLoaded) {
        alert('Las bibliotecas de Google no se han cargado correctamente. Intenta recargar la página.');
        setIsLoading(false);
        return;
      }

      // Verificar si ya estamos autenticados
      const existingToken = (window as any).gapi?.client?.getToken?.();
      if (existingToken) {
        setIsSignedIn(true);
        setIsLoading(false);
        loadEvents();
        return;
      }

      // Crear cliente de token OAuth
      const tokenClient = (window as any).google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (response: any) => {
          if (response.error) {
            console.error('Error de autenticación:', response);
            let errorMsg = 'Error al autenticar con Google. ';
            
            if (response.error === 'popup_closed_by_user') {
              errorMsg += 'La ventana fue cerrada antes de completar la autenticación.';
            } else if (response.error === 'access_denied') {
              errorMsg += 'Acceso denegado. Asegúrate de otorgar los permisos necesarios.';
            } else {
              errorMsg += `Código: ${response.error}`;
            }
            
            alert(errorMsg);
            setIsLoading(false);
            return;
          }
          
          // Guardar el token
          (window as any).gapi.client.setToken(response);
          setIsSignedIn(true);
          setIsLoading(false);
          alert('¡Autenticación exitosa! Ahora puedes usar Google Calendar.');
          loadEvents();
        },
      });

      tokenClient.requestAccessToken();
    } catch (error: any) {
      console.error('Error en autenticación:', error);
      setIsLoading(false);
      
      if (error.message?.includes('popup')) {
        alert('La ventana de autenticación fue cerrada. Intenta de nuevo.');
      } else if (error.message?.includes('not ready')) {
        alert('Google Calendar no está listo. Recarga la página.');
      } else {
        alert('Error inesperado al conectar con Google.');
      }
    }
  };

  const handleSignOut = async () => {
    try {
      const token = (window as any).gapi?.client?.getToken?.();
      if (token) {
        (window as any).google.accounts.oauth2.revoke(token.access_token, () => {
          console.log('Token revocado');
        });
        (window as any).gapi.client.setToken(null);
      }
      setIsSignedIn(false);
      setEvents([]);
      alert('Sesión cerrada correctamente');
    } catch (error) {
      console.error('Error cerrando sesión:', error);
      alert('Error al cerrar sesión');
    }
  };

  const loadEvents = async () => {
    if (!isSignedIn || !gapiLoaded) {
      console.log('No autenticado, omitiendo carga de eventos');
      return;
    }

    setIsLoading(true);
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();

      const timeMin = new Date(year, month, 1).toISOString();
      const timeMax = new Date(year, month + 1, 0, 23, 59, 59).toISOString();

      const response = await (window as any).gapi.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: timeMin,
        timeMax: timeMax,
        showDeleted: false,
        singleEvents: true,
        maxResults: 100,
        orderBy: 'startTime'
      });

      const googleEvents = response.result.items || [];

      const calendarEvents: CalendarEvent[] = googleEvents.map(
        (event: any, idx: number) => {
          const startDate = new Date(event.start?.dateTime || event.start?.date || Date.now());
          const randomColor = eventColors[idx % eventColors.length];

          return {
            id: event.id || `event-${idx}`,
            title: event.summary || 'Sin título',
            date: startDate.getDate(),
            month: startDate.getMonth(),
            year: startDate.getFullYear(),
            color: randomColor.bg,
            textColor: randomColor.text,
            description: event.description,
            startTime: event.start?.dateTime,
            endTime: event.end?.dateTime,
          };
        }
      );

      setEvents(calendarEvents);
    } catch (error) {
      console.error('Error loading events:', error);
      alert('Error al cargar eventos de Google Calendar');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDayClick = (day: number) => {
    if (!isSignedIn) {
      alert('Por favor inicia sesión con Google primero');
      return;
    }
    setSelectedDay(day);
    setShowModal(true);
    setEventTitle('');
    setEventDescription('');
    setEditingEvent(null);
  };

  const handleAddEvent = async () => {
    if (!eventTitle.trim() || !selectedDay) return;

    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();

      const startDateTime = new Date(year, month, selectedDay, 9, 0);
      const endDateTime = new Date(year, month, selectedDay, 10, 0);

      await (window as any).gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: {
          summary: eventTitle.trim(),
          description: eventDescription.trim(),
          start: {
            dateTime: startDateTime.toISOString(),
            timeZone: 'America/Mexico_City'
          },
          end: {
            dateTime: endDateTime.toISOString(),
            timeZone: 'America/Mexico_City'
          }
        }
      });

      setEventTitle('');
      setEventDescription('');
      setShowModal(false);
      loadEvents();
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Error al crear el evento');
    }
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event.id);
    setEventTitle(event.title);
    setEventDescription(event.description || '');
    setSelectedDay(event.date);
    setShowModal(true);
  };

  const handleUpdateEvent = async () => {
    if (!eventTitle.trim() || !editingEvent) return;

    try {
      await (window as any).gapi.client.calendar.events.update({
        calendarId: 'primary',
        eventId: editingEvent,
        resource: {
          summary: eventTitle.trim(),
          description: eventDescription.trim(),
        }
      });

      setEventTitle('');
      setEventDescription('');
      setEditingEvent(null);
      setShowModal(false);
      loadEvents();
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Error al actualizar el evento');
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('¿Estás seguro de eliminar este evento?')) return;

    try {
      await (window as any).gapi.client.calendar.events.delete({
        calendarId: 'primary',
        eventId: eventId
      });
      loadEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Error al eliminar el evento');
    }
  };

  const getDaysInMonth = (date: Date): { daysInMonth: number; startingDayOfWeek: number } => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

  const monthNames: string[] = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  const dayNames: string[] = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];

  const previousMonth = (): void => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = (): void => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = (): void => {
    setCurrentDate(new Date());
  };

  const renderCalendarDays = (): React.ReactElement[] => {
    const days: React.ReactElement[] = [];
    const prevMonthDays = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    const prevMonthLastDay = prevMonth.getDate();

    for (let i = prevMonthDays; i > 0; i--) {
      days.push(
        <div key={`prev-${i}`} className="min-h-24 border border-gray-100 bg-gray-50 p-2 opacity-60">
          <span className="text-sm text-gray-400">{prevMonthLastDay - i + 1}</span>
        </div>
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = events.filter(
        (e) =>
          e.date === day &&
          e.month === currentDate.getMonth() &&
          e.year === currentDate.getFullYear()
      );

      const isToday =
        day === new Date().getDate() &&
        currentDate.getMonth() === new Date().getMonth() &&
        currentDate.getFullYear() === new Date().getFullYear();

      days.push(
        <div
          key={day}
          className={`min-h-24 border border-gray-100 bg-white p-2 relative hover:bg-blue-50 transition-colors cursor-pointer group ${
            isToday ? 'bg-blue-50 border-blue-400' : ''
          }`}
          onClick={() => handleDayClick(day)}
        >
          <div className="flex justify-between items-start">
            <span
              className={`text-sm font-medium ${
                isToday ? 'text-blue-700 font-bold' : 'text-gray-700'
              }`}
            >
              {day}
            </span>
            {isSignedIn && (
              <Plus size={14} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </div>
          <div className="mt-1 space-y-1">
            {dayEvents.map((event) => (
              <div
                key={event.id}
                className={`${event.color} ${event.textColor} text-xs px-2 py-1 rounded text-left font-medium flex items-center justify-between group/event hover:shadow-md transition-shadow`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditEvent(event);
                }}
              >
                <span className="truncate flex-1">{event.title}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteEvent(event.id);
                  }}
                  className="ml-1 opacity-0 group-hover/event:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    }

    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push(
        <div key={`next-${day}`} className="min-h-24 border border-gray-100 bg-gray-50 p-2 opacity-60">
          <span className="text-sm text-gray-400">{day}</span>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="p-8">
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {editingEvent ? 'Editar Evento' : 'Nuevo Evento'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Día seleccionado: {selectedDay}
              </label>
              <input
                type="text"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder="Título del evento"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                autoFocus
              />
              <textarea
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                placeholder="Descripción (opcional)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={editingEvent ? handleUpdateEvent : handleAddEvent}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                {editingEvent ? 'Actualizar' : 'Agregar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Calendario</h1>
        <div>
          {!isSignedIn ? (
            <button
              onClick={handleSignIn}
              disabled={isLoading || !gapiLoaded || !gisLoaded}
              className="px-6 py-2 bg-[#337790] text-white rounded-lg hover:bg-[#2a6175] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Conectando...' : 'Iniciar sesión con Google'}
            </button>
          ) : (
            <button
              onClick={handleSignOut}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Cerrar sesión
            </button>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="text-center py-4 text-gray-600">
          Cargando eventos de Google Calendar...
        </div>
      )}

      {!gapiLoaded || !gisLoaded ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800 text-center">
            Cargando bibliotecas de Google... Esto puede tomar unos segundos.
          </p>
        </div>
      ) : !isSignedIn ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800 text-center">
            Inicia sesión con Google para ver y gestionar tus eventos del calendario
          </p>
        </div>
      ) : null}

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={goToToday}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            Hoy
          </button>

          <div className="flex items-center gap-4">
            <button onClick={previousMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            <h2 className="text-xl font-semibold text-gray-800 min-w-48 text-center">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronRight size={20} className="text-gray-600" />
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('Month')}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                viewMode === 'Month' ? 'bg-[#337790] text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Mes
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-0 border-t border-l border-gray-200">
          {dayNames.map((day) => (
            <div key={day} className="bg-gray-50 border-r border-b border-gray-200 p-3 text-center">
              <span className="text-xs font-semibold text-gray-600">{day}</span>
            </div>
          ))}
          {renderCalendarDays()}
        </div>
      </div>
    </div>
  );
}