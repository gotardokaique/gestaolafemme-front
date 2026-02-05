import { api } from "@/lib/api"
import {
  EstoqueListSchema,
  type Estoque,
  type EstoqueAjusteDTO,
} from "./estoque.schemas"
import { z } from "zod"

const EmptyDataSchema = z.any()

export const estoqueApi = {
  list: async (): Promise<Estoque[]> => {
    const res = await api.get("/estoque", {
      dataSchema: EstoqueListSchema,
    })

    return res.data ?? []
  },

  ajustar: async (productId: number, dto: EstoqueAjusteDTO) => {
    const res = await api.patch(`/estoque/ajuste/${productId}`, {
      dataSchema: EmptyDataSchema,
      body: dto,
    })
    return res
  },
}
