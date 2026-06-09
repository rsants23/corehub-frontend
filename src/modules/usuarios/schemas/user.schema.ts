import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(2, "Informe o nome"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(8, "Senha temporária com mínimo de 8 caracteres"),
  role: z.enum(["ADMIN", "COORDINATOR", "RECEPTION", "THERAPIST"]),
  therapistId: z.string().optional(),
});

export type UserFormValues = z.infer<typeof userSchema>;
