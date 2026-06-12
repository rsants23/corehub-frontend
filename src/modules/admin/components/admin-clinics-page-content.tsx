"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminShell } from "@/components/layout/admin-shell";
import { ErrorState, LoadingState } from "@/components/shared/query-states";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { ADMIN_ROUTES } from "@/constants/admin-routes";
import { QUERY_KEYS } from "@/constants/api";
import { adminApiService } from "@/modules/admin/services/admin-api.service";
import {
  formatCnpj,
  formatCurrency,
  formatDate,
  toInputDate,
} from "@/modules/admin/utils/format";
import { getErrorMessage } from "@/services/api-error";
import { useToastStore } from "@/stores/toast-store";
import type { AdminClinic, ClinicStatus } from "@/types/admin";
import { useAdminAuthStore } from "@/stores/admin-auth-store";

const STATUS_LABELS: Record<ClinicStatus, string> = {
  ACTIVE: "Ativa",
  INACTIVE: "Inativa",
  SUSPENDED: "Suspensa",
};

export function AdminClinicsPageContent() {
  const [createOpen, setCreateOpen] = useState(false);
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.showToast);
  const canManage = useAdminAuthStore((s) => s.user?.role) === "SUPER_ADMIN";

  const { data, isLoading, isError, error } = useQuery({
    queryKey: QUERY_KEYS.adminClinics,
    queryFn: () => adminApiService.listClinics(),
  });

  const { data: plans } = useQuery({
    queryKey: QUERY_KEYS.adminPlans,
    queryFn: () => adminApiService.listPlans(),
  });

  const statusMutation = useMutation<
    { id: string; status: ClinicStatus },
    Error,
    { id: string; status: ClinicStatus }
  >({
    mutationFn: ({ id, status }) =>
      adminApiService.updateClinicStatus(id, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminClinics });
      showToast("Status atualizado", "success");
    },
    onError: (err) =>
      showToast(getErrorMessage(err, "Erro ao atualizar status"), "error"),
  });

  return (
    <AdminShell
      title="Clínicas"
      description="Gestão global de tenants do CoreHub SaaS"
    >
      <div className="mb-4 flex justify-end">
        {canManage && (
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova clínica
          </Button>
        )}
      </div>

      {isLoading && <LoadingState message="Carregando clínicas..." />}
      {isError && (
        <ErrorState message={getErrorMessage(error, "Erro ao carregar clínicas.")} />
      )}

      {data && (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Licença</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Usuários</TableHead>
                <TableHead>Pacientes</TableHead>
                <TableHead>Terapeutas</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((clinic) => (
                <TableRow key={clinic.id}>
                  <TableCell className="font-medium">
                    <Link
                      href={ADMIN_ROUTES.clinicDetail(clinic.id)}
                      className="text-primary hover:underline"
                    >
                      {clinic.tradeName}
                    </Link>
                  </TableCell>
                  <TableCell>{formatCnpj(clinic.cnpj)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        clinic.status === "ACTIVE" ? "default" : "secondary"
                      }
                    >
                      {STATUS_LABELS[clinic.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>{clinic.subscription?.planName ?? "—"}</TableCell>
                  <TableCell>
                    {clinic.subscription
                      ? `${formatDate(clinic.subscription.expiresAt)} (${clinic.subscription.daysRemaining}d)`
                      : "—"}
                  </TableCell>
                  <TableCell>
                    {clinic.subscription
                      ? formatCurrency(clinic.subscription.finalPrice)
                      : "—"}
                  </TableCell>
                  <TableCell>{clinic.userCount}</TableCell>
                  <TableCell>{clinic.patientCount}</TableCell>
                  <TableCell>{clinic.therapistCount}</TableCell>
                  <TableCell className="space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={ADMIN_ROUTES.clinicDetail(clinic.id)}>
                        Detalhes
                      </Link>
                    </Button>
                    {canManage && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          statusMutation.mutate({
                            id: clinic.id,
                            status:
                              clinic.status === "ACTIVE"
                                ? "INACTIVE"
                                : "ACTIVE",
                          })
                        }
                      >
                        {clinic.status === "ACTIVE" ? "Inativar" : "Ativar"}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <CreateClinicDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        plans={plans ?? []}
      />
    </AdminShell>
  );
}

function CreateClinicDialog({
  open,
  onOpenChange,
  plans,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plans: { id: string; name: string }[];
}) {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.showToast);
  const [form, setForm] = useState({
    tradeName: "",
    legalName: "",
    cnpj: "",
    email: "",
    phone: "",
    responsibleName: "",
    planId: "",
    licenseStartsAt: toInputDate(),
    licenseExpiresAt: toInputDate(new Date(Date.now() + 15 * 86400000)),
  });

  const mutation = useMutation<AdminClinic, Error, void>({
    mutationFn: () =>
      adminApiService.createClinic({
        ...form,
        discountType: "PERCENTAGE",
        discountValue: 0,
        subscriptionStatus: "TRIAL",
        billingCycle: "MONTHLY",
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminClinics });
      showToast("Clínica criada com sucesso", "success");
      onOpenChange(false);
    },
    onError: (err) =>
      showToast(getErrorMessage(err, "Erro ao criar clínica"), "error"),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Nova clínica</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          <Field label="Nome fantasia" value={form.tradeName} onChange={(v) => setForm({ ...form, tradeName: v })} />
          <Field label="Razão social" value={form.legalName} onChange={(v) => setForm({ ...form, legalName: v })} />
          <Field label="CNPJ" value={form.cnpj} onChange={(v) => setForm({ ...form, cnpj: v })} />
          <Field label="E-mail" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
          <Field label="Telefone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
          <Field label="Responsável" value={form.responsibleName} onChange={(v) => setForm({ ...form, responsibleName: v })} />
          <div>
            <Label>Plano</Label>
            <Select value={form.planId} onValueChange={(v) => setForm({ ...form, planId: v })}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                {plans.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Field label="Início licença" type="date" value={form.licenseStartsAt} onChange={(v) => setForm({ ...form, licenseStartsAt: v })} />
          <Field label="Expira licença" type="date" value={form.licenseExpiresAt} onChange={(v) => setForm({ ...form, licenseExpiresAt: v })} />
          <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
            {mutation.isPending ? "Salvando..." : "Criar clínica"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
