import { Activity, Calendar, TrendingUp, Clock, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
import { Badge } from "../../components/ui/badge";
import ExerciseCard from "./ExerciseCard";
import NextAppointment from "./NextAppointment";
import ProgressStats from "./ProgressStats";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent via-background to-accent/50">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                <Activity className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Mi Rehabilitación</h1>
                <p className="text-sm text-muted-foreground">Panel del Paciente</p>
              </div>
            </div>
            <Badge variant="secondary" className="gap-2">
              <Clock className="h-4 w-4" />
              {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' })}
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Resumen rápido */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Completados Hoy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{completedToday}/{totalExercises}</div>
              <Progress value={completionRate} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">{completionRate}% del objetivo diario</p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Racha Actual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">7 días</div>
              <p className="text-xs text-muted-foreground mt-2">¡Sigue así! Tu constancia es excelente</p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Tiempo Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">2.5 hrs</div>
              <p className="text-xs text-muted-foreground mt-2">Esta semana</p>
            </CardContent>
          </Card>
        </div>

        {/* Próxima Cita */}
        <NextAppointment />

        {/* Estadísticas de Progreso */}
        <ProgressStats />

        {/* Lista de Ejercicios */}
        <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-foreground">Mis Ejercicios</CardTitle>
            <CardDescription className="text-muted-foreground">
              Ejercicios asignados por tu fisioterapeuta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {exercises.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PatientDashboard;
