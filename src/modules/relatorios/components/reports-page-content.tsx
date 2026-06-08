"use client";

import { AppShell } from "@/components/layout/app-shell";
import { ErrorState, LoadingState } from "@/components/shared/query-states";
import { ReportsDashboard } from "@/modules/relatorios/components/reports-dashboard";
import { useReports } from "@/hooks/use-reports";
import { HttpError } from "@/services/http-client";
import { getTodayDate } from "@/utils/date";

export function ReportsPageContent() {
  const today = getTodayDate();
  const { data: metrics, isLoading, isError, error } = useReports(today);

  return (
    <AppShell
      title="Relatórios"
      description="Indicadores operacionais do dia"
    >
      {isLoading && <LoadingState />}
      {isError && (
        <ErrorState
          message={
            error instanceof HttpError
              ? error.message
              : "Erro ao calcular relatórios."
          }
        />
      )}
      {metrics && <ReportsDashboard metrics={metrics} />}
    </AppShell>
  );
}
