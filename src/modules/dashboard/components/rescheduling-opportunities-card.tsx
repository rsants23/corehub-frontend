"use client";

import Link from "next/link";
import { Lightbulb, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import type { ReschedulingOpportunities } from "@/types";

interface ReschedulingOpportunitiesCardProps {
  opportunities: ReschedulingOpportunities;
}

export function ReschedulingOpportunitiesCard({
  opportunities,
}: ReschedulingOpportunitiesCardProps) {
  const { byReason, total, impactMinutes, utilizationGainPercent } =
    opportunities;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Lightbulb className="h-5 w-5 text-primary" />
            Oportunidades de Remanejamento
          </CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Sugestões automáticas detectadas para hoje
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.rescheduling}>Ver sugestões</Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border bg-muted/30 p-4">
            <p className="text-sm text-muted-foreground">Quantidade</p>
            <p className="text-2xl font-semibold">{total}</p>
            <p className="text-xs text-muted-foreground">sugestões viáveis</p>
          </div>
          <div className="rounded-lg border bg-muted/30 p-4">
            <p className="text-sm text-muted-foreground">Impacto</p>
            <p className="text-2xl font-semibold">
              {Math.round(impactMinutes / 60 * 10) / 10}h
            </p>
            <p className="text-xs text-muted-foreground">
              {impactMinutes} min recuperáveis
            </p>
          </div>
          <div className="rounded-lg border bg-muted/30 p-4">
            <p className="flex items-center gap-1 text-sm text-muted-foreground">
              <TrendingUp className="h-3.5 w-3.5" />
              Aproveitamento
            </p>
            <p className="text-2xl font-semibold">{utilizationGainPercent}%</p>
            <p className="text-xs text-muted-foreground">das vagas livres</p>
          </div>
        </div>

        <div className="grid gap-2 text-sm sm:grid-cols-3">
          <div className="flex justify-between rounded-md border px-3 py-2">
            <span className="text-muted-foreground">Ausência terapeuta</span>
            <span className="font-medium">{byReason.THERAPIST_ABSENCE.count}</span>
          </div>
          <div className="flex justify-between rounded-md border px-3 py-2">
            <span className="text-muted-foreground">Recuperação cancelamento</span>
            <span className="font-medium">
              {byReason.PATIENT_CANCELLATION_RECOVERY.count}
            </span>
          </div>
          <div className="flex justify-between rounded-md border px-3 py-2">
            <span className="text-muted-foreground">Otimização de slot</span>
            <span className="font-medium">
              {byReason.SLOT_OPTIMIZATION.count}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
