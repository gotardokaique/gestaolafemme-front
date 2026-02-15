"use client"

import * as React from "react"
import { z } from "zod"
import { toast } from "@/components/ui/sonner"
import { ModeToggle } from "@/components/mode-togle"
import { api } from "@/lib/api"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Building, Mail, User, UserCheck, UserCog, Settings2, UserPlus, Copy, CheckCircle2, Users } from "lucide-react"

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

const UsuarioUnidadeSchema = z.object({
  id: z.number(),
  nome: z.string(),
  email: z.string(),
  dataCriacao: z.string(),
  perfilNome: z.string(),
  perfilDescricao: z.string(),
  ativo: z.boolean(),
})

type UserMe = z.infer<typeof UserMeSchema>
type UsuarioUnidade = z.infer<typeof UsuarioUnidadeSchema>

export default function ConfiguracoesPage() {
  const [loading, setLoading] = React.useState(true)
  const [me, setMe] = React.useState<UserMe | null>(null)

  const [openCriarUsuario, setOpenCriarUsuario] = React.useState(false)
  const [criandoUsuario, setCriandoUsuario] = React.useState(false)
  const [novoUsuarioNome, setNovoUsuarioNome] = React.useState("")
  const [novoUsuarioEmail, setNovoUsuarioEmail] = React.useState("")

  const [showCredenciais, setShowCredenciais] = React.useState(false)
  const [credenciaisGeradas, setCredenciaisGeradas] = React.useState<{
    email: string
    senhaTemporaria: string
    mensagem: string
  } | null>(null)
  const [copiado, setCopiado] = React.useState(false)

  const [usuarios, setUsuarios] = React.useState<UsuarioUnidade[]>([])
  const [loadingUsuarios, setLoadingUsuarios] = React.useState(true)

  React.useEffect(() => {
    let mounted = true
      ; (async () => {
        setLoading(true)
        setLoadingUsuarios(true)
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

        try {
          const resUsuarios = await api.get("/users/usuarios-unidade")
          if (!mounted) return
          if (resUsuarios.success && resUsuarios.data) {
            setUsuarios(resUsuarios.data as UsuarioUnidade[])
          }
        } catch (e: any) {
          if (!mounted) return
        } finally {
          if (!mounted) return
          setLoadingUsuarios(false)
        }
      })()
    return () => {
      mounted = false
    }
  }, [])

  const handleCriarUsuario = async () => {
    if (!novoUsuarioNome.trim() || !novoUsuarioEmail.trim()) {
      toast.error("Preencha nome e email")
      return
    }

    setCriandoUsuario(true)
    try {
      const res = await api.post("/users/criar", {
        body: {
          nome: novoUsuarioNome.trim(),
          email: novoUsuarioEmail.trim(),
        },
      })

      if (res.success && res.data) {
        setCredenciaisGeradas(res.data as { email: string; senhaTemporaria: string; mensagem: string })
        setOpenCriarUsuario(false)
        setShowCredenciais(true)
        setNovoUsuarioNome("")
        setNovoUsuarioEmail("")
        toast.success("Usuário criado com sucesso!")

        try {
          const resUsuarios = await api.get("/users/usuarios-unidade")
          if (resUsuarios.success && resUsuarios.data) {
            setUsuarios(resUsuarios.data as UsuarioUnidade[])
          }
        } catch (e) {
        }
      } else {
        toast.error(res.message || "Erro ao criar usuário")
      }
    } catch (e: any) {
      toast.error(e?.message ?? "Erro ao criar usuário")
    } finally {
      setCriandoUsuario(false)
    }
  }

  const copiarCredenciais = () => {
    if (!credenciaisGeradas) return

    const texto = `Email: ${credenciaisGeradas.email}\nSenha Temporária: ${credenciaisGeradas.senhaTemporaria}\n\n${credenciaisGeradas.mensagem}`
    navigator.clipboard.writeText(texto)
    setCopiado(true)
    toast.success("Credenciais copiadas!")

    setTimeout(() => setCopiado(false), 2000)
  }

  const getInitials = (nome: string) => {
    const names = nome.trim().split(' ')
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
    }
    return nome.substring(0, 2).toUpperCase()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-slate-500/20 text-slate-600">
            <Settings2 className="h-5 w-5" />
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="text-responsive-2xl font-semibold">Configurações</div>
            <div className="text-muted-foreground text-responsive-sm">
              Gerencie seus dados de acesso e preferências.
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="transition-smooth">
          <CardContent className="pt-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-responsive-lg">Geral</CardTitle>
            </CardHeader>

            <div className="grid gap-3 sm:gap-4">
              <div className="grid gap-2">
                <Label className="text-xs sm:text-sm"><Mail className="inline-block h-4 w-4" /> Email  </Label>

                <Input value={me?.email ?? (loading ? "Carregando..." : "")} readOnly className="text-xs sm:text-sm" />
              </div>

              <div className="grid gap-2">
                <Label className="text-xs sm:text-sm"><User className="inline-block h-4 w-4" /> Nome  </Label>
                <Input value={me?.nome ?? (loading ? "Carregando..." : "")} readOnly className="text-xs sm:text-sm" />
              </div>

              <div className="grid gap-2">
                <Label className="text-xs sm:text-sm"><Building className="inline-block h-4 w-4" /> Unidade  </Label>
                <Input value={me?.unidadeNome ?? (loading ? "Carregando..." : "")} readOnly className="text-xs sm:text-sm" />
              </div>

              <div className="grid gap-2">
                <Label className="text-xs sm:text-sm"><UserCheck className="inline-block h-4 w-4" /> Perfil  </Label>
                <Input value={me?.perfilNome ?? (loading ? "Carregando..." : "")} readOnly className="text-xs sm:text-sm" />
              </div>

              <div className="grid gap-2">
                <Label className="text-xs sm:text-sm"><UserCog className="inline-block h-4 w-4" /> Descrição do perfil  </Label>
                <Input value={me?.perfilDescricao ?? (loading ? "Carregando..." : "")} readOnly className="text-xs sm:text-sm" />
              </div>

              <div className="flex items-center justify-between rounded-md border p-3">
                <div className="flex flex-col">
                  <div className="text-xs sm:text-sm font-medium">Tema</div>
                  <div className="text-muted-foreground text-[10px] sm:text-xs">
                    Trocar tema do sistema
                  </div>
                </div>
                <ModeToggle />
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-md border p-3 bg-primary/5 gap-2 sm:gap-0">
                <div className="flex flex-col">
                  <div className="text-xs sm:text-sm font-medium">Criar Novo Usuário</div>
                  <div className="text-muted-foreground text-[10px] sm:text-xs">
                    Gerar credenciais temporárias para um novo usuário
                  </div>
                </div>
                <Button onClick={() => setOpenCriarUsuario(true)} size="sm" className="w-full sm:w-auto text-xs sm:text-sm">
                  <UserPlus className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
                  Criar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-smooth">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-responsive-lg">
              <Users className="h-4 w-4 sm:h-5 sm:w-5" />
              Usuários da Unidade
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingUsuarios ? (
              <div className="text-center py-8 text-muted-foreground text-xs sm:text-sm">
                Carregando usuários...
              </div>
            ) : usuarios.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-xs sm:text-sm">
                Nenhum usuário encontrado
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {usuarios.map((usuario) => (
                  <div
                    key={usuario.id}
                    className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                      <AvatarFallback className="bg-blue-300/50 text-primary font-semibold text-xs sm:text-sm">
                        {getInitials(usuario.nome)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs sm:text-sm font-medium truncate">{usuario.nome}</p>
                        {!usuario.ativo && (
                          <Badge variant="secondary" className="text-[10px]">Inativo</Badge>
                        )}
                      </div>
                      <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{usuario.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-[10px]">
                          {usuario.perfilNome}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">
                          {formatDate(usuario.dataCriacao)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={openCriarUsuario} onOpenChange={setOpenCriarUsuario}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Novo Usuário</DialogTitle>
            <DialogDescription>
              Preencha os dados do novo usuário. Uma senha temporária será gerada automaticamente.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nome">Nome Completo</Label>
              <Input
                id="nome"
                placeholder="Ex: João Silva"
                value={novoUsuarioNome}
                onChange={(e) => setNovoUsuarioNome(e.target.value)}
                disabled={criandoUsuario}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Ex: joao@exemplo.com"
                value={novoUsuarioEmail}
                onChange={(e) => setNovoUsuarioEmail(e.target.value)}
                disabled={criandoUsuario}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenCriarUsuario(false)}
              disabled={criandoUsuario}
            >
              Cancelar
            </Button>
            <Button onClick={handleCriarUsuario} disabled={criandoUsuario}>
              {criandoUsuario ? "Criando..." : "Criar Usuário"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para exibir credenciais geradas */}
      <Dialog open={showCredenciais} onOpenChange={setShowCredenciais}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Usuário Criado com Sucesso!
            </DialogTitle>
            <DialogDescription>
              Copie as credenciais abaixo e envie de forma segura ao novo usuário.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Email</Label>
              <Input value={credenciaisGeradas?.email || ""} readOnly />
            </div>

            <div className="grid gap-2">
              <Label>Senha Temporária</Label>
              <Input
                value={credenciaisGeradas?.senhaTemporaria || ""}
                readOnly
                className="font-mono text-lg font-bold"
              />
            </div>

            <div className="rounded-md bg-amber-50 dark:bg-amber-950/20 p-3 border border-amber-200 dark:border-amber-900">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                {credenciaisGeradas?.mensagem}
              </p>
            </div>
          </div>

          <DialogFooter className="sm:justify-between">
            <Button
              type="button"
              variant="secondary"
              onClick={copiarCredenciais}
              className="gap-2"
            >
              {copiado ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copiar Credenciais
                </>
              )}
            </Button>
            <Button onClick={() => setShowCredenciais(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
