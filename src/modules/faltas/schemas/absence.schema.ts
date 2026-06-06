import { z } from "zod";

export const absenceSchema = z.object({
  type: z.enum(["patient", "therapist"], {
    required_error: "Selecione o tipo da falta",
  }),
  date: z.string().min(1, "Data é obrigatória"),
  name: z.string().min(2, "Informe o nome"),
  reason: z.string().min(2, "Informe o motivo"),
  notes: z.string().optional(),
});

export type AbsenceFormValues = z.infer<typeof absenceSchema>;
