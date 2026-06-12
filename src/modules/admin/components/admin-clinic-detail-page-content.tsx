"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { AdminShell } from "@/components/layout/admin-shell";
import { ErrorState, LoadingState } from "@/components/shared/query-states";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { ADMIN_ROUTES } from "@/constants/admin-routes";
import { QUERY_KEYS } from "@/constants/api";
import { AdminClinicUsersTab } from "@/modules/admin/components/admin-clinic-users-tab";
import { adminApiService } from "@/modules/admin/services/admin-api.service";
import {
  formatCnpj,
  formatCurrency,
  formatDate,
  formatDateTime,
  toInputDate,
} from "@/modules/admin/utils/format";
import { getErrorMessage } from "@/services/api-error";
import { useToastStore } from "@/stores/toast-store";
import { useAdminAuthStore } from "@/stores/admin-auth-store";
import type { AdminClinic, AdminInvoice, AdminSubscription, ClinicStatus } from "@/types/admin";

const TABS = [
  "overview",
  "users",
  "license",
  "billing",
  "notes",
] as const;

type Tab = (typeof TABS)[number];

const TAB_LABELS: Record<Tab, string> = {
  overview: "Visão geral",
  users: "Usuários",
  license: "Licença",
  billing: "Faturamento",
  notes: "Observações",
};

export function AdminClinicDetailPageContent({ clinicId }: { clinicId: string }) {
  const [tab, setTab] = useState<Tab>("overview");
  const canManage = useAdminAuthStore((s) => s.user?.role) === "SUPER_ADMIN";

  const { data: clinic, isLoading, isError, error } = useQuery({
    queryKey: QUERY_KEYS.adminClinic(clinicId),
    queryFn: () => adminApiService.getClinic(clinicId),
  });

  const { data: users } = useQuery({
    queryKey: QUERY_KEYS.adminClinicUsers(clinicId),
    queryFn: () => adminApiService.listClinicUsers(clinicId),
    enabled: tab === "users",
  });

  const { data: invoices } = useQuery({
    queryKey: QUERY_KEYS.adminClinicInvoices(clinicId),
    queryFn: () => adminApiService.listInvoices(clinicId),
    enabled: tab === "billing",
  });

  const { data: plans } = useQuery({
    queryKey: QUERY_KEYS.adminPlans,
    queryFn: () => adminApiService.listPlans(),
    enabled: tab === "license",
  });

  if (isLoading) {
    return (
      <AdminShell title="Clínica" description="Carregando...">
        <LoadingState message="Carregando clínica..." />
      </AdminShell>
    );
  }

  if (isError || !clinic) {
    return (
      <AdminShell title="Clínica" description="Erro">
        <ErrorState message={getErrorMessage(error, "Clínica não encontrada.")} />
      </AdminShell>
    );
  }

  return (
    <AdminShell title={clinic.tradeName} description="Detalhes da clínica / tenant">
      <Button variant="ghost" size="sm" className="mb-4" asChild>
        <Link href={ADMIN_ROUTES.clinics}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Link>
      </Button>

      <div className="mb-4 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <Button
            key={t}
            variant={tab === t ? "default" : "outline"}
            size="sm"
            onClick={() => setTab(t)}
          >
            {TAB_LABELS[t]}
          </Button>
        ))}
      </div>

      {tab === "overview" && <OverviewTab clinic={clinic} canManage={canManage} />}
      {tab === "users" && (
        <AdminClinicUsersTab
          clinicId={clinicId}
          users={users ?? []}
          canManage={canManage}
        />
      )}
      {tab === "license" && (
        <LicenseTab
          clinicId={clinicId}
          subscription={clinic.subscription}
          plans={plans ?? []}
          canManage={canManage}
        />
      )}
      {tab === "billing" && (
        <BillingTab
          clinicId={clinicId}
          subscriptionId={clinic.subscription?.id}
          invoices={invoices ?? []}
          canManage={canManage}
        />
      )}
      {tab === "notes" && (
        <NotesTab clinicId={clinicId} notes={clinic.internalNotes} canManage={canManage} />
      )}
    </AdminShell>
  );
}

