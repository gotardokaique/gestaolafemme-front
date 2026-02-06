import { z } from "zod"

export const DashboardSchema = z.object({
  saldoAtual: z.number(),
  totalVendasMes: z.number(),
  valorTotalVendasMes: z.number(),
  totalComprasMes: z.number(),
  valorTotalComprasMes: z.number(),
})

export type Dashboard = z.infer<typeof DashboardSchema>
