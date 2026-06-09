"use client";

import {
  Activity,
  AlertTriangle,
  Building2,
  CreditCard,
  DollarSign,
  Timer,
  UserRound,
  Users,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { AdminShell } from "@/components/layout/admin-shell";
import { ErrorState } from "@/components/shared/query-states";
import { StatCardsSkeleton } from "@/components/shared/skeletons";
import { StatCard } from "@/components/shared/stat-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QUERY_KEYS } from "@/constants/api";
import { adminApiService } from "@/modules/admin/services/admin-api.service";
import { formatCurrency } from "@/modules/admin/utils/format";
import { getErrorMessage } from "@/services/api-error";

export function AdminDashboardPageContent() {
  const { data: stats, isLoading, isError, error } = useQuery({
    queryKey: QUERY_KEYS.adminDashboard,
    queryFn: () => adminApiService.getDashboardStats(),
  });

  return (
    <AdminShell title="Dashboard" description="Visão global e financeira do SaaS CoreHub">
      {isLoading && <StatCardsSkeleton count={10} />}
      {isError && (
        <ErrorState message={getErrorMessage(error, "Erro ao carregar dashboard.")} />
      )}
      {stats && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard title="Total de clínicas" value={stats.totalClinics} icon={Building2} />
            <StatCard title="Clínicas ativas" value={stats.activeClinics} icon={Building2} />
            <StatCard title="Inativas / suspensas" value={stats.inactiveClinics} icon={AlertTriangle} />
            <StatCard title="Total de usuários" value={stats.totalUsers} icon={Users} />
            <StatCard title="Total de pacientes" value={stats.totalPatients} icon={UserRound} />
            <StatCard
              title="MRR previsto"
              value={formatCurrency(stats.monthlyProjectedRevenue)}
              icon={DollarSign}
            />
            <StatCard
              title="Recebido no mês"
              value={formatCurrency(stats.paidRevenueThisMonth)}
              icon={CreditCard}
            />
            <StatCard
              title="Pendente"
              value={formatCurrency(stats.pendingRevenue)}
              description={`${stats.pendingInvoicesCount} fatura(s)`}
              icon={CreditCard}
            />
            <StatCard
              title="Vencido"
              value={formatCurrency(stats.overdueRevenue)}
              description={`${stats.overdueInvoicesCount} fatura(s)`}
              icon={AlertTriangle}
            />
            <StatCard
              title="Licenças vencendo (7d)"
              value={stats.licensesExpiringIn7Days}
              icon={Timer}
            />
            <Card className="border shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Health da API
                </CardTitle>
                <Activity className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <Badge variant={stats.apiHealth.status === "ok" ? "default" : "destructive"}>
                  {stats.apiHealth.status}
                </Badge>
                <span className="ml-2 text-sm text-muted-foreground">
                  DB: {stats.apiHealth.database}
                </span>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </AdminShell>
  );
}
