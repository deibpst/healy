'use client'; 
import React, { useState, useEffect } from 'react'; 
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

// Importaciones confirmadas por ti:
import Header from '../(auth)/components/layout/header';
import Sidebar from '../(auth)/components/layout/sidebar';

interface Event {
    title: string;
    date: number;
    color: string;
    textColor: string;
    span?: number;
}

export default function Calendar() { 
    
    // =======================================================
    // 1. FIX DE HIDRATACIÓN (CRUCIAL)
    // =======================================================
    const [isMounted, setIsMounted] = useState(false);
    
    useEffect(() => {
        // Se ejecuta solo en el lado del cliente (navegador)
        setIsMounted(true);
    }, []);
    // =======================================================


    const [sidebarOpen, setSidebarOpen] = useState<boolean>(true); //
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen); //

    const [currentDate, setCurrentDate] = useState<Date>(new Date(2025, 9, 1)); //
    const [viewMode, setViewMode] = useState<'Day' | 'Week' | 'Month'>('Month'); //

    const events: Event[] = []; // 

    
    
    const getDaysInMonth = (date: Date): { daysInMonth: number; startingDayOfWeek: number } => {
        const year = date.getFullYear(); //
        const month = date.getMonth(); //
        const firstDay = new Date(year, month, 1); //
        const lastDay = new Date(year, month + 1, 0); //
        const daysInMonth = lastDay.getDate(); //
        const startingDayOfWeek = firstDay.getDay(); //
        return { daysInMonth, startingDayOfWeek }; //
    };

    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate); //
    
    const monthNames: string[] = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ]; //

    const dayNames: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']; //

    const previousMonth = (): void => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    }; //

    const nextMonth = (): void => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    }; //

    const goToToday = (): void => {
        setCurrentDate(new Date());
    }; //

    const renderCalendarDays = (): React.ReactElement[] => {
        const days: React.ReactElement[] = []; //
        const prevMonthDays = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1; //
        const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0); //
        const prevMonthLastDay = prevMonth.getDate(); //

        for (let i = prevMonthDays; i > 0; i--) { //
            days.push(
                <div key={`prev-${i}`} className="min-h-24 border border-gray-100 bg-gray-50 p-2 opacity-60">
                    <span className="text-sm text-gray-400">{prevMonthLastDay - i + 1}</span>
                </div>
            );
        }

        for (let day = 1; day <= daysInMonth; day++) { //
            const dayEvents = events.filter(e => e.date === day); //
            
            const isToday = 
                day === new Date().getDate() &&
                currentDate.getMonth() === new Date().getMonth() &&
                currentDate.getFullYear() === new Date().getFullYear(); //
            
            days.push(
                <div key={day} className={`min-h-24 border border-gray-100 bg-white p-2 relative hover:bg-gray-50 transition-colors ${isToday ? 'bg-blue-50 border-blue-400' : ''}`}>
                    <span className={`text-sm font-medium ${isToday ? 'text-blue-700 font-bold' : 'text-gray-700'}`}>{day}</span>
                    <div className="mt-1 space-y-1">
                        {dayEvents.map((event, idx) => (
                            <div
                                key={idx}
                                className={`${event.color} ${event.textColor} text-xs px-2 py-1 rounded text-left font-medium ${
                                    event.span ? 'col-span-' + event.span : ''
                                }`}
                                style={event.span ? { gridColumn: `span ${event.span}` } : {}}
                            >
                                {event.title}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        const remainingDays = 42 - days.length; //
        for (let day = 1; day <= remainingDays; day++) { //
            days.push(
                <div key={`next-${day}`} className="min-h-24 border border-gray-100 bg-gray-50 p-2 opacity-60">
                    <span className="text-sm text-gray-400">{day}</span>
                </div>
            );
        }

        return days; //
    };

    // =======================================================
    // 2. CHEQUEO DE MONTAJE: Si no está montado, retorna null
    // =======================================================
    if (!isMounted) {
        return null;
    }


    return (
        <div className="flex h-screen bg-gray-50">
            
            <Sidebar isOpen={sidebarOpen} />

            <div className="flex-1 overflow-auto">
                
                <Header onMenuClick={toggleSidebar} />

                <div className="p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-8">Calendario</h1>

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
                                        viewMode === 'Month' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    Mes
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-7 gap-0 border-t border-l border-gray-200">
                            {dayNames.map(day => (
                                <div key={day} className="bg-gray-50 border-r border-b border-gray-200 p-3 text-center">
                                    <span className="text-xs font-semibold text-gray-600">{day}</span>
                                </div>
                            ))}
                            {renderCalendarDays()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
