import { z } from "zod"
import { api } from "@/lib/api"
import {
  CategoriaProdutoListSchema,
  type CategoriaProdutoCreateDTO,
  type CategoriaProdutoUpdateDTO,
  type CategoriaProduto,
} from "./categoria-produto.schemas"

const EmptyDataSchema = z.any()

type ListArgs = {
  ativo?: boolean
  filterParams?: URLSearchParams | null
}

function extractF(filterParams?: URLSearchParams | null): string[] {
  if (!filterParams) return []
  return filterParams.getAll("f").filter(Boolean).map(String)
}

export const categoriaProdutoApi = {
  list: async ({ ativo, filterParams }: ListArgs = {}): Promise<CategoriaProduto[]> => {
    const f = extractF(filterParams)

    const res = await api.get("/categorias-produto", {
      params: {
        ...(ativo !== undefined ? { ativo } : {}),
        ...(f.length ? { f } : {}),
      },
      dataSchema: CategoriaProdutoListSchema,
    })

    return res.data ?? []
  },

  create: async (dto: CategoriaProdutoCreateDTO) => {
    const res = await api.post("/categorias-produto", {
      dataSchema: EmptyDataSchema,
      body: {
        nome: dto.nome,
        descricao: dto.descricao?.trim() || null,
        ativo: dto.ativo ?? true,
      },
    })
    return res
  },

  update: async (id: number, dto: CategoriaProdutoUpdateDTO) => {
    const res = await api.put(`/categorias-produto/${id}`, {
      dataSchema: EmptyDataSchema,
      body: {
        nome: dto.nome,
        descricao: dto.descricao?.trim() || null,
        ativo: dto.ativo ?? true,
      },
    })
    return res
  },

  toggleStatus: async (id: number, ativo: boolean) => {
    const res = await api.patch(`/categorias-produto/${id}/status`, {
      dataSchema: EmptyDataSchema,
      params: { ativo },
    })
    return res
  },

  delete: async (id: number) => {
    const res = await api.delete(`/categorias-produto/${id}`, {
      dataSchema: EmptyDataSchema,
    })
    return res
  },
}
