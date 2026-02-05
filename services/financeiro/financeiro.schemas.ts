import { z } from "zod"

export const LancamentoFinanceiroSchema = z.object({
  id: z.number(),
  dataLancamento: z.string(),
  tipo: z.enum(["ENTRADA", "SAIDA"]),
  valor: z.number(),
  descricao: z.string(),
})

export type LancamentoFinanceiro = z.infer<typeof LancamentoFinanceiroSchema>

export const FinanceiroResumoSchema = z.object({
  saldoAtual: z.number(),
  totalEntradas: z.number(),
  totalSaidas: z.number(),
  lancamentos: z.array(LancamentoFinanceiroSchema),
})

export type FinanceiroResumo = z.infer<typeof FinanceiroResumoSchema>
