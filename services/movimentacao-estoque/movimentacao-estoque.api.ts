import { api } from "@/lib/api"
import {
  MovimentacaoEstoqueListSchema,
  type MovimentacaoEstoque,
} from "./movimentacao-estoque.schemas"

export const movimentacaoEstoqueApi = {
  list: async (): Promise<MovimentacaoEstoque[]> => {
    const res = await api.get("/movimentacoes-estoque", {
      dataSchema: MovimentacaoEstoqueListSchema,
    })

    return res.data ?? []
  },
}
