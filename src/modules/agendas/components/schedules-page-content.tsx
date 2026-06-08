"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ErrorState, LoadingState } from "@/components/shared/query-states";
import { PageHeader } from "@/components/shared/page-header";
import { AppointmentsList } from "@/modules/agendas/components/appointments-list";
import { FixedScheduleFormDialog } from "@/modules/agendas/components/fixed-schedule-form-dialog";
import type { FixedScheduleFormValues } from "@/modules/agendas/schemas/fixed-schedule.schema";
import { useFixedSchedules, useScheduleMutations } from "@/hooks/use-schedules";
import { usePatients } from "@/hooks/use-patients";
import { useTherapists } from "@/hooks/use-therapists";
import { useSettings } from "@/hooks/use-settings";
import { getTodayDate } from "@/utils/date";
import { useToastStore } from "@/stores/toast-store";
import { HttpError } from "@/services/http-client";
import { Button } from "@/components/ui/button";
import type { Appointment } from "@/types";

export function SchedulesPageContent() {
  const showToast = useToastStore((state) => state.showToast);
  const { data: schedules, isLoading, isError, error } = useFixedSchedules();
  const { data: patients } = usePatients();
  const { data: therapists } = useTherapists();
  const { therapyTypes } = useSettings();
  const { createFixed, updateFixed, removeFixed, generateDaily } =
    useScheduleMutations();
  const today = getTodayDate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Appointment | null>(
    null,
  );

  const activePatients = (patients ?? []).filter((p) => p.status === "active");
  const activeTherapists = (therapists ?? []).filter(
    (t) => t.status === "active",
  );

  const handleGenerateDaily = async () => {
    try {
      await generateDaily.mutateAsync(today);
      showToast("Agenda diária gerada");
    } catch (err) {
      showToast(
        err instanceof HttpError ? err.message : "Erro ao gerar agenda diária",
      );
    }
  };

  const handleSave = async (values: FixedScheduleFormValues) => {
    const payload = {
      patientId: values.patientId,
      therapistId: values.therapistId,
      therapyTypeId: values.therapyTypeId,
      dayOfWeek: values.dayOfWeek,
      startTime: values.startTime,
      durationMinutes: values.durationMinutes,
      notes: values.notes || undefined,
    };

    try {
      if (editingSchedule) {
        await updateFixed.mutateAsync({
          id: editingSchedule.id,
          payload,
        });
        showToast("Horário fixo atualizado");
      } else {
        await createFixed.mutateAsync(payload);
        showToast("Horário fixo cadastrado");
      }
      setEditingSchedule(null);
      setDialogOpen(false);
    } catch (err) {
      showToast(
        err instanceof HttpError ? err.message : "Erro ao salvar horário fixo",
      );
    }
  };

  const handleRemove = async (schedule: Appointment) => {
    try {
      await removeFixed.mutateAsync(schedule.id);
      showToast("Horário fixo removido");
    } catch (err) {
      showToast(
        err instanceof HttpError ? err.message : "Erro ao remover horário fixo",
      );
    }
  };

  const isSaving =
    createFixed.isPending || updateFixed.isPending || removeFixed.isPending;

  return (
    <AppShell
      title="Agendas"
      description="Horários fixos e geração da agenda diária"
    >
      <PageHeader>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => {
              setEditingSchedule(null);
              setDialogOpen(true);
            }}
          >
            Novo horário fixo
          </Button>
          <Button
            variant="outline"
            onClick={handleGenerateDaily}
            disabled={generateDaily.isPending}
          >
            {generateDaily.isPending ? "Gerando..." : "Gerar agenda de hoje"}
          </Button>
        </div>
      </PageHeader>
      {isLoading && <LoadingState />}
      {isError && (
        <ErrorState
          message={
            error instanceof HttpError
              ? error.message
              : "Erro ao carregar agendas fixas."
          }
        />
      )}
      {schedules && (
        <>
          {schedules.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhum horário fixo cadastrado. Clique em &quot;Novo horário
              fixo&quot; para começar.
            </p>
          ) : (
            <AppointmentsList
              appointments={schedules}
              onEdit={(schedule) => {
                setEditingSchedule(schedule);
                setDialogOpen(true);
              }}
              onRemove={handleRemove}
            />
          )}
        </>
      )}
      <FixedScheduleFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        schedule={editingSchedule}
        patients={activePatients}
        therapists={activeTherapists}
        therapyTypes={therapyTypes.data ?? []}
        onSubmit={handleSave}
        isSubmitting={isSaving}
      />
    </AppShell>
  );
}
