import { api } from "@/lib/api"
import { UserMeSchema, type UserMe } from "./user.schemas"

export const userApi = {
  getMe: async (): Promise<UserMe> => {
    const res = await api.get("/users/me", {
      dataSchema: UserMeSchema,
    })
    return res.data!
  },
}
