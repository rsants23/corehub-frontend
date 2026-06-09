"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { AppointmentStatusBadge } from "@/components/shared/status-badge";
import { ErrorState } from "@/components/shared/query-states";
import { TableSkeleton } from "@/components/shared/skeletons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useDailyScheduleQuery,
  useScheduleMutations,
} from "@/modules/agendas/appointments.queries";
import { useTherapists } from "@/hooks/use-therapists";
import { getErrorMessage } from "@/services/api-error";
import { useToastStore } from "@/stores/toast-store";
import { getTodayDate } from "@/utils/date";
import type { ApiAppointment } from "@/types/api";
import type { AppointmentStatus } from "@/types";

function formatTimeFromIso(iso: string): string {
  return new Date(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getOriginLabel(appointment: ApiAppointment): string {
  if (appointment.status === "RESCHEDULED") return "Remanejada";
  if (
    appointment.status === "CANCELLED_PATIENT" ||
    appointment.status === "CANCELLED_THERAPIST"
  ) {
    return "Cancelada";
  }
  return "Fixa";
}

export function DailyAgendaPageContent() {
  const showToast = useToastStore((state) => state.showToast);
  const [date, setDate] = useState(getTodayDate());
  const [therapistFilter, setTherapistFilter] = useState("all");

  const { data: therapists } = useTherapists();
  const { data: daily, isLoading, isError, error, refetch } =
    useDailyScheduleQuery(date);
  const { generateDaily } = useScheduleMutations();

  const appointments = useMemo(() => {
    const list = daily?.appointments ?? [];
    if (therapistFilter === "all") return list;
    return list.filter((a) => a.therapistId === therapistFilter);
  }, [daily, therapistFilter]);

  const handleGenerate = async () => {
    try {
      await generateDaily.mutateAsync(date);
      showToast("Agenda diária gerada com sucesso");
      await refetch();
    } catch (err) {
      showToast(getErrorMessage(err, "Erro ao gerar agenda diária"), "error");
    }
  };

  const notGenerated = !isLoading && !isError && !daily;

  return (
    <AppShell
      title="Agenda diária"
      description="Visualização dos atendimentos gerados para o dia selecionado"
    >
      <div className="mb-6 flex flex-wrap items-end gap-4">
        <div className="space-y-2">
          <Label htmlFor="daily-date">Data</Label>
          <Input
            id="daily-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-[180px]"
          />
        </div>
        <div className="space-y-2">
          <Label>Terapeuta</Label>
          <Select value={therapistFilter} onValueChange={setTherapistFilter}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Terapeuta" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {(therapists ?? []).map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={handleGenerate}
          disabled={generateDaily.isPending}
          variant="outline"
        >
          {generateDaily.isPending ? "Gerando..." : "Gerar agenda do dia"}
        </Button>
      </div>

      {isLoading && <TableSkeleton rows={6} columns={6} />}
      {isError && (
        <ErrorState
          message={getErrorMessage(error, "Erro ao carregar agenda diária")}
        />
      )}

      {notGenerated && (
        <div className="rounded-xl border border-dashed bg-muted/30 p-8 text-center">
          <p className="text-sm font-medium">
            Nenhuma agenda gerada para esta data
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Gere a agenda a partir dos horários fixos cadastrados.
          </p>
          <Button
            className="mt-4"
            onClick={handleGenerate}
            disabled={generateDaily.isPending}
          >
            {generateDaily.isPending ? "Gerando..." : "Gerar agenda"}
          </Button>
        </div>
      )}

      {appointments.length > 0 && (
        <div className="rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Horário</TableHead>
                <TableHead>Paciente</TableHead>
                <TableHead>Terapeuta</TableHead>
                <TableHead>Terapia</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Origem</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments
                .sort(
                  (a, b) =>
                    new Date(a.startTime).getTime() -
                    new Date(b.startTime).getTime(),
                )
                .map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      {formatTimeFromIso(appointment.startTime)} –{" "}
                      {formatTimeFromIso(appointment.endTime)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {appointment.patient.name}
                    </TableCell>
                    <TableCell>{appointment.therapist.name}</TableCell>
                    <TableCell>{appointment.therapyType.name}</TableCell>
                    <TableCell>
                      <AppointmentStatusBadge
                        status={appointment.status as AppointmentStatus}
                      />
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getOriginLabel(appointment)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      )}
    </AppShell>
  );
}
