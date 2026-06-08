"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  fixedScheduleSchema,
  type FixedScheduleFormValues,
} from "@/modules/agendas/schemas/fixed-schedule.schema";
import { formatDayOfWeek } from "@/utils/format";
import { WEEKDAYS } from "@/utils/date";
import type { Appointment, Patient, Therapist, TherapyType } from "@/types";

interface FixedScheduleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schedule?: Appointment | null;
  patients: Patient[];
  therapists: Therapist[];
  therapyTypes: TherapyType[];
  onSubmit: (values: FixedScheduleFormValues) => void;
  isSubmitting?: boolean;
}

export function FixedScheduleFormDialog({
  open,
  onOpenChange,
  schedule,
  patients,
  therapists,
  therapyTypes,
  onSubmit,
  isSubmitting,
}: FixedScheduleFormDialogProps) {
  const form = useForm<FixedScheduleFormValues>({
    resolver: zodResolver(fixedScheduleSchema),
    defaultValues: {
      patientId: "",
      therapistId: "",
      therapyTypeId: "",
      dayOfWeek: "MONDAY",
      startTime: "09:00",
      durationMinutes: 50,
      notes: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        patientId: schedule?.patientId ?? "",
        therapistId: schedule?.therapistId ?? "",
        therapyTypeId: schedule?.therapyTypeId ?? "",
        dayOfWeek:
          (schedule?.dayOfWeek as FixedScheduleFormValues["dayOfWeek"]) ??
          "MONDAY",
        startTime: schedule?.startTime?.slice(0, 5) ?? "09:00",
        durationMinutes: schedule?.durationMinutes ?? 50,
        notes: schedule?.notes ?? "",
      });
    }
  }, [open, schedule, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {schedule ? "Editar horário fixo" : "Novo horário fixo"}
          </DialogTitle>
          <DialogDescription>
            Defina paciente, terapeuta, dia e horário da sessão semanal.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="patientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Paciente</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o paciente" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="therapistId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Terapeuta</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o terapeuta" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {therapists.map((therapist) => (
                        <SelectItem key={therapist.id} value={therapist.id}>
                          {therapist.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="therapyTypeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de terapia</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {therapyTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dayOfWeek"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dia da semana</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o dia" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {WEEKDAYS.map((day) => (
                        <SelectItem key={day} value={day}>
                          {formatDayOfWeek(day)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Início</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="durationMinutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duração (min)</FormLabel>
                    <FormControl>
                      <Input type="number" min={15} step={5} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea rows={2} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : schedule ? "Salvar" : "Cadastrar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
