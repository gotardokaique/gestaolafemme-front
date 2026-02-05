import { api } from "@/lib/api"
import { FinanceiroResumoSchema, type FinanceiroResumo } from "./financeiro.schemas"

export type LancamentoFinanceiroRequest = {
  dataLancamento: string
  tipo: "ENTRADA" | "SAIDA"
  valor: number
  descricao: string
}

export const financeiroApi = {
  getResumo: async (): Promise<FinanceiroResumo> => {
    const res = await api.get("/financeiro/resumo", {
      dataSchema: FinanceiroResumoSchema,
    })
    return res.data!
  },

  create: async (dto: LancamentoFinanceiroRequest) => {
    const res = await api.post("/financeiro/lancamento", {
      body: {
        ...dto,
        dataLancamento: new Date(dto.dataLancamento).toISOString(),
      },
    })
    return res
  },
}
