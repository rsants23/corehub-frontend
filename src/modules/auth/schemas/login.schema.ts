import { z } from "zod";

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, "Usuário ou e-mail é obrigatório"),
  password: z
    .string()
    .min(6, "A senha deve ter no mínimo 6 caracteres"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

function stripCnpj(value: string): string {
  return value.replace(/\D/g, "");
}

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
