"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ErrorState } from "@/components/shared/query-states";
import { CardListSkeleton } from "@/components/shared/skeletons";
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
import { getErrorMessage } from "@/services/api-error";
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
  const [scheduleToRemove, setScheduleToRemove] = useState<Appointment | null>(
    null,
  );

  const activePatients = (patients ?? []).filter((p) => p.status === "active");
  const activeTherapists = (therapists ?? []).filter(
    (t) => t.status === "active",
  );

  const handleGenerateDaily = async () => {
    try {
      await generateDaily.mutateAsync(today);
      showToast("Agenda diária gerada com sucesso");
    } catch (err) {
      showToast(getErrorMessage(err, "Erro ao gerar agenda diária"));
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
        showToast("Horário fixo atualizado com sucesso");
      } else {
        await createFixed.mutateAsync(payload);
        showToast("Horário fixo cadastrado com sucesso");
      }
      setEditingSchedule(null);
      setDialogOpen(false);
    } catch (err) {
      showToast(getErrorMessage(err, "Erro ao salvar horário fixo"));
    }
  };

  const handleConfirmRemove = async () => {
    if (!scheduleToRemove) return;

    try {
      await removeFixed.mutateAsync(scheduleToRemove.id);
      showToast("Horário fixo removido com sucesso");
      setScheduleToRemove(null);
    } catch (err) {
      showToast(getErrorMessage(err, "Erro ao remover horário fixo"));
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
      {isLoading && <CardListSkeleton count={4} />}
      {isError && (
        <ErrorState
          message={getErrorMessage(
            error,
            "Erro ao carregar agendas fixas.",
          )}
        />
      )}
      {schedules && (
        <>
          {schedules.length === 0 ? (
            <div className="rounded-xl border border-dashed bg-muted/30 p-8 text-center">
              <p className="text-sm font-medium">Nenhum horário fixo cadastrado</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Clique em &quot;Novo horário fixo&quot; para começar a montar a
                grade semanal.
              </p>
            </div>
          ) : (
            <AppointmentsList
              appointments={schedules}
              onEdit={(schedule) => {
                setEditingSchedule(schedule);
                setDialogOpen(true);
              }}
              onRemove={(schedule) => setScheduleToRemove(schedule)}
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
      <ConfirmDialog
        open={Boolean(scheduleToRemove)}
        onOpenChange={(open) => !open && setScheduleToRemove(null)}
        title="Remover horário fixo"
        description={
          scheduleToRemove
            ? `Deseja remover o horário de ${scheduleToRemove.patientName} com ${scheduleToRemove.therapistName}?`
            : ""
        }
        confirmLabel="Remover"
        isLoading={removeFixed.isPending}
        onConfirm={handleConfirmRemove}
      />
    </AppShell>
  );
}
