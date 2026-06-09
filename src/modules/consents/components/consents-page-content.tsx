"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ErrorState } from "@/components/shared/query-states";
import { PageHeader } from "@/components/shared/page-header";
import { TableSkeleton } from "@/components/shared/skeletons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { usePatients } from "@/hooks/use-patients";
import { ConsentFormDialog } from "@/modules/consents/components/consent-form-dialog";
import {
  useConsentMutations,
  useConsentsQuery,
} from "@/modules/consents/consents.queries";
import type { ApiConsent } from "@/modules/consents/services/consents.service";
import type { ConsentFormValues } from "@/modules/consents/schemas/consent.schema";
import { getErrorMessage } from "@/services/api-error";
import { useToastStore } from "@/stores/toast-store";
import { formatDate } from "@/utils/format";

export function ConsentsPageContent() {
  const showToast = useToastStore((state) => state.showToast);
  const [patientFilter, setPatientFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [consentToRevoke, setConsentToRevoke] = useState<ApiConsent | null>(
    null,
  );

  const patientId = patientFilter === "all" ? undefined : patientFilter;
  const { data: patients } = usePatients();
  const { data: consents, isLoading, isError, error } = useConsentsQuery(
    patientId,
  );
  const { create, revoke } = useConsentMutations(patientId);

  const filteredConsents = useMemo(() => {
    if (!consents) return [];
    if (statusFilter === "all") return consents;
    return consents.filter((c) => c.status === statusFilter);
  }, [consents, statusFilter]);

  const handleCreate = async (values: ConsentFormValues) => {
    try {
      await create.mutateAsync(values);
      showToast("Consentimento registrado com sucesso");
      setDialogOpen(false);
    } catch (err) {
      showToast(getErrorMessage(err, "Erro ao registrar consentimento"), "error");
    }
  };

  const handleRevoke = async () => {
    if (!consentToRevoke) return;
    try {
      await revoke.mutateAsync(consentToRevoke.id);
      showToast("Consentimento revogado");
      setConsentToRevoke(null);
    } catch (err) {
      showToast(getErrorMessage(err, "Erro ao revogar consentimento"), "error");
    }
  };

  return (
    <AppShell
      title="Consentimentos LGPD"
      description="Registro e revogação de consentimentos dos pacientes"
    >
      <PageHeader
        actionLabel="Novo consentimento"
        onAction={() => setDialogOpen(true)}
      />

      <div className="mb-4 flex flex-wrap gap-3">
        <Select value={patientFilter} onValueChange={setPatientFilter}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Paciente" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os pacientes</SelectItem>
            {(patients ?? []).map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="GRANTED">Concedido</SelectItem>
            <SelectItem value="REVOKED">Revogado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading && <TableSkeleton rows={5} columns={6} />}
      {isError && (
        <ErrorState
          message={getErrorMessage(error, "Erro ao carregar consentimentos")}
        />
      )}

      {consents && filteredConsents.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Nenhum consentimento encontrado para os filtros selecionados.
        </p>
      )}

      {filteredConsents.length > 0 && (
        <div className="rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Paciente</TableHead>
                <TableHead>Finalidade</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Concessão</TableHead>
                <TableHead>Revogação</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredConsents.map((consent) => (
                <TableRow key={consent.id}>
                  <TableCell className="font-medium">
                    {consent.patient.name}
                  </TableCell>
                  <TableCell>{consent.purpose}</TableCell>
                  <TableCell>{consent.guardianName}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        consent.status === "GRANTED" ? "default" : "secondary"
                      }
                    >
                      {consent.status === "GRANTED" ? "Concedido" : "Revogado"}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(consent.grantedAt)}</TableCell>
                  <TableCell>
                    {consent.revokedAt
                      ? formatDate(consent.revokedAt)
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    {consent.status === "GRANTED" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setConsentToRevoke(consent)}
                      >
                        Revogar
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <ConsentFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        patients={patients ?? []}
        onSubmit={handleCreate}
        isSubmitting={create.isPending}
      />

      <ConfirmDialog
        open={Boolean(consentToRevoke)}
        onOpenChange={(open) => !open && setConsentToRevoke(null)}
        title="Revogar consentimento"
        description={
          consentToRevoke
            ? `Deseja revogar o consentimento de "${consentToRevoke.patient.name}" referente a "${consentToRevoke.purpose}"?`
            : ""
        }
        confirmLabel="Revogar"
        isLoading={revoke.isPending}
        onConfirm={handleRevoke}
      />
    </AppShell>
  );
}
