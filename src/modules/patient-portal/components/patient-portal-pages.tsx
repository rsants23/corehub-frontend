"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ErrorState, LoadingState } from "@/components/shared/query-states";
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
  usePatientPortalAgendaQuery,
  usePatientPortalConsentsQuery,
  usePatientPortalMeQuery,
  usePatientPortalMutations,
} from "@/modules/portals/portal.queries";
import { getErrorMessage } from "@/services/api-error";
import { useToastStore } from "@/stores/toast-store";
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
    REQUESTED_CANCELLATION: "Cancelamento solicitado",
    THERAPIST_CANCELLED: "Cancelado",
    CANCELLED_THERAPIST: "Cancelado",
  };
  return map[status] ?? status;
}

export function PortalAgendaPageContent() {
  const showToast = useToastStore((s) => s.showToast);
  const { data: me, isLoading: meLoading } = usePatientPortalMeQuery();
  const [patientId, setPatientId] = useState<string | undefined>();
  const [dateFrom, setDateFrom] = useState(getTodayDate());
  const [dateTo, setDateTo] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().slice(0, 10);
  });

  const activePatientId = patientId ?? me?.patients[0]?.id;

  const { data, isLoading, isError, error, refetch } =
    usePatientPortalAgendaQuery(activePatientId, dateFrom, dateTo);
  const { requestCancellation } = usePatientPortalMutations();

  const appointments = useMemo(() => data ?? [], [data]);
  const nextSession = useMemo(() => {
    const now = Date.now();
    return appointments.find(
      (a) =>
        new Date(a.startTime).getTime() >= now &&
        !["THERAPIST_CANCELLED", "CANCELLED_THERAPIST", "MISSED"].includes(
          a.status,
        ),
    );
  }, [appointments]);

  const handleCancelRequest = async (id: string) => {
    try {
      await requestCancellation.mutateAsync(id);
      showToast("Solicitação de cancelamento enviada", "success");
      await refetch();
    } catch (err) {
      showToast(getErrorMessage(err, "Erro ao solicitar cancelamento"), "error");
    }
  };

  if (meLoading) {
    return (
      <AppShell title="Minha Agenda" description="Portal do paciente">
        <LoadingState message="Carregando..." />
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Minha Agenda"
      description={
        me?.clinic?.tradeName
          ? `Clínica ${me.clinic.tradeName}`
          : "Suas sessões agendadas"
      }
    >
      {nextSession && (
        <div className="mb-6 rounded-lg border bg-muted/40 p-4">
          <p className="text-sm font-medium text-muted-foreground">
            Próxima sessão
          </p>
          <p className="text-lg font-semibold">
            {new Date(nextSession.startTime).toLocaleString("pt-BR")}
          </p>
          <p className="text-sm">
            {nextSession.therapyType.name} com {nextSession.therapist.name}
          </p>
        </div>
      )}

      <div className="mb-6 flex flex-wrap items-end gap-4">
        {me && me.patients.length > 1 && (
          <div className="space-y-2">
            <Label>Paciente</Label>
            <Select
              value={activePatientId}
              onValueChange={(v) => setPatientId(v)}
            >
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {me.patients.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="from">De</Label>
          <Input
            id="from"
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-[160px]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="to">Até</Label>
          <Input
            id="to"
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-[160px]"
          />
        </div>
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
          Nenhuma sessão no período selecionado.
        </div>
      )}

      {!isLoading && !isError && appointments.length > 0 && (
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Horário</TableHead>
                <TableHead>Terapeuta</TableHead>
                <TableHead>Terapia</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead className="text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appt) => {
                const canCancel = ["SCHEDULED", "CONFIRMED", "RESCHEDULED"].includes(
                  appt.status,
                );
                return (
                  <TableRow key={appt.id}>
                    <TableCell>
                      {new Date(appt.date).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      {formatTime(appt.startTime)} – {formatTime(appt.endTime)}
                    </TableCell>
                    <TableCell>{appt.therapist.name}</TableCell>
                    <TableCell>{appt.therapyType.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{statusLabel(appt.status)}</Badge>
                    </TableCell>
                    <TableCell>{appt.origin}</TableCell>
                    <TableCell className="text-right">
                      {canCancel && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={requestCancellation.isPending}
                          onClick={() => void handleCancelRequest(appt.id)}
                        >
                          Solicitar cancelamento
                        </Button>
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

export function PortalConsentsPageContent() {
  const showToast = useToastStore((s) => s.showToast);
  const { data: me } = usePatientPortalMeQuery();
  const patientId = me?.patients[0]?.id;
  const { data, isLoading, isError, error, refetch } =
    usePatientPortalConsentsQuery(patientId);
  const { createConsent } = usePatientPortalMutations();

  const [purpose, setPurpose] = useState("");
  const [version, setVersion] = useState("1.0");

  const handleCreate = async () => {
    if (!patientId || !me) return;
    try {
      await createConsent.mutateAsync({
        patientId,
        guardianName: me.user.name,
        purpose,
        version,
      });
      showToast("Consentimento registrado", "success");
      setPurpose("");
      await refetch();
    } catch (err) {
      showToast(getErrorMessage(err, "Erro ao registrar consentimento"), "error");
    }
  };

  return (
    <AppShell
      title="Consentimentos"
      description="Termos LGPD vinculados ao paciente"
    >
      {isLoading && <LoadingState message="Carregando consentimentos..." />}
      {isError && (
        <ErrorState
          message={getErrorMessage(error, "Erro ao carregar")}
          onRetry={() => void refetch()}
        />
      )}

      {!isLoading && !isError && (
        <>
          <div className="mb-6 space-y-3 rounded-lg border p-4">
            <h3 className="font-medium">Registrar consentimento</h3>
            <div className="space-y-2">
              <Label htmlFor="purpose">Finalidade</Label>
              <Input
                id="purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Ex.: Tratamento terapêutico"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="version">Versão</Label>
              <Input
                id="version"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
              />
            </div>
            <Button
              disabled={!purpose.trim() || createConsent.isPending}
              onClick={() => void handleCreate()}
            >
              Registrar
            </Button>
          </div>

          {(data ?? []).length === 0 ? (
            <p className="text-muted-foreground">Nenhum consentimento registrado.</p>
          ) : (
            <ul className="space-y-3">
              {(data ?? []).map((c) => (
                <li key={c.id} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium">{c.purpose}</p>
                    <Badge
                      variant={c.status === "GRANTED" ? "success" : "secondary"}
                    >
                      {c.status === "GRANTED" ? "Concedido" : c.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    v{c.version} · {c.patient.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(c.grantedAt).toLocaleDateString("pt-BR")}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </AppShell>
  );
}

export function PortalProfilePageContent() {
  const { data: me, isLoading, isError, error, refetch } =
    usePatientPortalMeQuery();

  if (isLoading) {
    return (
      <AppShell title="Perfil" description="Portal do paciente">
        <LoadingState message="Carregando perfil..." />
      </AppShell>
    );
  }

  if (isError || !me) {
    return (
      <AppShell title="Perfil" description="Erro">
        <ErrorState
          message={getErrorMessage(error, "Erro ao carregar perfil")}
          onRetry={() => void refetch()}
        />
      </AppShell>
    );
  }

  const patient = me.patients[0];

  return (
    <AppShell title="Perfil" description="Dados básicos do acesso">
      <div className="max-w-lg space-y-4 rounded-lg border p-6">
        <div>
          <p className="text-sm text-muted-foreground">Usuário</p>
          <p className="font-medium">{me.user.name}</p>
          <p className="text-sm">{me.user.email}</p>
        </div>
        {me.clinic && (
          <div>
            <p className="text-sm text-muted-foreground">Clínica</p>
            <p className="font-medium">{me.clinic.tradeName}</p>
            {me.clinic.phone && (
              <p className="text-sm">{me.clinic.phone}</p>
            )}
          </div>
        )}
        {patient && (
          <div>
            <p className="text-sm text-muted-foreground">Paciente vinculado</p>
            <p className="font-medium">{patient.name}</p>
            {patient.birthDate && (
              <p className="text-sm">
                Nasc.:{" "}
                {new Date(patient.birthDate).toLocaleDateString("pt-BR")}
              </p>
            )}
            {patient.guardianName && (
              <p className="text-sm">Responsável: {patient.guardianName}</p>
            )}
            {patient.guardianPhone && (
              <p className="text-sm">Contato: {patient.guardianPhone}</p>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
