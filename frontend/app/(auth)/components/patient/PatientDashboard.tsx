'use client';

import { Activity, Calendar, TrendingUp, Clock, CheckCircle2, LogOut, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
import { Badge } from "../../components/ui/badge";
import ExerciseCard from "./ExerciseCard";
import NextAppointment from "./NextAppointment";
import ProgressStats from "./ProgressStats";
import { Button } from "../../components/ui/button";
import { useRouter } from "next/navigation";

// Datos de ejemplo - estos vendrían de tu backend
const exercises = [
  {
    id: 1,
    name: "Extensión de rodilla",
    description: "Sentado, extiende la rodilla hasta que la pierna quede recta",
    series: 3,
    repetitions: 15,
    completed: true,
    lastCompleted: "Hace 2 horas"
  },
  {
    id: 2,
    name: "Elevación de pierna recta", 
    description: "Acostado boca arriba, eleva la pierna recta hasta 45 grados",
    series: 3,
    repetitions: 12,
    completed: false,
    lastCompleted: "Hace 1 día"
  },
  {
    id: 3,
    name: "Flexión plantar",
    description: "De pie, elévate sobre las puntas de los pies",
    series: 2,
    repetitions: 20,
    completed: false,
    lastCompleted: "Hace 2 días"
  },
  {
    id: 4,
    name: "Estiramiento de isquiotibiales",
    description: "Sentado con piernas extendidas, inclínate hacia adelante",
    series: 2,
    repetitions: 10,
    completed: true,
    lastCompleted: "Hace 3 horas"
  }
];

const PatientDashboard = () => {
  const completedToday = exercises.filter(e => e.completed).length;
  const totalExercises = exercises.length;
  const completionRate = Math.round((completedToday / totalExercises) * 100);
  const router = useRouter();

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #2E748F 0%, #1398D6 50%, #ffffff 100%)' }}>
      {/* Header */}
      <header className="border-b bg-white/90 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: '#2E748F' }}>
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold" style={{ color: '#2E748F' }}>Mi Rehabilitación</h1>
                <p className="text-sm text-gray-600">Panel del Paciente</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 border-gray-300 hover:text-white transition-colors shadow-md"
                style={{ 
                  borderColor: '#2E748F', 
                  color: '#2E748F',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2E748F'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                onClick={() => {
                  router.push('/editProfile');
                }}
              >
                <User className="h-4 w-4" />
                Editar Perfil
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 border-red-300 text-red-600 hover:bg-red-600 hover:text-white transition-colors shadow-md"
                onClick={() => {
                  window.location.href = '/login';
                }}
              >
                <LogOut className="h-4 w-4" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Resumen rápido */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="pb-3" style={{ borderBottom: '1px solid #2E748F' }}>
              <CardTitle className="text-sm font-medium flex items-center gap-2" style={{ color: '#2E748F' }}>
                <CheckCircle2 className="h-5 w-5" style={{ color: '#1398D6' }} />
                Completados Hoy
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-4xl font-bold" style={{ 
                background: 'linear-gradient(135deg, #2E748F, #1398D6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {completedToday}/{totalExercises}
              </div>
              <Progress 
                value={completionRate} 
                className="mt-3 h-3" 
                style={{ backgroundColor: '#f0f9ff' }}
              />
              <p className="text-xs mt-2 font-medium" style={{ color: '#2E748F' }}>
                {completionRate}% del objetivo diario
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="pb-3" style={{ borderBottom: '1px solid #2E748F' }}>
              <CardTitle className="text-sm font-medium flex items-center gap-2" style={{ color: '#2E748F' }}>
                <TrendingUp className="h-5 w-5" style={{ color: '#1398D6' }} />
                Racha Actual
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-4xl font-bold" style={{ 
                background: 'linear-gradient(135deg, #1398D6, #2E748F)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                7 días
              </div>
              <p className="text-xs mt-2 font-medium" style={{ color: '#2E748F' }}>
                ¡Sigue así! Tu constancia es excelente
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="pb-3" style={{ borderBottom: '1px solid #2E748F' }}>
              <CardTitle className="text-sm font-medium flex items-center gap-2" style={{ color: '#2E748F' }}>
                <Calendar className="h-5 w-5" style={{ color: '#1398D6' }} />
                Tiempo Total
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-4xl font-bold" style={{ 
                background: 'linear-gradient(135deg, #2E748F, #1398D6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                2.5 hrs
              </div>
              <p className="text-xs mt-2 font-medium" style={{ color: '#2E748F' }}>
                Esta semana
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Próxima Cita */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(46, 116, 143, 0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <NextAppointment />
        </div>

        {/* Estadísticas de Progreso */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(46, 116, 143, 0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <ProgressStats />
        </div>

        {/* Lista de Ejercicios */}
        <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-0">
          <CardHeader style={{ 
            background: 'linear-gradient(135deg, rgba(46, 116, 143, 0.05), rgba(19, 152, 214, 0.05))',
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px',
            borderBottom: '2px solid #2E748F'
          }}>
            <CardTitle className="text-xl" style={{ color: '#2E748F' }}>
              Mis Ejercicios
            </CardTitle>
            <CardDescription style={{ color: '#2E748F', opacity: 0.8 }}>
              Ejercicios asignados por tu fisioterapeuta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {exercises.map((exercise, index) => (
              <div 
                key={exercise.id}
                style={{ 
                  animation: `slideUp 0.5s ease-out ${index * 0.1}s both`
                }}
              >
                <ExerciseCard exercise={exercise} />
              </div>
            ))}
          </CardContent>
        </Card>
      </main>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default PatientDashboard;