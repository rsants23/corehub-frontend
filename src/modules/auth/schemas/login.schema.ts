import { z } from "zod";

function stripCnpj(value: string): string {
  return value.replace(/\D/g, "");
}

export const loginSchema = z.object({
  cnpj: z
    .string()
    .min(1, "CNPJ é obrigatório")
    .refine((v) => stripCnpj(v).length === 14, "CNPJ deve ter 14 dígitos"),
  email: z
    .string()
    .min(1, "E-mail é obrigatório")
    .email("Informe um e-mail válido"),
  password: z
    .string()
    .min(6, "A senha deve ter no mínimo 6 caracteres"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export function normalizeCnpj(cnpj: string): string {
  return stripCnpj(cnpj);
}

export function formatCnpj(cnpj: string): string {
  const digits = stripCnpj(cnpj);
  if (digits.length !== 14) return cnpj;
  return digits.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    "$1.$2.$3/$4-$5",
  );
}
