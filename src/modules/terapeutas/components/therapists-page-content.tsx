"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ErrorState } from "@/components/shared/query-states";
import { TableSkeleton } from "@/components/shared/skeletons";
import { PageHeader } from "@/components/shared/page-header";
import { TherapistFormDialog } from "@/modules/terapeutas/components/therapist-form-dialog";
import { TherapistsTable } from "@/modules/terapeutas/components/therapists-table";
import type { TherapistFormValues } from "@/modules/terapeutas/schemas/therapist.schema";
import {
  useTherapistMutations,
  useTherapists,
} from "@/hooks/use-therapists";
import { getErrorMessage } from "@/services/api-error";
import { useToastStore } from "@/stores/toast-store";
import type { Therapist } from "@/types";

export function TherapistsPageContent() {
  const showToast = useToastStore((state) => state.showToast);
  const { data: therapists, isLoading, isError, error } = useTherapists();
  const { create, update, remove } = useTherapistMutations();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTherapist, setEditingTherapist] = useState<Therapist | null>(
    null,
  );
  const [therapistToRemove, setTherapistToRemove] = useState<Therapist | null>(
    null,
  );

  const handleSave = async (values: TherapistFormValues) => {
    try {
      const payload = {
        name: values.name,
        email: values.email || undefined,
        phone: values.phone || undefined,
        active: values.status === "active",
      };

      if (editingTherapist) {
        await update.mutateAsync({ id: editingTherapist.id, payload });
        showToast("Terapeuta atualizado com sucesso");
      } else {
        await create.mutateAsync({
          name: values.name,
          email: values.email || undefined,
          phone: values.phone || undefined,
        });
        showToast("Terapeuta cadastrado com sucesso");
      }
      setEditingTherapist(null);
      setDialogOpen(false);
    } catch (err) {
      showToast(getErrorMessage(err, "Erro ao salvar terapeuta"), "error");
    }
  };

  const handleConfirmRemove = async () => {
    if (!therapistToRemove) return;

    try {
      await remove.mutateAsync(therapistToRemove.id);
      showToast("Terapeuta desativado com sucesso");
      setTherapistToRemove(null);
    } catch (err) {
      showToast(getErrorMessage(err, "Erro ao desativar terapeuta"), "error");
    }
  };

  return (
    <AppShell title="Terapeutas" description="Equipe terapêutica e carga horária">
      <PageHeader
        actionLabel="Novo terapeuta"
        onAction={() => {
          setEditingTherapist(null);
          setDialogOpen(true);
        }}
      />
      {isLoading && <TableSkeleton rows={6} columns={5} />}
      {isError && (
        <ErrorState
          message={getErrorMessage(
            error,
            "Não foi possível carregar terapeutas da API.",
          )}
        />
      )}
      {therapists && (
        <TherapistsTable
          data={therapists}
          onView={(t) =>
            showToast(`${t.name} — ${t.specialty} (${t.weeklyHours}h/semana)`)
          }
          onEdit={(t) => {
            setEditingTherapist(t);
            setDialogOpen(true);
          }}
          onRemove={(t) => setTherapistToRemove(t)}
        />
      )}
      <TherapistFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        therapist={editingTherapist}
        onSubmit={handleSave}
        isSubmitting={create.isPending || update.isPending}
      />
      <ConfirmDialog
        open={Boolean(therapistToRemove)}
        onOpenChange={(open) => !open && setTherapistToRemove(null)}
        title="Desativar terapeuta"
        description={
          therapistToRemove
            ? `Deseja desativar "${therapistToRemove.name}"? O registro permanecerá no sistema, mas ficará inativo.`
            : ""
        }
        confirmLabel="Desativar"
        isLoading={remove.isPending}
        onConfirm={handleConfirmRemove}
      />
    </AppShell>
  );
}
