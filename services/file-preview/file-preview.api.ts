import { api } from "@/lib/api"
import {
  FilePreviewSchema,
  FotoCatalogoListSchema,
  type FilePreviewData,
  type FotoCatalogoData,
} from "./file-preview.schemas"

// Schema opcional que aceita undefined/null
const OptionalFilePreviewSchema = FilePreviewSchema.optional().nullable()

/**
 * API para buscar previews de arquivos de diversas entidades.
 * SOMENTE LEITURA - operações de escrita devem ser feitas nos serviços específicos.
 * Os endpoints retornam dados em Base64 para exibição no frontend.
 */
export const filePreviewApi = {
  /**
   * Busca a foto de um produto pelo ID.
   * Retorna null se não houver foto.
   */
  getProdutoFoto: async (produtoId: number): Promise<FilePreviewData | null> => {
    try {
      const res = await api.get(`/file-preview/produtos/${produtoId}`, {
        dataSchema: OptionalFilePreviewSchema,
      })
      if (!res.data) return null
      return res.data
    } catch (error: any) {
      console.warn(`Erro ao buscar foto do produto ${produtoId}:`, error?.message)
      return null
    }
  },

  /**
   * Lista todas as fotos do catálogo de um produto.
   */
  getProdutoCatalogo: async (produtoId: number): Promise<FotoCatalogoData[]> => {
    try {
      const res = await api.get(`/file-preview/produtos/${produtoId}/catalogo`, {
        dataSchema: FotoCatalogoListSchema,
      })
      return res.data ?? []
    } catch (error: any) {
      console.warn(`Erro ao buscar catálogo do produto ${produtoId}:`, error?.message)
      return []
    }
  },

  /**
   * Busca a foto de um usuário pelo ID.
   * Retorna null se não houver foto.
   */
  getUsuarioFoto: async (usuarioId: number): Promise<FilePreviewData | null> => {
    try {
      const res = await api.get(`/file-preview/usuarios/${usuarioId}`, {
        dataSchema: OptionalFilePreviewSchema,
      })
      if (!res.data) return null
      return res.data
    } catch (error: any) {
      console.warn(`Erro ao buscar foto do usuário ${usuarioId}:`, error?.message)
      return null
    }
  },

  /**
   * Busca a foto de uma unidade pelo ID.
   * Retorna null se não houver foto.
   */
  getUnidadeFoto: async (unidadeId: number): Promise<FilePreviewData | null> => {
    try {
      const res = await api.get(`/file-preview/unidades/${unidadeId}`, {
        dataSchema: OptionalFilePreviewSchema,
      })
      if (!res.data) return null
      return res.data
    } catch (error: any) {
      console.warn(`Erro ao buscar foto da unidade ${unidadeId}:`, error?.message)
      return null
    }
  },
}

