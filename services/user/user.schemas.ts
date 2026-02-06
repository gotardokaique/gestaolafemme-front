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

export type UserMe = z.infer<typeof UserMeSchema>
