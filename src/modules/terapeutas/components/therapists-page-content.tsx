"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ErrorState, LoadingState } from "@/components/shared/query-states";
import { PageHeader } from "@/components/shared/page-header";
import { TherapistFormDialog } from "@/modules/terapeutas/components/therapist-form-dialog";
import { TherapistsTable } from "@/modules/terapeutas/components/therapists-table";
import type { TherapistFormValues } from "@/modules/terapeutas/schemas/therapist.schema";
import {
  useTherapistMutations,
  useTherapists,
} from "@/hooks/use-therapists";
import { HttpError } from "@/services/http-client";
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
        showToast("Terapeuta atualizado na API");
      } else {
        await create.mutateAsync({
          name: values.name,
          email: values.email || undefined,
          phone: values.phone || undefined,
        });
        showToast("Terapeuta cadastrado na API");
      }
      setEditingTherapist(null);
      setDialogOpen(false);
    } catch (err) {
      showToast(
        err instanceof HttpError ? err.message : "Erro ao salvar terapeuta",
      );
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
      {isLoading && <LoadingState />}
      {isError && (
        <ErrorState
          message={
            error instanceof HttpError
              ? error.message
              : "Não foi possível carregar terapeutas da API."
          }
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
          onRemove={async (t) => {
            try {
              await remove.mutateAsync(t.id);
              showToast("Terapeuta desativado na API");
            } catch (err) {
              showToast(
                err instanceof HttpError
                  ? err.message
                  : "Erro ao desativar terapeuta",
              );
            }
          }}
        />
      )}
      <TherapistFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        therapist={editingTherapist}
        onSubmit={handleSave}
        isSubmitting={create.isPending || update.isPending}
      />
    </AppShell>
  );
}
