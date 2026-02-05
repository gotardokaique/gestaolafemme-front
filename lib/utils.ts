import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPhoneBR(value: string | number | null | undefined): string {
  if (!value) return "-"

  const str = String(value).replace(/\D/g, "")

  if (str.length === 0) return "-"

  if (str.length <= 10) {
    // (XX) XXXX-XXXX
    return str.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3")
  }

  // (XX) XXXXX-XXXX
  return str.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
}
export function formatCpfCnpj(value: string | number | null | undefined): string {
  if (!value) return "-"

  const str = String(value).replace(/\D/g, "")

  if (str.length === 0) return "-"

  if (str.length <= 11) {
    // CPF: XXX.XXX.XXX-XX
    return str.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
  }

  // CNPJ: XX.XXX.XXX/XXXX-XX
  return str.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
}

export function formatCurrency(value: number | string | null | undefined): string {
  if (value === null || value === undefined) return "R$ 0,00"
  const amount = typeof value === "string" ? parseFloat(value) : value
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount)
}

export function formatDateBR(date: Date | string | null | undefined): string {
  if (!date) return "-"
  const d = typeof date === "string" ? new Date(date) : date
  return new Intl.DateTimeFormat("pt-BR").format(d)
}