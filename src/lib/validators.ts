import { z } from "zod";

export function isValidCpf(raw: string): boolean {
  const cpf = raw.replace(/\D/g, "");
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;
  const digits = cpf.split("").map(Number);
  for (let i = 9; i < 11; i++) {
    let sum = 0;
    for (let j = 0; j < i; j++) sum += digits[j] * (i + 1 - j);
    const dv = ((sum * 10) % 11) % 10;
    if (dv !== digits[i]) return false;
  }
  return true;
}

export const customerSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome completo").max(120),
  email: z.string().trim().email("E-mail inválido").max(160),
  phone: z
    .string()
    .trim()
    .refine((v) => v.replace(/\D/g, "").length >= 10, "Telefone inválido"),
  cpf: z
    .string()
    .trim()
    .refine((v) => isValidCpf(v), "CPF inválido"),
});

export type CustomerData = z.infer<typeof customerSchema>;

export const cardSchema = z.object({
  number: z
    .string()
    .trim()
    .refine((v) => v.replace(/\D/g, "").length >= 13, "Número do cartão inválido"),
  holder: z.string().trim().min(2, "Nome impresso obrigatório").max(60),
  expiry: z
    .string()
    .trim()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Validade inválida (MM/AA)"),
  cvv: z
    .string()
    .trim()
    .regex(/^\d{3,4}$/, "CVV inválido"),
  installments: z.number().int().min(1).max(12),
});

export type CardData = z.infer<typeof cardSchema>;
