"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Power } from "lucide-react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { QUERY_KEYS } from "@/constants/api";
import { adminApiService } from "@/modules/admin/services/admin-api.service";
import { formatCurrency } from "@/modules/admin/utils/format";
import { getErrorMessage } from "@/services/api-error";
import { useToastStore } from "@/stores/toast-store";
import { useAdminAuthStore } from "@/stores/admin-auth-store";
import type { AdminPlan } from "@/types/admin";

type PlanForm = {
  name: string;
  description: string;
  monthlyPrice: string;
  annualPrice: string;
  maxPatients: string;
  maxTherapists: string;
  maxUsers: string;
  storageLimit: string;
  features: string;
};

const emptyForm: PlanForm = {
  name: "",
  description: "",
  monthlyPrice: "0",
  annualPrice: "0",
  maxPatients: "50",
  maxTherapists: "10",
  maxUsers: "5",
  storageLimit: "5120",
  features: "agenda,pacientes",
};

function planToForm(plan: AdminPlan): PlanForm {
  return {
    name: plan.name,
    description: plan.description ?? "",
    monthlyPrice: String(plan.monthlyPrice),
    annualPrice: String(plan.annualPrice),
    maxPatients: String(plan.maxPatients ?? ""),
    maxTherapists: String(plan.maxTherapists ?? ""),
    maxUsers: String(plan.maxUsers ?? ""),
    storageLimit: String(plan.storageLimit ?? ""),
    features: plan.features.join(","),
  };
}

function formToPayload(form: PlanForm) {
  return {
    name: form.name,
    description: form.description || undefined,
    monthlyPrice: Number(form.monthlyPrice),
    annualPrice: Number(form.annualPrice),
    maxPatients: form.maxPatients ? Number(form.maxPatients) : undefined,
    maxTherapists: form.maxTherapists ? Number(form.maxTherapists) : undefined,
    maxUsers: form.maxUsers ? Number(form.maxUsers) : undefined,
    storageLimit: form.storageLimit ? Number(form.storageLimit) : undefined,
    features: form.features
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean),
  };
}

export function AdminPlansPageContent() {
  const [createOpen, setCreateOpen] = useState(false);
  const [editPlan, setEditPlan] = useState<AdminPlan | null>(null);
  const canManage = useAdminAuthStore((s) => s.user?.role) === "SUPER_ADMIN";
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.showToast);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: QUERY_KEYS.adminPlans,
    queryFn: () => adminApiService.listPlans(),
  });

  const deactivateMutation = useMutation({
    mutationFn: (id: string) => adminApiService.deactivatePlan(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminPlans });
      showToast("Plano desativado", "success");
    },
    onError: (err) => showToast(getErrorMessage(err, "Erro"), "error"),
  });

  return (
    <AdminShell title="Planos" description="Catálogo de planos e limites SaaS">
      {canManage && (
        <div className="mb-4 flex justify-end">
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo plano
          </Button>
        </div>
      )}
      {isLoading && <LoadingState message="Carregando planos..." />}
      {isError && <ErrorState message={getErrorMessage(error, "Erro ao carregar planos.")} />}
      {data && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Mensal</TableHead>
              <TableHead>Anual</TableHead>
              <TableHead>Limites</TableHead>
              <TableHead>Storage (MB)</TableHead>
              <TableHead>Features</TableHead>
              <TableHead>Status</TableHead>
              {canManage && <TableHead>Ações</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell className="font-medium">{plan.name}</TableCell>
                <TableCell>{formatCurrency(plan.monthlyPrice)}</TableCell>
                <TableCell>{formatCurrency(plan.annualPrice)}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {plan.maxUsers ?? "∞"} usr · {plan.maxPatients ?? "∞"} pac · {plan.maxTherapists ?? "∞"} ter
                </TableCell>
                <TableCell>{plan.storageLimit ?? "∞"}</TableCell>
                <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                  {plan.features.join(", ") || "—"}
                </TableCell>
                <TableCell>
                  <Badge variant={plan.isActive ? "default" : "secondary"}>
                    {plan.isActive ? "Ativo" : "Inativo"}
                  </Badge>
                </TableCell>
                {canManage && (
                  <TableCell className="space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditPlan(plan)}
                      aria-label="Editar plano"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    {plan.isActive && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deactivateMutation.mutate(plan.id)}
                        aria-label="Desativar plano"
                      >
                        <Power className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {canManage && (
        <>
          <PlanFormDialog
            open={createOpen}
            onOpenChange={setCreateOpen}
            title="Novo plano"
            initial={emptyForm}
            onSubmit={(payload) => adminApiService.createPlan(payload)}
          />
          {editPlan && (
            <PlanFormDialog
              open={Boolean(editPlan)}
              onOpenChange={(v) => !v && setEditPlan(null)}
              title={`Editar: ${editPlan.name}`}
              initial={planToForm(editPlan)}
              onSubmit={(payload) => adminApiService.updatePlan(editPlan.id, payload)}
            />
          )}
        </>
      )}
    </AdminShell>
  );
}

function PlanFormDialog({
  open,
  onOpenChange,
  title,
  initial,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  initial: PlanForm;
  onSubmit: (payload: ReturnType<typeof formToPayload>) => Promise<AdminPlan>;
}) {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.showToast);
  const [form, setForm] = useState(initial);

  const mutation = useMutation({
    mutationFn: () => onSubmit(formToPayload(form)),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminPlans });
      showToast("Plano salvo", "success");
      onOpenChange(false);
    },
    onError: (err) => showToast(getErrorMessage(err, "Erro"), "error"),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader>
        <div className="grid gap-3">
          {(
            [
              ["name", "Nome"],
              ["description", "Descrição"],
              ["monthlyPrice", "Valor mensal"],
              ["annualPrice", "Valor anual"],
              ["maxPatients", "Max pacientes"],
              ["maxTherapists", "Max terapeutas"],
              ["maxUsers", "Max usuários"],
              ["storageLimit", "Storage limit (MB)"],
              ["features", "Features (vírgula)"],
            ] as const
          ).map(([key, label]) => (
            <div key={key}>
              <Label>{label}</Label>
              <Input
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              />
            </div>
          ))}
          <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
            Salvar plano
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
