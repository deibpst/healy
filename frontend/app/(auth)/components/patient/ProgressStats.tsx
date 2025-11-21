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
    <div className="p-6 space-y-8">
      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          className="p-6 rounded-xl border shadow-sm hover:shadow-md transition-all duration-300"
          style={{ 
            background: 'linear-gradient(135deg, rgba(46, 116, 143, 0.1), rgba(46, 116, 143, 0.05))',
            borderColor: 'rgba(46, 116, 143, 0.3)'
          }}
        >
          <div className="flex items-center gap-4">
            <div 
              className="h-14 w-14 rounded-full flex items-center justify-center shadow-sm"
              style={{ backgroundColor: 'rgba(46, 116, 143, 0.2)' }}
            >
              <Target className="h-6 w-6" style={{ color: '#2E748F' }} />
            </div>
            <div>
              <p className="text-3xl font-bold" style={{ color: '#2E748F' }}>
                {adherenceRate}%
              </p>
              <p className="text-sm font-medium" style={{ color: '#2E748F', opacity: 0.7 }}>
                Adherencia Semanal
              </p>
            </div>
          </div>
        </div>

        <div 
          className="p-6 rounded-xl border shadow-sm hover:shadow-md transition-all duration-300"
          style={{ 
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.05))',
            borderColor: 'rgba(34, 197, 94, 0.3)'
          }}
        >
          <div className="flex items-center gap-4">
            <div 
              className="h-14 w-14 rounded-full flex items-center justify-center shadow-sm"
              style={{ backgroundColor: 'rgba(34, 197, 94, 0.2)' }}
            >
              <Award className="h-6 w-6" style={{ color: '#22c55e' }} />
            </div>
            <div>
              <p className="text-3xl font-bold" style={{ color: '#22c55e' }}>
                {totalCompleted}
              </p>
              <p className="text-sm font-medium" style={{ color: '#22c55e', opacity: 0.7 }}>
                Ejercicios Completados
              </p>
            </div>
          </div>
        </div>

        <div 
          className="p-6 rounded-xl border shadow-sm hover:shadow-md transition-all duration-300"
          style={{ 
            background: 'linear-gradient(135deg, rgba(19, 152, 214, 0.1), rgba(19, 152, 214, 0.05))',
            borderColor: 'rgba(19, 152, 214, 0.3)'
          }}
        >
          <div className="flex items-center gap-4">
            <div 
              className="h-14 w-14 rounded-full flex items-center justify-center shadow-sm"
              style={{ backgroundColor: 'rgba(19, 152, 214, 0.2)' }}
            >
              <CalendarIcon className="h-6 w-6" style={{ color: '#1398D6' }} />
            </div>
            <div>
              <p className="text-3xl font-bold" style={{ color: '#1398D6' }}>
                21
              </p>
              <p className="text-sm font-medium" style={{ color: '#1398D6', opacity: 0.7 }}>
                Días en Tratamiento
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico de barras semanal */}
      <div 
        className="p-6 rounded-xl border shadow-sm"
        style={{ 
          background: 'rgba(255, 255, 255, 0.8)',
          borderColor: 'rgba(46, 116, 143, 0.2)'
        }}
      >
        <h4 className="text-lg font-semibold mb-6" style={{ color: '#2E748F' }}>
          Actividad de la Semana
        </h4>
        <div className="flex items-end justify-between gap-3 h-48 px-2">
          {weeklyData.map((day, index) => {
            const percentage = (day.completed / day.total) * 100;
            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-3">
                <div className="w-full bg-gray-200 rounded-t-lg relative overflow-hidden h-full flex items-end shadow-inner">
                  <div
                    className="w-full rounded-t-lg transition-all duration-500 shadow-sm"
                    style={{ 
                      height: `${percentage}%`,
                      backgroundColor: percentage === 100 
                        ? '#22c55e' 
                        : percentage >= 75 
                        ? '#2E748F' 
                        : percentage >= 50 
                        ? '#f59e0b' 
                        : '#ef4444'
                    }}
                  />
                </div>
                <div className="text-center">
                  <span className="text-sm font-semibold block" style={{ color: '#2E748F' }}>
                    {day.day}
                  </span>
                  <span className="text-xs mt-1 block" style={{ color: '#2E748F', opacity: 0.7 }}>
                    {day.completed}/{day.total}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tiempo dedicado */}
      <div 
        className="p-6 rounded-xl border shadow-sm"
        style={{ 
          background: 'rgba(255, 255, 255, 0.8)',
          borderColor: 'rgba(46, 116, 143, 0.2)'
        }}
      >
        <h4 className="text-lg font-semibold mb-6" style={{ color: '#2E748F' }}>
          Tiempo Dedicado Esta Semana
        </h4>
        
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium" style={{ color: '#2E748F', opacity: 0.8 }}>
                Lunes - Miércoles
              </span>
              <span className="text-sm font-bold" style={{ color: '#2E748F' }}>
                45 min
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
              <div 
                className="h-3 rounded-full transition-all duration-500 shadow-sm"
                style={{ 
                  width: '75%',
                  background: 'linear-gradient(90deg, #2E748F, #1398D6)'
                }}
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium" style={{ color: '#2E748F', opacity: 0.8 }}>
                Jueves - Sábado
              </span>
              <span className="text-sm font-bold" style={{ color: '#2E748F' }}>
                1 hr 15 min
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
              <div 
                className="h-3 rounded-full transition-all duration-500 shadow-sm"
                style={{ 
                  width: '90%',
                  background: 'linear-gradient(90deg, #2E748F, #1398D6)'
                }}
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium" style={{ color: '#2E748F', opacity: 0.8 }}>
                Domingo
              </span>
              <span className="text-sm font-bold" style={{ color: '#2E748F' }}>
                30 min
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
              <div 
                className="h-3 rounded-full transition-all duration-500 shadow-sm"
                style={{ 
                  width: '50%',
                  background: 'linear-gradient(90deg, #2E748F, #1398D6)'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressStats;