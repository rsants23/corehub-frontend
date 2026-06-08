"use client";

import { AppShell } from "@/components/layout/app-shell";
import { ErrorState } from "@/components/shared/query-states";
import { CardListSkeleton } from "@/components/shared/skeletons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuditLogsQuery } from "@/modules/auditoria/audit.queries";
import { getErrorMessage } from "@/services/api-error";
import { formatDate } from "@/utils/format";

export function AuditPageContent() {
  const { data: logs, isLoading, isError, error } = useAuditLogsQuery();

  return (
    <AppShell
      title="Auditoria"
      description="Registro de ações críticas do tenant (LGPD)"
    >
      {isLoading && <CardListSkeleton count={4} />}
      {isError && (
        <ErrorState message={getErrorMessage(error, "Erro ao carregar auditoria")} />
      )}
      {logs && (
        <div className="grid gap-3">
          {logs.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhum registro de auditoria ainda.
            </p>
          ) : (
            logs.map((log) => (
              <Card key={log.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    {log.action} · {log.entity}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 text-sm text-muted-foreground">
                  <p>{log.summary}</p>
                  <p>
                    {log.user?.name ?? "Sistema"} —{" "}
                    {formatDate(log.createdAt)}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </AppShell>
  );
}
