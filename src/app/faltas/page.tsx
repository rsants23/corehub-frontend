import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/shared/page-header";
import { AbsenceForm } from "@/modules/faltas/components/absence-form";
import { AbsencesList } from "@/modules/faltas/components/absences-list";
import { absencesMock } from "@/modules/faltas/mocks/absences.mock";

export default function AbsencesPage() {
  return (
    <AppShell
      title="Faltas"
      description="Registro de ausências de pacientes e terapeutas"
    >
      <PageHeader
        title="Gestão de faltas"
        description="Registre e acompanhe ausências do dia"
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <AbsenceForm />
        <div>
          <h3 className="mb-4 text-lg font-semibold">Faltas registradas</h3>
          <AbsencesList absences={absencesMock} />
        </div>
      </div>
    </AppShell>
  );
}
