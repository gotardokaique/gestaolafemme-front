import { z } from "zod"

export const UserMeSchema = z.object({
  id: z.number(),
  nome: z.string(),
  email: z.string(),
  unidadeId: z.number().nullable(),
  unidadeNome: z.string().nullable(),
  perfilId: z.number().nullable(),
  perfilNome: z.string().nullable(),
  perfilDescricao: z.string().nullable(),
})

export const UsuarioUnidadeSchema = z.object({
  id: z.number(),
  nome: z.string(),
  email: z.string(),
  dataCriacao: z.string(),
  perfilNome: z.string(),
  perfilDescricao: z.string(),
  ativo: z.boolean(),
})

export const CriarUsuarioSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório").trim(),
  email: z.string().min(1, "Email é obrigatório").email("Email inválido").trim(),
})

export const CriarUnidadeSchema = z.object({
  nomeUnidade: z.string().min(1, "Nome da unidade é obrigatório").trim(),
  nomeUsuario: z.string().min(1, "Nome do usuário é obrigatório").trim(),
  email: z.string().min(1, "Email é obrigatório").email("Email inválido").trim(),
})

export const EmailConfigSchema = z.object({
  emailRemetente: z.string().min(1, "Informe o e-mail remetente").email("Email inválido").trim(),
  emailSenhaApp: z.string().optional(),
})

export type UserMe = z.infer<typeof UserMeSchema>
export type UsuarioUnidade = z.infer<typeof UsuarioUnidadeSchema>
export type CriarUsuarioForm = z.infer<typeof CriarUsuarioSchema>
export type CriarUnidadeForm = z.infer<typeof CriarUnidadeSchema>
export type EmailConfigForm = z.infer<typeof EmailConfigSchema>

export type MercadoPagoConfig = {
  conectado: boolean
  tipoPagamento?: "CHECKOUT" | "PIX"
}
