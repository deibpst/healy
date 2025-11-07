import { TrendingUp, Target, Award, Calendar as CalendarIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";

const ProgressStats = () => {
  const weeklyData = [
    { day: "Lun", completed: 4, total: 4 },
    { day: "Mar", completed: 4, total: 4 },
    { day: "Mié", completed: 3, total: 4 },
    { day: "Jue", completed: 4, total: 4 },
    { day: "Vie", completed: 4, total: 4 },
    { day: "Sáb", completed: 3, total: 4 },
    { day: "Dom", completed: 2, total: 4 },
  ];

  const totalCompleted = weeklyData.reduce((acc, day) => acc + day.completed, 0);
  const totalExercises = weeklyData.reduce((acc, day) => acc + day.total, 0);
  const adherenceRate = Math.round((totalCompleted / totalExercises) * 100);

  return (
    <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <TrendingUp className="h-5 w-5 text-primary" />
          Mi Progreso
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Seguimiento de tu adherencia al tratamiento
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Estadísticas principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{adherenceRate}%</p>
                <p className="text-xs text-muted-foreground">Adherencia Semanal</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-gradient-to-br from-success/10 to-success/5 border border-success/20">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-success/20 flex items-center justify-center">
                <Award className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalCompleted}</p>
                <p className="text-xs text-muted-foreground">Ejercicios Completados</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-gradient-to-br from-accent to-accent/50 border border-border">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <CalendarIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">21</p>
                <p className="text-xs text-muted-foreground">Días en Tratamiento</p>
              </div>
            </div>
          </div>
        </div>

        {/* Gráfico de barras semanal */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-4">Actividad de la Semana</h4>
          <div className="flex items-end justify-between gap-2 h-40">
            {weeklyData.map((day, index) => {
              const percentage = (day.completed / day.total) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-muted rounded-t-lg relative overflow-hidden h-full flex items-end">
                    <div
                      className={`w-full rounded-t-lg transition-all ${
                        percentage === 100
                          ? 'bg-success'
                          : percentage >= 75
                          ? 'bg-primary'
                          : percentage >= 50
                          ? 'bg-warning'
                          : 'bg-destructive'
                      }`}
                      style={{ height: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">{day.day}</span>
                  <span className="text-xs text-muted-foreground">{day.completed}/{day.total}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tiempo dedicado */}
        <div className="space-y-3 pt-4 border-t">
          <h4 className="text-sm font-medium text-foreground">Tiempo Dedicado Esta Semana</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Lunes - Miércoles</span>
              <span className="font-semibold text-foreground">45 min</span>
            </div>
            <Progress value={75} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Jueves - Sábado</span>
              <span className="font-semibold text-foreground">1 hr 15 min</span>
            </div>
            <Progress value={90} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Domingo</span>
              <span className="font-semibold text-foreground">30 min</span>
            </div>
            <Progress value={50} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressStats;
