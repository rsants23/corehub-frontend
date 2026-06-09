"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

export function AdminPlansPageContent() {
  const [open, setOpen] = useState(false);
  const canManage = useAdminAuthStore((s) => s.user?.role) === "SUPER_ADMIN";
  const { data, isLoading, isError, error } = useQuery({
    queryKey: QUERY_KEYS.adminPlans,
    queryFn: () => adminApiService.listPlans(),
  });

  return (
    <AdminShell title="Planos" description="Catálogo de planos e limites SaaS">
      {canManage && (
        <div className="mb-4 flex justify-end">
          <Button onClick={() => setOpen(true)}>
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
              <TableHead>Status</TableHead>
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
                <TableCell>
                  <Badge variant={plan.isActive ? "default" : "secondary"}>
                    {plan.isActive ? "Ativo" : "Inativo"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {canManage && <CreatePlanDialog open={open} onOpenChange={setOpen} />}
    </AdminShell>
  );
}

function CreatePlanDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.showToast);
  const [form, setForm] = useState({
    name: "",
    description: "",
    monthlyPrice: "0",
    annualPrice: "0",
    maxPatients: "50",
    maxTherapists: "10",
    maxUsers: "5",
  });

  const mutation = useMutation({
    mutationFn: () =>
      adminApiService.createPlan({
        name: form.name,
        description: form.description,
        monthlyPrice: Number(form.monthlyPrice),
        annualPrice: Number(form.annualPrice),
        maxPatients: Number(form.maxPatients),
        maxTherapists: Number(form.maxTherapists),
        maxUsers: Number(form.maxUsers),
        isActive: true,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminPlans });
      showToast("Plano criado", "success");
      onOpenChange(false);
    },
    onError: (err) => showToast(getErrorMessage(err, "Erro"), "error"),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Novo plano</DialogTitle></DialogHeader>
        <div className="grid gap-3">
          {(["name", "description", "monthlyPrice", "annualPrice", "maxPatients", "maxTherapists", "maxUsers"] as const).map((key) => (
            <div key={key}>
              <Label>{key}</Label>
              <Input
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              />
            </div>
          ))}
          <Button onClick={() => mutation.mutate()}>Salvar plano</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
