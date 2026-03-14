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
import { Building, Mail, User, UserCheck, UserCog, Settings2, UserPlus, Users, Key, Webhook, Trash2, Eye, EyeOff, Send, Info } from "lucide-react"

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



  const [usuarios, setUsuarios] = React.useState<UsuarioUnidade[]>([])
  const [loadingUsuarios, setLoadingUsuarios] = React.useState(true)

  const [apiToken, setApiToken] = React.useState<string | null>(null)
  const [gerandoToken, setGerandoToken] = React.useState(false)
  const [showToken, setShowToken] = React.useState(false)
  const [openRevogarToken, setOpenRevogarToken] = React.useState(false)

  // --- Email Config ---
  const [emailRemetente, setEmailRemetente] = React.useState("")
  const [emailSenhaApp, setEmailSenhaApp] = React.useState("")
  const [showEmailSenha, setShowEmailSenha] = React.useState(false)
  const [salvandoEmail, setSalvandoEmail] = React.useState(false)

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

        try {
          const resToken = await api.get("/configuracao/token")
          if (!mounted) return
          const dataToken = resToken.data as { token?: string } | undefined
          if (resToken.success && dataToken?.token) {
            setApiToken(dataToken.token)
          }
        } catch (e: any) {
        }

        try {
          const resEmail = await api.get("/configuracao/email")
          if (!mounted) return
          const dataEmail = resEmail.data as { emailRemetente?: string } | undefined
          if (resEmail.success && dataEmail?.emailRemetente) {
            setEmailRemetente(dataEmail.emailRemetente)
          }
        } catch (e: any) {
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

      if (res.success) {
        setOpenCriarUsuario(false)
        setNovoUsuarioNome("")
        setNovoUsuarioEmail("")
        toast.success("Usuário criado! As credenciais de acesso foram enviadas ao e-mail cadastrado.")

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

  const maskToken = (token: string) => {
    if (!token || token.length < 12) return token
    return `${token.substring(0, 8)}...${token.substring(token.length - 4)}`
  }

  const handleGerarToken = async () => {
    setGerandoToken(true)
    try {
      const res = await api.post("/configuracao/token")
      const dataToken = res.data as { token?: string } | undefined
      if (res.success && dataToken?.token) {
        setApiToken(dataToken.token)
        toast.success("API Token gerado com sucesso!")
        setShowToken(true)
      } else {
        toast.error(res.message || "Erro ao gerar token")
      }
    } catch (e: any) {
      toast.error("Erro ao gerar token")
    } finally {
      setGerandoToken(false)
    }
  }

  const handleRevogarToken = async () => {
    try {
      await api.delete("/configuracao/token")
      setApiToken(null)
      setShowToken(false)
      setOpenRevogarToken(false)
      toast.success("Token revogado com sucesso!")
    } catch (e: any) {
      toast.error("Erro ao revogar token")
    }
  }

  const copyToken = () => {
    if (!apiToken) return
    navigator.clipboard.writeText(apiToken)
    toast.success("Token copiado para a área de transferência!")
  }

  const handleSalvarEmailConfig = async () => {
    if (!emailRemetente.trim()) {
      toast.error("Informe o e-mail remetente")
      return
    }
    setSalvandoEmail(true)
    try {
      const res = await api.put("/configuracao/email", {
        body: {
          emailRemetente: emailRemetente.trim(),
          emailSenhaApp: emailSenhaApp,
        },
      })
      if (res.success) {
        toast.success("Configurações de e-mail salvas com sucesso!")
        setEmailSenhaApp("")
      } else {
        toast.error(res.message || "Erro ao salvar configurações de e-mail")
      }
    } catch (e: any) {
      toast.error(e?.message ?? "Erro ao salvar configurações de e-mail")
    } finally {
      setSalvandoEmail(false)
    }
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

        <Card className="transition-smooth lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-responsive-lg">
              <Webhook className="h-4 w-4 sm:h-5 sm:w-5" />
              Integração API Pública
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="text-sm text-muted-foreground">
                Gere um token de API para integrar serviços externos e automatizar suas operações. 
                O token identifica as requisições como sendo do seu usuário e unidade.
              </div>

              {!apiToken ? (
                <div className="flex items-center justify-center p-6 border rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer" onClick={handleGerarToken}>
                  <div className="flex flex-col items-center gap-2 text-primary">
                    <Key className="h-8 w-8" />
                    <span className="font-semibold text-sm">{gerandoToken ? "Gerando..." : "Gerar API Key"}</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Label>Token de Acesso</Label>
                  <div className="flex gap-2 items-center">
                    <div className="relative flex-1">
                      <Input 
                        value={showToken ? apiToken : maskToken(apiToken)} 
                        readOnly 
                        className="font-mono pr-10 bg-accent/30"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full hover:bg-transparent"
                        onClick={() => setShowToken(!showToken)}
                      >
                        {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <Button variant="secondary" onClick={copyToken}>
                      <Copy className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Copiar</span>
                    </Button>
                    <Button variant="destructive" onClick={() => setOpenRevogarToken(true)}>
                      <Trash2 className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Revogar</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Seção: Configurações de E-mail */}
      <Card className="transition-smooth">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-responsive-lg">
            <Send className="h-4 w-4 sm:h-5 sm:w-5" />
            Configurações de E-mail
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-5">
            <div className="text-sm text-muted-foreground">
              Configure o e-mail remetente usado para envio de notificações e comunicações automáticas do sistema.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* E-mail remetente */}
              <div className="grid gap-2">
                <Label htmlFor="email-remetente" className="text-xs sm:text-sm">
                  <Mail className="inline-block h-4 w-4 mr-1" />
                  E-mail remetente
                </Label>
                <Input
                  id="email-remetente"
                  type="email"
                  placeholder="seuemail@gmail.com"
                  value={emailRemetente}
                  onChange={(e) => setEmailRemetente(e.target.value)}
                  disabled={salvandoEmail}
                  className="text-xs sm:text-sm"
                />
              </div>

              {/* Senha de app */}
              <div className="grid gap-2">
                <Label htmlFor="email-senha-app" className="text-xs sm:text-sm">
                  <Key className="inline-block h-4 w-4 mr-1" />
                  Senha de app
                </Label>
                <div className="relative">
                  <Input
                    id="email-senha-app"
                    type={showEmailSenha ? "text" : "password"}
                    placeholder="xxxx xxxx xxxx xxxx"
                    value={emailSenhaApp}
                    onChange={(e) => setEmailSenhaApp(e.target.value)}
                    disabled={salvandoEmail}
                    className="text-xs sm:text-sm pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full hover:bg-transparent"
                    onClick={() => setShowEmailSenha(!showEmailSenha)}
                    tabIndex={-1}
                  >
                    {showEmailSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>

            {/* Texto explicativo */}
            <div className="rounded-md border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 p-4 flex gap-3">
              <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800 dark:text-blue-200 flex flex-col gap-1">
                <span className="font-semibold">O que é a senha de app?</span>
                <span>
                  É uma senha gerada pelo Google para aplicativos. Sua senha normal do Gmail <strong>não funciona</strong> aqui.
                </span>
                <span>
                  Para gerar: acesse{" "}
                  <a
                    href="https://myaccount.google.com/security"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-medium hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    myaccount.google.com
                  </a>
                  {" "}→ Segurança → Verificação em duas etapas → Senhas de app → Selecione{" "}
                  <strong>"Outro"</strong> e gere.
                </span>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleSalvarEmailConfig}
                disabled={salvandoEmail}
                className="w-full sm:w-auto"
              >
                <Send className="h-4 w-4 mr-2" />
                {salvandoEmail ? "Salvando..." : "Salvar configurações de e-mail"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={openCriarUsuario} onOpenChange={setOpenCriarUsuario}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Novo Usuário</DialogTitle>
            <DialogDescription>
              Preencha os dados do novo usuário. Uma senha temporária será gerada e enviada automaticamente para o e-mail informado.
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



      <Dialog open={openRevogarToken} onOpenChange={setOpenRevogarToken}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revogar API Key</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja revogar este token? Qualquer integração ou aplicativo usando esta chave perderá acesso imediatamente. Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenRevogarToken(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleRevogarToken}>
              Sim, Revogar Token
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
