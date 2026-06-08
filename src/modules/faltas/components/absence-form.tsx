"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  absenceSchema,
  type AbsenceFormValues,
} from "@/modules/faltas/schemas/absence.schema";
import { getTodayDate } from "@/utils/date";
import type { Appointment, Therapist } from "@/types";

interface AbsenceFormProps {
  therapists: Therapist[];
  appointments: Appointment[];
  onRegister: (values: AbsenceFormValues) => Promise<void>;
  isSubmitting?: boolean;
}

export function AbsenceForm({
  therapists,
  appointments,
  onRegister,
  isSubmitting,
}: AbsenceFormProps) {
  const form = useForm<AbsenceFormValues>({
    resolver: zodResolver(absenceSchema),
    defaultValues: {
      type: "therapist",
      date: getTodayDate(),
      therapistId: "",
      appointmentId: "",
      reason: "",
      notes: "",
    },
  });

  const absenceType = form.watch("type");

  const onSubmit = async (values: AbsenceFormValues) => {
    await onRegister(values);
    form.reset({
      type: "therapist",
      date: getTodayDate(),
      therapistId: "",
      appointmentId: "",
      reason: "",
      notes: "",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Registrar falta</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 md:grid-cols-2"
          >
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo da falta</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="patient">Paciente</SelectItem>
                      <SelectItem value="therapist">Terapeuta</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {absenceType === "therapist" ? (
              <FormField
                control={form.control}
                name="therapistId"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Terapeuta</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o terapeuta" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {therapists.map((t) => (
                          <SelectItem key={t.id} value={t.id}>
                            {t.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="appointmentId"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Atendimento do dia</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o atendimento" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {appointments.length === 0 ? (
                          <SelectItem value="none" disabled>
                            Gere a agenda do dia primeiro
                          </SelectItem>
                        ) : (
                          appointments.map((a) => (
                            <SelectItem key={a.id} value={a.id}>
                              {a.patientName} — {a.therapyType} ({a.startTime})
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex.: Doença, consulta médica..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Opcional" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="md:col-span-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Registrando..." : "Registrar falta"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
