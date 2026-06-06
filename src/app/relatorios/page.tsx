import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/shared/page-header";
import { ReportsDashboard } from "@/modules/relatorios/components/reports-dashboard";
import { reportMetricsMock } from "@/modules/relatorios/mocks/reports.mock";

export default function ReportsPage() {
  return (
    <AppShell
      title="Relatórios"
      description="Indicadores operacionais da clínica"
    >
      <PageHeader
        title="Indicadores"
        description="Métricas de faltas, ocupação e recuperação de atendimentos"
      />
      <ReportsDashboard metrics={reportMetricsMock} />
    </AppShell>
  );
}
