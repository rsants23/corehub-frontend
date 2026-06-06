"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPercent } from "@/utils/format";
import type { ReportMetrics } from "@/types";
import { Activity, Clock, RotateCcw, UserX } from "lucide-react";

interface ReportsDashboardProps {
  metrics: ReportMetrics;
}

export function ReportsDashboard({ metrics }: ReportsDashboardProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Taxa de faltas"
          value={formatPercent(metrics.absenceRate)}
          description="Últimos 30 dias"
          icon={UserX}
        />
        <StatCard
          title="Horas ociosas"
          value={`${metrics.idleHours}h`}
          description="Tempo sem atendimento"
          icon={Clock}
        />
        <StatCard
          title="Atendimentos recuperados"
          value={metrics.recoveredAppointments}
          description="Via remanejamento automático"
          icon={RotateCcw}
        />
        <StatCard
          title="Ocupação média"
          value={formatPercent(
            metrics.therapistOccupancy.reduce((acc, t) => acc + t.rate, 0) /
              metrics.therapistOccupancy.length,
          )}
          description="Média dos terapeutas"
          icon={Activity}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ocupação por terapeuta</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.therapistOccupancy}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis unit="%" tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value: number) => [`${value}%`, "Ocupação"]}
                />
                <Bar
                  dataKey="rate"
                  fill="hsl(var(--primary))"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
