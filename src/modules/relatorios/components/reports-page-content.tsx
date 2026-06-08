"use client";

import { AppShell } from "@/components/layout/app-shell";
import { ErrorState } from "@/components/shared/query-states";
import { StatCardsSkeleton } from "@/components/shared/skeletons";
import { ReportsDashboard } from "@/modules/relatorios/components/reports-dashboard";
import { useReports } from "@/hooks/use-reports";
import { getErrorMessage } from "@/services/api-error";
import { getTodayDate } from "@/utils/date";

export function ReportsPageContent() {
  const today = getTodayDate();
  const { data: metrics, isLoading, isError, error } = useReports(today);

  return (
    <AppShell
      title="Relatórios"
      description="Indicadores operacionais do dia"
    >
      {isLoading && <StatCardsSkeleton count={4} />}
      {isError && (
        <ErrorState
          message={getErrorMessage(error, "Erro ao calcular relatórios.")}
        />
      )}
      {metrics && <ReportsDashboard metrics={metrics} />}
    </AppShell>
  );
}
