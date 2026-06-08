"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ErrorState, LoadingState } from "@/components/shared/query-states";
import { PageHeader } from "@/components/shared/page-header";
import { PatientFormDialog } from "@/modules/pacientes/components/patient-form-dialog";
import { PatientsTable } from "@/modules/pacientes/components/patients-table";
import type { PatientFormValues } from "@/modules/pacientes/schemas/patient.schema";
import { usePatientMutations, usePatients } from "@/hooks/use-patients";
import { HttpError } from "@/services/http-client";
import { useToastStore } from "@/stores/toast-store";
import type { Patient } from "@/types";

export function PatientsPageContent() {
  const showToast = useToastStore((state) => state.showToast);
  const { data: patients, isLoading, isError, error } = usePatients();
  const { create, update, remove } = usePatientMutations();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  const handleSave = async (values: PatientFormValues) => {
    try {
      const payload = {
        name: values.name,
        birthDate: values.birthDate || undefined,
        notes: values.notes || undefined,
        active: values.status === "active",
      };

      if (editingPatient) {
        await update.mutateAsync({ id: editingPatient.id, payload });
        showToast("Paciente atualizado na API");
      } else {
        await create.mutateAsync({
          name: values.name,
          birthDate: values.birthDate || undefined,
          notes: values.notes || undefined,
        });
        showToast("Paciente cadastrado na API");
      }
      setEditingPatient(null);
      setDialogOpen(false);
    } catch (err) {
      const message =
        err instanceof HttpError ? err.message : "Erro ao salvar paciente";
      showToast(message);
    }
  };

  const handleRemove = async (patient: Patient) => {
    try {
      await remove.mutateAsync(patient.id);
      showToast("Paciente desativado na API");
    } catch (err) {
      const message =
        err instanceof HttpError ? err.message : "Erro ao desativar paciente";
      showToast(message);
    }
  };

  return (
    <AppShell
      title="Pacientes"
      description="Cadastro e acompanhamento dos pacientes da clínica"
    >
      <PageHeader
        actionLabel="Novo paciente"
        onAction={() => {
          setEditingPatient(null);
          setDialogOpen(true);
        }}
      />
      {isLoading && <LoadingState />}
      {isError && (
        <ErrorState
          message={
            error instanceof HttpError
              ? error.message
              : "Não foi possível carregar pacientes da API."
          }
        />
      )}
      {patients && (
        <PatientsTable
          data={patients}
          onView={(p) => showToast(`${p.name} — ${p.notes ?? "Sem observações"}`)}
          onEdit={(p) => {
            setEditingPatient(p);
            setDialogOpen(true);
          }}
          onRemove={handleRemove}
        />
      )}
      <PatientFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        patient={editingPatient}
        onSubmit={handleSave}
        isSubmitting={create.isPending || update.isPending}
      />
    </AppShell>
  );
}
