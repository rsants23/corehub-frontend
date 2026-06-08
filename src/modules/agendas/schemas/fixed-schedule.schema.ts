import { z } from "zod";

export const fixedScheduleSchema = z.object({
  patientId: z.string().min(1, "Selecione o paciente"),
  therapistId: z.string().min(1, "Selecione o terapeuta"),
  therapyTypeId: z.string().min(1, "Selecione o tipo de terapia"),
  dayOfWeek: z.enum([
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ]),
  startTime: z.string().min(1, "Informe o horário"),
  durationMinutes: z.coerce.number().min(15, "Mínimo 15 minutos"),
  notes: z.string().optional(),
});

export type FixedScheduleFormValues = z.infer<typeof fixedScheduleSchema>;
