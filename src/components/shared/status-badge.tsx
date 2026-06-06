import { Badge } from "@/components/ui/badge";
import type { AppointmentStatus, EntityStatus, SuggestionStatus } from "@/types";

const entityLabels: Record<EntityStatus, string> = {
  active: "Ativo",
  inactive: "Inativo",
};

const appointmentLabels: Record<AppointmentStatus, string> = {
  SCHEDULED: "Agendado",
  CANCELLED_PATIENT: "Cancelado (paciente)",
  CANCELLED_THERAPIST: "Cancelado (terapeuta)",
  RESCHEDULED: "Remanejado",
  COMPLETED: "Concluído",
};

const suggestionLabels: Record<SuggestionStatus, string> = {
  PENDING: "Pendente",
  ACCEPTED: "Aceita",
  REJECTED: "Rejeitada",
  APPLIED: "Aplicada",
};

export function EntityStatusBadge({ status }: { status: EntityStatus }) {
  return (
    <Badge variant={status === "active" ? "success" : "secondary"}>
      {entityLabels[status]}
    </Badge>
  );
}

export function AppointmentStatusBadge({
  status,
}: {
  status: AppointmentStatus;
}) {
  const variant =
    status === "SCHEDULED"
      ? "success"
      : status.startsWith("CANCELLED")
        ? "destructive"
        : "secondary";

  return <Badge variant={variant}>{appointmentLabels[status]}</Badge>;
}

export function SuggestionStatusBadge({
  status,
}: {
  status: SuggestionStatus;
}) {
  const variant =
    status === "PENDING"
      ? "warning"
      : status === "ACCEPTED" || status === "APPLIED"
        ? "success"
        : "destructive";

  return <Badge variant={variant}>{suggestionLabels[status]}</Badge>;
}
