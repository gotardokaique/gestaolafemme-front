import { z } from "zod"

export const FilePreviewSchema = z.object({
  nome: z.string(),
  mimeType: z.string(),
  arquivo: z.string(),
  tamanhoBytes: z.number().optional(),
})

export type FilePreviewData = z.infer<typeof FilePreviewSchema>

// Schema para foto de catálogo (inclui ID para poder remover)
export const FotoCatalogoSchema = z.object({
  id: z.number(),
  nome: z.string(),
  mimeType: z.string(),
  arquivo: z.string(),
  tamanhoBytes: z.number().optional(),
})

export type FotoCatalogoData = z.infer<typeof FotoCatalogoSchema>

// Schema para lista de fotos do catálogo
export const FotoCatalogoListSchema = z.array(FotoCatalogoSchema)

// DTO para adicionar foto ao catálogo
export type FotoCatalogoRequestDTO = {
  nome: string
  mimeType: string
  arquivo: string // Base64
}

