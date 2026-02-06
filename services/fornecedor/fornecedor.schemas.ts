import { z } from "zod"

export const FornecedorSchema = z.object({
  id: z.number(),
  nome: z.string(),
  telefone: z.string().nullable(),
  email: z.string().nullable(),
  ativo: z.boolean(),
})

export type Fornecedor = z.infer<typeof FornecedorSchema>

export const FornecedorListSchema = z.array(FornecedorSchema)

export const FornecedorCreateSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  telefone: z.string().optional().nullable(),
  email: z.string().email("Email inválido").optional().nullable().or(z.literal("")),
  ativo: z.boolean().optional(),
})

export type FornecedorCreateDTO = z.infer<typeof FornecedorCreateSchema>

export const FornecedorUpdateSchema = FornecedorCreateSchema.extend({
})

export type FornecedorUpdateDTO = z.infer<typeof FornecedorUpdateSchema>
