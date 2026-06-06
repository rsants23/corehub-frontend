import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/shared/page-header";
import { PatientsTable } from "@/modules/pacientes/components/patients-table";
import { patientsMock } from "@/modules/pacientes/mocks/patients.mock";

export default function PatientsPage() {
  return (
    <AppShell
      title="Pacientes"
      description="Cadastro e acompanhamento dos pacientes da clínica"
    >
      <PageHeader
        title="Lista de pacientes"
        description="Gerencie convênios, terapias e status dos pacientes"
        actionLabel="Novo paciente"
      />
      <PatientsTable data={patientsMock} />
    </AppShell>
  );
}
