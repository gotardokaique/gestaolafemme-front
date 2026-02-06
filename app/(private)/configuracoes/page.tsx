"use client"

import * as React from "react"
import { z } from "zod"
import { toast } from "@/components/ui/sonner"
import { ModeToggle } from "@/components/mode-togle"
import { api } from "@/lib/api"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, Mail, User, UserCheck, UserCog, Settings2 } from "lucide-react"

const UserMeSchema = z.object({
  id: z.number(),
  nome: z.string(),
  email: z.string(),
  unidadeId: z.number().nullable(),
  unidadeNome: z.string().nullable(),
  perfilId: z.number().nullable(),
  perfilNome: z.string().nullable(),
  perfilDescricao: z.string().nullable(),
})

type UserMe = z.infer<typeof UserMeSchema>

export default function ConfiguracoesPage() {
  const [loading, setLoading] = React.useState(true)
  const [me, setMe] = React.useState<UserMe | null>(null)

  React.useEffect(() => {
    let mounted = true
      ; (async () => {
        setLoading(true)
        try {
          const res = await api.get("/users/me", { dataSchema: UserMeSchema })
          if (!mounted) return
          setMe(res.data ?? null)
        } catch (e: any) {
          if (!mounted) return
          toast.error(e?.message ?? "Não foi possível carregar configurações.")
          setMe(null)
        } finally {
          if (!mounted) return
          setLoading(false)
        }
      })()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className=" gap-6">
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-slate-500/10 text-slate-500">
            <Settings2 className="h-5 w-5" />
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="text-2xl font-semibold">Configurações</div>
            <div className="text-muted-foreground text-sm">
              Gerencie seus dados de acesso e preferências.
            </div>
          </div>
        </div>
      </div>

      <Card className="mt-4">
        <CardContent

          className="static w-[420px] max-w-none border-l"
        >
          <CardHeader className="px-0 pt-0">
            <CardTitle>Geral</CardTitle>
          </CardHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label><Mail className="inline-block h-4 w-4" /> Email  </Label>

              <Input value={me?.email ?? (loading ? "Carregando..." : "")} readOnly />
            </div>

            <div className="grid gap-2">
              <Label><User className="inline-block h-4 w-4" /> Nome  </Label>
              <Input value={me?.nome ?? (loading ? "Carregando..." : "")} readOnly />
            </div>

            <div className="grid gap-2">
              <Label><Building className="inline-block h-4 w-4" /> Unidade  </Label>
              <Input value={me?.unidadeNome ?? (loading ? "Carregando..." : "")} readOnly />
            </div>

            <div className="grid gap-2">
              <Label><UserCheck className="inline-block h-4 w-4" /> Perfil  </Label>
              <Input value={me?.perfilNome ?? (loading ? "Carregando..." : "")} readOnly />
            </div>

            <div className="grid gap-2">
              <Label><UserCog className="inline-block h-4 w-4" /> Descrição do perfil  </Label>
              <Input value={me?.perfilDescricao ?? (loading ? "Carregando..." : "")} readOnly />
            </div>

            <div className="flex items-center justify-between rounded-md border p-3">
              <div className="flex flex-col">
                <div className="text-sm font-medium">Tema</div>
                <div className="text-muted-foreground text-xs">
                  Trocar tema do sistema
                </div>
              </div>
              <ModeToggle />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
