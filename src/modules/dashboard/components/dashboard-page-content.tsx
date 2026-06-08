"use client";

import {
  Calendar,
  Clock,
  Shuffle,
  Stethoscope,
  UserX,
  Users,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { ErrorState, LoadingState } from "@/components/shared/query-states";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboard } from "@/hooks/use-dashboard";
import { HttpError } from "@/services/http-client";
import { getTodayDate } from "@/utils/date";
import { formatPercent } from "@/utils/format";

export function DashboardPageContent() {
  const today = getTodayDate();
  const { data: stats, isLoading, isError, error } = useDashboard(today);

  return (
    <AppShell
      title="Dashboard"
      description="Visão geral da operação clínica de hoje"
    >
      {isLoading && <LoadingState message="Carregando indicadores da API..." />}
      {isError && (
        <ErrorState
          message={
            error instanceof HttpError
              ? error.message
              : "Erro ao carregar dashboard. Verifique se a API está rodando."
          }
        />
      )}
      {stats && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard
              title="Pacientes do dia"
              value={stats.patientsToday}
              description="Atendimentos previstos"
              icon={Users}
            />
            <StatCard
              title="Terapeutas presentes"
              value={stats.therapistsPresent}
              description="Equipe disponível"
              icon={Stethoscope}
            />
            <StatCard
              title="Faltas registradas"
              value={stats.absencesRegistered}
              description="Pacientes e terapeutas"
              icon={UserX}
            />
            <StatCard
              title="Horários livres"
              value={stats.freeSlots}
              description="Slots disponíveis hoje"
              icon={Clock}
            />
            <StatCard
              title="Remanejamentos sugeridos"
              value={stats.suggestedReschedules}
              description="Aguardando decisão"
              icon={Shuffle}
            />
            <StatCard
              title="Taxa de ocupação"
              value={formatPercent(stats.occupancyRate)}
              description="Capacidade utilizada"
              icon={Calendar}
            />
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resumo do dia ({today})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  A clínica opera com {stats.therapistsPresent} terapeutas e{" "}
                  {stats.patientsToday} pacientes com atendimento previsto.
                </p>
                <p>
                  Existem {stats.freeSlots} horários livres que podem receber
                  encaixes automáticos.
                </p>
                <p>
                  {stats.suggestedReschedules} sugestões de remanejamento
                  aguardam aprovação.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Próximas ações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>• Gerar agenda do dia em Agendas ou Faltas</p>
                <p>• Revisar sugestões de remanejamento pendentes</p>
                <p>• Confirmar faltas registradas pela recepção</p>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </AppShell>
  );
}
