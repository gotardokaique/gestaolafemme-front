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