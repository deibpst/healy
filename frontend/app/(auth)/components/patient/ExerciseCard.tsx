import { Repeat, Layers, CheckCircle2, Circle, Clock } from "lucide-react";
import { Button } from "../../components/ui/button";
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
    <div 
      className="rounded-lg border p-5 transition-all duration-200 hover:shadow-md"
      style={{
        background: exercise.completed 
          ? 'rgba(248, 250, 252, 0.95)' 
          : 'rgba(255, 255, 255, 0.95)',
        borderColor: exercise.completed 
          ? 'rgba(46, 116, 143, 0.4)' 
          : 'rgba(46, 116, 143, 0.2)',
        borderWidth: exercise.completed ? '2px' : '1px'
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div 
              className="h-6 w-6 rounded-full flex items-center justify-center"
              style={{ 
                backgroundColor: exercise.completed ? '#2E748F' : 'transparent',
                border: exercise.completed ? 'none' : '2px solid #2E748F'
              }}
            >
              {exercise.completed ? (
  <CheckCircle2 className="h-4 w-4" style={{ color: 'white' }} />
) : (
  <Circle className="h-3 w-3" style={{ color: '#2E748F' }} />
)}
            </div>
            <h3 
              className="font-semibold text-base"
              style={{ 
                color: '#2E748F',
                opacity: exercise.completed ? 0.7 : 1,
                textDecoration: exercise.completed ? 'line-through' : 'none'
              }}
            >
              {exercise.name}
            </h3>
          </div>
          
          {/* Descripción */}
          <p 
            className="text-sm pl-9"
            style={{ 
              color: '#2E748F', 
              opacity: exercise.completed ? 0.6 : 0.8 
            }}
          >
            {exercise.description}
          </p>

          {/* Info de ejercicio */}
          <div className="flex items-center gap-4 pl-9 text-xs">
            <span style={{ color: '#2E748F', opacity: 0.7 }}>
              <strong>{exercise.series}</strong> series
            </span>
            <span style={{ color: '#1398D6', opacity: 0.7 }}>
              <strong>{exercise.repetitions}</strong> repeticiones
            </span>
            <span style={{ color: '#64748b', opacity: 0.6 }}>
              {exercise.lastCompleted}
            </span>
          </div>
        </div>

        {/* Botones */}
        <div className="flex flex-col gap-2">
          {exercise.completed ? (
            <Badge 
              className="text-xs px-2 py-1"
              style={{ 
                backgroundColor: 'rgba(46, 116, 143, 0.1)',
                color: '#2E748F',
                border: '1px solid rgba(46, 116, 143, 0.2)'
              }}
            >
              Completado
            </Badge>
          ) : (
            <Button 
              size="sm" 
              className="text-xs px-3 py-1"
              style={{ 
                backgroundColor: '#2E748F',
                color: 'white'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1398D6'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2E748F'}
            >
              Completar
            </Button>
          )}
          
          <Button 
            size="sm" 
            variant="ghost"
            className="text-xs px-2 py-1 h-auto"
            style={{ color: '#64748b' }}
          >
            Ver más
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExerciseCard;