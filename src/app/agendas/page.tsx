import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/shared/page-header";
import { AppointmentsList } from "@/modules/agendas/components/appointments-list";
import { appointmentsMock } from "@/modules/agendas/mocks/appointments.mock";

export default function SchedulesPage() {
  return (
    <AppShell
      title="Agendas"
      description="Horários fixos e atendimentos da semana"
    >
      <PageHeader
        title="Agenda semanal"
        description="Visualização dos atendimentos fixos cadastrados"
        actionLabel="Novo horário"
      />
      <AppointmentsList appointments={appointmentsMock} />
    </AppShell>
  );
}
