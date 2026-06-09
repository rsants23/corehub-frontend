import { z } from "zod";

export const consentSchema = z.object({
  patientId: z.string().min(1, "Selecione o paciente"),
  guardianName: z.string().min(2, "Informe o responsável"),
  purpose: z.string().min(2, "Informe a finalidade do consentimento"),
  version: z.string().min(1, "Informe a versão do termo"),
});

export type ConsentFormValues = z.infer<typeof consentSchema>;
