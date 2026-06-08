import { z } from "zod";

export const therapistSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  phone: z.string().optional(),
  status: z.enum(["active", "inactive"]),
});

export type TherapistFormValues = z.infer<typeof therapistSchema>;
