"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { ErrorState, LoadingState } from "@/components/shared/query-states";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ROUTES } from "@/constants/routes";
import {
  useTherapistAgendaQuery,
  useTherapistPortalMutations,
} from "@/modules/portals/portal.queries";
import { getErrorMessage } from "@/services/api-error";
import { useToastStore } from "@/stores/toast-store";
import type { TherapistAppointmentAction } from "@/types/portal";
import { getTodayDate } from "@/utils/date";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusLabel(status: string) {
  const map: Record<string, string> = {
    SCHEDULED: "Agendado",
    CONFIRMED: "Confirmado",
    COMPLETED: "Concluído",
    MISSED: "Falta",
    RESCHEDULED: "Remanejado",
    THERAPIST_CANCELLED: "Cancelado",
    CANCELLED_THERAPIST: "Cancelado",
    REQUESTED_CANCELLATION: "Cancel. solicitado",
  };
  return map[status] ?? status;
}

export function MyAgendaPageContent() {
  const showToast = useToastStore((s) => s.showToast);
  const [date, setDate] = useState(getTodayDate());
  const { data, isLoading, isError, error, refetch } =
    useTherapistAgendaQuery(date);
  const { updateStatus } = useTherapistPortalMutations();

  const appointments = useMemo(() => data ?? [], [data]);

  const handleAction = async (
    id: string,
    status: TherapistAppointmentAction,
  ) => {
    try {
      await updateStatus.mutateAsync({ id, status });
      showToast("Status atualizado", "success");
      await refetch();
    } catch (err) {
      showToast(getErrorMessage(err, "Erro ao atualizar status"), "error");
    }
  };

  return (
    <AppShell
      title="Minha Agenda"
      description="Atendimentos do dia vinculados a você"
    >
      <div className="mb-6">
        <Label htmlFor="agenda-date">Data</Label>
        <Input
          id="agenda-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-2 w-[180px]"
        />
      </div>

      {isLoading && <LoadingState message="Carregando agenda..." />}
      {isError && (
        <ErrorState
          message={getErrorMessage(error, "Erro ao carregar agenda")}
          onRetry={() => void refetch()}
        />
      )}

      {!isLoading && !isError && appointments.length === 0 && (
        <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
          Nenhum atendimento para esta data.
        </div>
      )}

      {!isLoading && !isError && appointments.length > 0 && (
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Horário</TableHead>
                <TableHead>Paciente</TableHead>
                <TableHead>Terapia</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appt) => {
                const canAct = ["SCHEDULED", "CONFIRMED", "RESCHEDULED"].includes(
                  appt.status,
                );
                return (
                  <TableRow key={appt.id}>
                    <TableCell>
                      {formatTime(appt.startTime)} – {formatTime(appt.endTime)}
                    </TableCell>
                    <TableCell>{appt.patient.name}</TableCell>
                    <TableCell>{appt.therapyType.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{statusLabel(appt.status)}</Badge>
                    </TableCell>
                    <TableCell>{appt.origin}</TableCell>
                    <TableCell className="space-x-1 text-right">
                      {canAct && (
                        <>
                          {appt.status === "SCHEDULED" && (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={updateStatus.isPending}
                              onClick={() =>
                                void handleAction(appt.id, "CONFIRMED")
                              }
                            >
                              Confirmar
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={updateStatus.isPending}
                            onClick={() =>
                              void handleAction(appt.id, "COMPLETED")
                            }
                          >
                            Concluir
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={updateStatus.isPending}
                            onClick={() => void handleAction(appt.id, "NO_SHOW")}
                          >
                            Falta
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </AppShell>
  );
}

export function MyPatientsPageContent() {
  const [search, setSearch] = useState("");
  const { data, isLoading, isError, error, refetch } =
    useTherapistPatientsQuery();

  const patients = useMemo(() => {
    const list = data ?? [];
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter((p) => p.name.toLowerCase().includes(q));
  }, [data, search]);

  return (
    <AppShell
      title="Meus Pacientes"
      description="Pacientes vinculados à sua agenda"
    >
      <div className="mb-6 max-w-sm">
        <Label htmlFor="patient-search">Buscar por nome</Label>
        <Input
          id="patient-search"
          placeholder="Nome do paciente"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mt-2"
        />
      </div>

      {isLoading && <LoadingState message="Carregando pacientes..." />}
      {isError && (
        <ErrorState
          message={getErrorMessage(error, "Erro ao carregar pacientes")}
          onRetry={() => void refetch()}
        />
      )}

      {!isLoading && !isError && patients.length === 0 && (
        <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
          Nenhum paciente vinculado.
        </div>
      )}

      {!isLoading && !isError && patients.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {patients.map((patient) => (
            <div key={patient.id} className="rounded-lg border p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold">{patient.name}</h3>
                  {patient.birthDate && (
                    <p className="text-sm text-muted-foreground">
                      Nasc.:{" "}
                      {new Date(patient.birthDate).toLocaleDateString("pt-BR")}
                    </p>
                  )}
                  {patient.guardianName && (
                    <p className="text-sm text-muted-foreground">
                      Responsável: {patient.guardianName}
                    </p>
                  )}
                </div>
                <Button size="sm" variant="outline" asChild>
                  <Link href={`${ROUTES.myPatients}/${patient.id}`}>
                    Detalhes
                  </Link>
                </Button>
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {patient.therapyTypes.map((t) => (
                  <Badge key={t.id} variant="secondary">
                    {t.name}
                  </Badge>
                ))}
              </div>
              {patient.nextAppointment && (
                <p className="mt-2 text-sm">
                  Próximo:{" "}
                  {new Date(patient.nextAppointment.startTime).toLocaleString(
                    "pt-BR",
                  )}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}

export function MyPatientDetailPageContent({ patientId }: { patientId: string }) {
  const { data, isLoading, isError, error, refetch } =
    useTherapistPatientQuery(patientId);

  if (isLoading) {
    return (
      <AppShell title="Paciente" description="Carregando...">
        <LoadingState message="Carregando detalhes..." />
      </AppShell>
    );
  }

  if (isError || !data) {
    return (
      <AppShell title="Paciente" description="Erro">
        <ErrorState
          message={getErrorMessage(error, "Paciente não encontrado")}
          onRetry={() => void refetch()}
        />
      </AppShell>
    );
  }

  return (
    <AppShell
      title={data.patient.name}
      description="Detalhes do paciente vinculado"
    >
      <div className="mb-6 space-y-1">
        {data.patient.birthDate && (
          <p className="text-sm text-muted-foreground">
            Nascimento:{" "}
            {new Date(data.patient.birthDate).toLocaleDateString("pt-BR")}
          </p>
        )}
        {data.patient.guardianName && (
          <p className="text-sm">
            Responsável: {data.patient.guardianName}
            {data.patient.guardianPhone
              ? ` · ${data.patient.guardianPhone}`
              : ""}
          </p>
        )}
        <div className="flex flex-wrap gap-1 pt-2">
          {data.therapyTypes.map((t) => (
            <Badge key={t.id} variant="secondary">
              {t.name}
            </Badge>
          ))}
        </div>
      </div>

      <h3 className="mb-2 font-semibold">Próximos atendimentos</h3>
      {data.upcomingAppointments.length === 0 ? (
        <p className="mb-6 text-sm text-muted-foreground">Nenhum agendado.</p>
      ) : (
        <ul className="mb-6 space-y-2">
          {data.upcomingAppointments.map((a) => (
            <li key={a.id} className="rounded border px-3 py-2 text-sm">
              {new Date(a.startTime).toLocaleString("pt-BR")} · {a.therapyType}{" "}
              · {statusLabel(a.status)} · {a.origin}
            </li>
          ))}
        </ul>
      )}

      <h3 className="mb-2 font-semibold">Histórico recente</h3>
      {data.history.length === 0 ? (
        <p className="text-sm text-muted-foreground">Sem histórico.</p>
      ) : (
        <ul className="space-y-2">
          {data.history.map((a) => (
            <li key={a.id} className="rounded border px-3 py-2 text-sm">
              {new Date(a.startTime).toLocaleString("pt-BR")} · {a.therapyType}{" "}
              · {statusLabel(a.status)}
            </li>
          ))}
        </ul>
      )}

      <Button variant="outline" className="mt-6" asChild>
        <Link href={ROUTES.myPatients}>Voltar</Link>
      </Button>
    </AppShell>
  );
}
