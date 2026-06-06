import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/shared/page-header";
import { TherapistsTable } from "@/modules/terapeutas/components/therapists-table";
import { therapistsMock } from "@/modules/terapeutas/mocks/therapists.mock";

export default function TherapistsPage() {
  return (
    <AppShell
      title="Terapeutas"
      description="Equipe terapêutica e carga horária"
    >
      <PageHeader
        title="Lista de terapeutas"
        description="Especialidades, disponibilidade e status"
        actionLabel="Novo terapeuta"
      />
      <TherapistsTable data={therapistsMock} />
    </AppShell>
  );
}
