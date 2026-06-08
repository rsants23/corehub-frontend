import { Clock, Pencil, Trash2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AppointmentStatusBadge } from "@/components/shared/status-badge";
import { formatDayOfWeek, formatTime } from "@/utils/format";
import type { Appointment, AppointmentStatus } from "@/types";

interface AppointmentsListProps {
  appointments: Appointment[];
  onEdit?: (appointment: Appointment) => void;
  onRemove?: (appointment: Appointment) => void;
}

export function AppointmentsList({
  appointments,
  onEdit,
  onRemove,
}: AppointmentsListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {appointments.map((appointment) => (
        <Card key={appointment.id} className="border shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <CardTitle className="text-base">
                  {appointment.patientName}
                </CardTitle>
                <CardDescription>{appointment.therapyType}</CardDescription>
              </div>
              <div className="flex items-center gap-1">
                <AppointmentStatusBadge
                  status={appointment.status as AppointmentStatus}
                />
                {onEdit && (
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Editar horário"
                    onClick={() => onEdit(appointment)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
                {onRemove && (
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Remover horário"
                    onClick={() => onRemove(appointment)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" />
              {appointment.therapistName}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              {appointment.dayOfWeek
                ? `${formatDayOfWeek(appointment.dayOfWeek)} — `
                : ""}
              {formatTime(appointment.startTime)} às{" "}
              {formatTime(appointment.endTime)}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
