"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ErrorState } from "@/components/shared/query-states";
import { TableSkeleton } from "@/components/shared/skeletons";
import { PageHeader } from "@/components/shared/page-header";
import { PatientFormDialog } from "@/modules/pacientes/components/patient-form-dialog";
import { PatientsTable } from "@/modules/pacientes/components/patients-table";
import type { PatientFormValues } from "@/modules/pacientes/schemas/patient.schema";
import { usePatientMutations, usePatients } from "@/hooks/use-patients";
import { getErrorMessage } from "@/services/api-error";
import { useToastStore } from "@/stores/toast-store";
import type { Patient } from "@/types";

export function PatientsPageContent() {
  const showToast = useToastStore((state) => state.showToast);
  const { data: patients, isLoading, isError, error } = usePatients();
  const { create, update, remove } = usePatientMutations();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [patientToRemove, setPatientToRemove] = useState<Patient | null>(null);

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
        showToast("Paciente atualizado com sucesso");
      } else {
        await create.mutateAsync({
          name: values.name,
          birthDate: values.birthDate || undefined,
          notes: values.notes || undefined,
        });
        showToast("Paciente cadastrado com sucesso");
      }
      setEditingPatient(null);
      setDialogOpen(false);
    } catch (err) {
      showToast(getErrorMessage(err, "Erro ao salvar paciente"));
    }
  };

  const handleConfirmRemove = async () => {
    if (!patientToRemove) return;

    try {
      await remove.mutateAsync(patientToRemove.id);
      showToast("Paciente desativado com sucesso");
      setPatientToRemove(null);
    } catch (err) {
      showToast(getErrorMessage(err, "Erro ao desativar paciente"));
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
      {isLoading && <TableSkeleton rows={6} columns={5} />}
      {isError && (
        <ErrorState
          message={getErrorMessage(
            error,
            "Não foi possível carregar pacientes da API.",
          )}
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
          onRemove={(p) => setPatientToRemove(p)}
        />
      )}
      <PatientFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        patient={editingPatient}
        onSubmit={handleSave}
        isSubmitting={create.isPending || update.isPending}
      />
      <ConfirmDialog
        open={Boolean(patientToRemove)}
        onOpenChange={(open) => !open && setPatientToRemove(null)}
        title="Desativar paciente"
        description={
          patientToRemove
            ? `Deseja desativar o paciente "${patientToRemove.name}"? O registro permanecerá no sistema, mas ficará inativo.`
            : ""
        }
        confirmLabel="Desativar"
        isLoading={remove.isPending}
        onConfirm={handleConfirmRemove}
      />
    </AppShell>
  );
}