function OverviewTab({
  clinic,
  canManage,
}: {
  clinic: NonNullable<Awaited<ReturnType<typeof adminApiService.getClinic>>>;
  canManage: boolean;
}) {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.showToast);

  const statusMutation = useMutation<
    { id: string; status: ClinicStatus },
    Error,
    "ACTIVE" | "INACTIVE" | "SUSPENDED"
  >({
    mutationFn: (status) =>
      adminApiService.updateClinicStatus(clinic.id, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminClinic(clinic.id) });
      showToast("Status atualizado", "success");
    },
  });

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader><CardTitle>Dados cadastrais</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><strong>CNPJ:</strong> {formatCnpj(clinic.cnpj)}</p>
          <p><strong>Razão social:</strong> {clinic.legalName}</p>
          <p><strong>E-mail:</strong> {clinic.email ?? "—"}</p>
          <p><strong>Telefone:</strong> {clinic.phone ?? "—"}</p>
          <p><strong>Responsável:</strong> {clinic.responsibleName ?? "—"}</p>
          <p><strong>Status:</strong> {clinic.status}</p>
          <p><strong>Último acesso:</strong> {formatDateTime(clinic.lastAccessAt)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Licença e uso</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><strong>Plano:</strong> {clinic.subscription?.planName ?? "—"}</p>
          <p><strong>Dias restantes:</strong> {clinic.subscription?.daysRemaining ?? "—"}</p>
          <p><strong>Valor final:</strong> {clinic.subscription ? formatCurrency(clinic.subscription.finalPrice) : "—"}</p>
          <p><strong>Usuários:</strong> {clinic.userCount}</p>
          <p><strong>Pacientes:</strong> {clinic.patientCount}</p>
          <p><strong>Terapeutas:</strong> {clinic.therapistCount}</p>
          {canManage && (
            <div className="flex flex-wrap gap-2 pt-2">
              {(["ACTIVE", "INACTIVE", "SUSPENDED"] as const).map((s) => (
                <Button key={s} size="sm" variant="outline" onClick={() => statusMutation.mutate(s)}>
                  {s}
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function LicenseTab({
  clinicId,
  subscription,
  plans,
  canManage,
}: {
  clinicId: string;
  subscription: Awaited<ReturnType<typeof adminApiService.getClinic>>["subscription"];
  plans: { id: string; name: string }[];
  canManage: boolean;
}) {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.showToast);
  const [form, setForm] = useState({
    planId: subscription?.planId ?? "",
    expiresAt: toInputDate(subscription?.expiresAt),
    billingCycle: subscription?.billingCycle ?? "MONTHLY",
    discountType: subscription?.discountType ?? "NONE",
    discountValue: String(subscription?.discountValue ?? 0),
  });

  const saveMutation = useMutation<AdminSubscription, Error, void>({
    mutationFn: () =>
      adminApiService.updateSubscription(clinicId, {
        planId: form.planId,
        expiresAt: form.expiresAt,
        billingCycle: form.billingCycle as "MONTHLY" | "YEARLY",
        discountType: form.discountType as "NONE" | "PERCENTAGE" | "FIXED",
        discountValue: Number(form.discountValue),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminClinic(clinicId) });
      showToast("Licença atualizada", "success");
    },
    onError: (err) => showToast(getErrorMessage(err, "Erro"), "error"),
  });

  const renewMutation = useMutation<AdminSubscription, Error, void>({
    mutationFn: () => adminApiService.renewSubscription(clinicId, { status: "ACTIVE" }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminClinic(clinicId) });
      showToast("Licença renovada", "success");
    },
  });

  if (!subscription) return <p className="text-muted-foreground">Sem licença vinculada.</p>;

  return (
    <Card>
      <CardHeader><CardTitle>Licença atual</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm">Status: <Badge>{subscription.status}</Badge></p>
        <p className="text-sm">Início: {formatDate(subscription.startsAt)}</p>
        <p className="text-sm">Expira: {formatDate(subscription.expiresAt)} ({subscription.daysRemaining} dias)</p>
        <p className="text-sm">Base: {formatCurrency(subscription.basePrice)} → Final: {formatCurrency(subscription.finalPrice)}</p>
        {canManage && (
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <Label>Plano</Label>
              <Select value={form.planId} onValueChange={(v) => setForm({ ...form, planId: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {plans.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Expira em</Label>
              <Input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
            </div>
            <div>
              <Label>Desconto (%)</Label>
              <Input value={form.discountValue} onChange={(e) => setForm({ ...form, discountType: "PERCENTAGE", discountValue: e.target.value })} />
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={() => saveMutation.mutate()}>Salvar licença</Button>
              <Button variant="outline" onClick={() => renewMutation.mutate()}>Renovar</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function BillingTab({
  clinicId,
  subscriptionId,
  invoices,
  canManage,
}: {
  clinicId: string;
  subscriptionId?: string;
  invoices: Awaited<ReturnType<typeof adminApiService.listInvoices>>;
  canManage: boolean;
}) {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.showToast);
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState(toInputDate(new Date(Date.now() + 7 * 86400000)));

  const createMutation = useMutation<AdminInvoice, Error, void>({
    mutationFn: () =>
      adminApiService.createInvoice(clinicId, {
        subscriptionId,
        amount: Number(amount),
        dueDate,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminClinicInvoices(clinicId) });
      showToast("Fatura criada", "success");
    },
  });

  const payMutation = useMutation<AdminInvoice, Error, string>({
    mutationFn: (id: string) => adminApiService.markInvoicePaid(id, { paymentMethod: "Manual" }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminClinicInvoices(clinicId) });
      showToast("Fatura paga", "success");
    },
  });

  const cancelMutation = useMutation<AdminInvoice, Error, string>({
    mutationFn: (id: string) => adminApiService.cancelInvoice(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminClinicInvoices(clinicId) });
      showToast("Fatura cancelada", "success");
    },
  });

  return (
    <div className="space-y-4">
      {canManage && (
        <Card>
          <CardHeader><CardTitle>Nova fatura manual</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Input placeholder="Valor" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-32" />
            <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-40" />
            <Button onClick={() => createMutation.mutate()}>Criar fatura</Button>
          </CardContent>
        </Card>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Referência</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((inv) => (
            <TableRow key={inv.id}>
              <TableCell>{inv.reference ?? inv.id.slice(0, 8)}</TableCell>
              <TableCell>{formatCurrency(inv.finalAmount)}</TableCell>
              <TableCell>{formatDate(inv.dueDate)}</TableCell>
              <TableCell><Badge variant={inv.status === "PAID" ? "default" : "secondary"}>{inv.status}</Badge></TableCell>
              <TableCell className="space-x-2">
                {canManage && inv.status === "PENDING" && (
                  <Button size="sm" onClick={() => payMutation.mutate(inv.id)}>Marcar pago</Button>
                )}
                {canManage && inv.status !== "PAID" && inv.status !== "CANCELED" && (
                  <Button size="sm" variant="outline" onClick={() => cancelMutation.mutate(inv.id)}>Cancelar</Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function NotesTab({
  clinicId,
  notes,
  canManage,
}: {
  clinicId: string;
  notes: string | null | undefined;
  canManage: boolean;
}) {
  const [value, setValue] = useState(notes ?? "");
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.showToast);

  const mutation = useMutation<AdminClinic, Error, void>({
    mutationFn: () => adminApiService.updateClinic(clinicId, { internalNotes: value }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminClinic(clinicId) });
      showToast("Observações salvas", "success");
    },
  });

  return (
    <Card>
      <CardHeader><CardTitle>Observações internas</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <Textarea rows={6} value={value} onChange={(e) => setValue(e.target.value)} disabled={!canManage} />
        {canManage && <Button onClick={() => mutation.mutate()}>Salvar observações</Button>}
      </CardContent>
    </Card>
  );
}
