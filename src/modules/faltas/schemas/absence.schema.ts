import { z } from "zod";

export const absenceSchema = z
  .object({
    type: z.enum(["patient", "therapist"], {
      required_error: "Selecione o tipo da falta",
    }),
    date: z.string().min(1, "Data é obrigatória"),
    therapistId: z.string().optional(),
    appointmentId: z.string().optional(),
    reason: z.string().min(2, "Informe o motivo"),
    notes: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "therapist" && !data.therapistId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Selecione o terapeuta",
        path: ["therapistId"],
      });
    }
    if (data.type === "patient" && !data.appointmentId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Selecione o atendimento",
        path: ["appointmentId"],
      });
    }
  });

export type AbsenceFormValues = z.infer<typeof absenceSchema>;
