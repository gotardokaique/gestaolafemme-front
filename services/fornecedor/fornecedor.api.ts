import { z } from "zod"
import { api } from "@/lib/api"
import {
  FornecedorListSchema,
  type FornecedorCreateDTO,
  type FornecedorUpdateDTO,
  type Fornecedor,
} from "./fornecedor.schemas"

const EmptyDataSchema = z.any()

type ListArgs = {
  ativo?: boolean
  filterParams?: URLSearchParams | null
}

function extractF(filterParams?: URLSearchParams | null): string[] {
  if (!filterParams) return []
  return filterParams.getAll("f").filter(Boolean).map(String)
}

export const fornecedorApi = {
  list: async ({ ativo, filterParams }: ListArgs = {}): Promise<Fornecedor[]> => {
    const f = extractF(filterParams)

    const res = await api.get("/fornecedores", {
      params: {
        ...(ativo !== undefined ? { ativo } : {}),
        ...(f.length ? { f } : {}), // <- manda f como array => f=...&f=...
      },
      dataSchema: FornecedorListSchema,
    })

    return res.data ?? []
  },

  create: async (dto: FornecedorCreateDTO) => {
    const res = await api.post("/fornecedores", {
      dataSchema: EmptyDataSchema,
      body: {
        nome: dto.nome,
        telefone: dto.telefone?.trim() || null,
        email: dto.email?.trim() || null,
        ativo: dto.ativo ?? true,
      },
    })
    return res
  },

  update: async (id: number, dto: FornecedorUpdateDTO) => {
    const res = await api.put(`/fornecedores/${id}`, {
      dataSchema: EmptyDataSchema,
      body: {
        nome: dto.nome,
        telefone: dto.telefone?.trim() || null,
        email: dto.email?.trim() || null,
        ativo: dto.ativo ?? true,
      },
    })
    return res
  },
}
