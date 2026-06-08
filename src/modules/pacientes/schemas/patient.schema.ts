import { z } from "zod";

export const patientSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  birthDate: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(["active", "inactive"]),
});

export type PatientFormValues = z.infer<typeof patientSchema>;
