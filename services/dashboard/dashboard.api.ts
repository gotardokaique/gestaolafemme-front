import { api } from "@/lib/api"
import { DashboardSchema, type Dashboard } from "./dashboard.schemas"

export const dashboardApi = {
  get: async (): Promise<Dashboard> => {
    const res = await api.get("/dashboard", {
      dataSchema: DashboardSchema,
    })
    return res.data!
  },
}
