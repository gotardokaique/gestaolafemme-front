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

/**
 * Aplica máscara de telefone brasileiro em tempo real (para inputs).
 * Aceita telefones com 10 ou 11 dígitos.
 * Formato: (XX) XXXX-XXXX ou (XX) XXXXX-XXXX
 * 
 * @param value - Valor do input
 * @returns Valor formatado com máscara
 */
export function maskPhone(value: string): string {
  // Remove tudo que não é dígito
  const numbers = value.replace(/\D/g, "")
  
  // Limita a 11 dígitos
  const limited = numbers.substring(0, 11)
  
  // Aplica a máscara progressivamente
  if (limited.length <= 2) {
    return limited
  }
  
  if (limited.length <= 6) {
    // (XX) XXXX
    return `(${limited.substring(0, 2)}) ${limited.substring(2)}`
  }
  
  if (limited.length <= 10) {
    // (XX) XXXX-XXXX
    return `(${limited.substring(0, 2)}) ${limited.substring(2, 6)}-${limited.substring(6)}`
  }
  
  // (XX) XXXXX-XXXX
  return `(${limited.substring(0, 2)}) ${limited.substring(2, 7)}-${limited.substring(7)}`
}

/**
 * Remove a máscara do telefone, retornando apenas os dígitos.
 * 
 * @param value - Telefone com ou sem máscara
 * @returns Apenas os dígitos do telefone
 */
export function unmaskPhone(value: string): string {
  return value.replace(/\D/g, "")
}