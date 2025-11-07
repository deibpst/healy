import { Repeat, Layers, CheckCircle2, Circle, Clock } from "lucide-react";
import { Button } from "../../components/ui/button";  // Actualizada esta línea
import { Badge } from "../../components/ui/badge";

interface Exercise {
  id: number;
  name: string;
  description: string;
  series: number;
  repetitions: number;
  completed: boolean;
  lastCompleted: string;
}

interface ExerciseCardProps {
  exercise: Exercise;
}

const ExerciseCard = ({ exercise }: ExerciseCardProps) => {
  return (
    <div className={`rounded-lg border p-4 transition-all hover:shadow-md ${
      exercise.completed 
        ? 'bg-accent border-success/30' 
        : 'bg-card border-border'
    }`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            {exercise.completed ? (
              <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            )}
            <h3 className="font-semibold text-foreground">{exercise.name}</h3>
          </div>
          
          <p className="text-sm text-muted-foreground pl-7">
            {exercise.description}
          </p>

          <div className="flex items-center gap-4 pl-7 pt-2">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                {exercise.series} series
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Repeat className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                {exercise.repetitions} repeticiones
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 pl-7">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              Última vez: {exercise.lastCompleted}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {exercise.completed ? (
            <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
              Completado
            </Badge>
          ) : (
            <Button size="sm" className="whitespace-nowrap">
              Marcar Completo
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExerciseCard;
