import { Calendar, MapPin, User, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { GoogleCalendarService, AppointmentData } from "./GoogleAppointment";
import { useEffect, useState } from "react";

const NextAppointment = () => {
  const [appointment, setAppointment] = useState<AppointmentData | null>(null);

  useEffect(() => {
    // Cargar datos de la cita
    const appointmentData = GoogleCalendarService.getAppointmentData();
    setAppointment(appointmentData);
  }, []);

  const handleAddToCalendar = () => {
    if (appointment) {
      GoogleCalendarService.addToCalendar(appointment);
    }
  };

  if (!appointment) {
    return (
      <Card className="auth-card">
        <CardContent className="flex items-center justify-center h-32">
          <p>Cargando cita...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="auth-card border-primary bg-gradient-to-r from-primary/5 to-primary/10 border-primary/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Bell className="h-5 w-5 text-primary animate-pulse" />
            Próxima Cita
          </CardTitle>
          <Badge className="bg-primary text-primary-foreground">
            En 2 días
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-card rounded-lg">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Fecha y Hora</p>
              <p className="font-semibold text-foreground">Viernes, 15 Dic 2025</p>
              <p className="text-sm text-muted-foreground">{appointment.startTime} - {appointment.endTime}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-card rounded-lg">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Fisioterapeuta</p>
              <p className="font-semibold text-foreground">{appointment.doctor}</p>
              <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-card rounded-lg">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Ubicación</p>
            <p className="font-semibold text-foreground">Clínica FisioSalud</p>
            <p className="text-sm text-muted-foreground">Av. Principal #123, Col. Centro, CDMX</p>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button 
            className="flex-1"
            onClick={handleAddToCalendar}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Agregar a Calendario
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NextAppointment;