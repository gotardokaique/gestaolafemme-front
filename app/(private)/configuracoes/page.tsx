"use client"

import * as React from "react"
import { z } from "zod"
import toast from "react-hot-toast"
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
import { Building, Mail, User, UserCheck, UserCog, Settings2, UserPlus, Users, Key, Webhook, Trash2, Eye, EyeOff, Send, Info, Copy, CheckCircle2, CreditCard, ExternalLink, XCircle } from "lucide-react"
import { ModeToggle } from "@/components/mode-togle"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

function AlertasDeIntegração() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  React.useEffect(() => {
    const success = searchParams.get("success")
    const error = searchParams.get("error")

    if (success === "mp_connected") {
      toast.success("Mercado Pago conectado com sucesso!")
      router.replace(pathname)
    } else if (error) {
      toast.error(`Erro ao conectar: ${error}`)
      router.replace(pathname)
    }
  }, [searchParams, router, pathname])

  return null // Este componente não renderiza nada visualmente
}

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

  const [criandoUnidade, setCriandoUnidade] = React.useState(false)
  const [novaUnidadeNome, setNovaUnidadeNome] = React.useState("")
  const [novaUnidadeEmail, setNovaUnidadeEmail] = React.useState("")
  const [novaUnidadePlano, setNovaUnidadePlano] = React.useState("BASICO")

  const [apiToken, setApiToken] = React.useState<string | null>(null)
  const [gerandoToken, setGerandoToken] = React.useState(false)
  const [showToken, setShowToken] = React.useState(false)
  const [openRevogarToken, setOpenRevogarToken] = React.useState(false)

  const [emailRemetente, setEmailRemetente] = React.useState("")
  const [emailSenhaApp, setEmailSenhaApp] = React.useState("")
  const [showEmailSenha, setShowEmailSenha] = React.useState(false)
  const [salvandoEmail, setSalvandoEmail] = React.useState(false)
  const [hasSenhaApp, setHasSenhaApp] = React.useState(false)
  const [mpConfig, setMpConfig] = React.useState<{ conectado: boolean, tipoPagamento?: "CHECKOUT" | "PIX" } | null>(null)
  const [salvandoTipoPagamento, setSalvandoTipoPagamento] = React.useState(false)

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
          const dataEmail = resEmail.data as { emailRemetente?: string, hasSenhaApp?: boolean } | undefined
          if (resEmail.success && dataEmail) {
            setEmailRemetente(dataEmail.emailRemetente || "")
            setHasSenhaApp(!!dataEmail.hasSenhaApp)
          }
        } catch (e: any) {
        }

        try {
          const resMp = await api.get("/configuracao/mercado-pago")
          if (!mounted) return
          if (resMp.success && resMp.data) {
            setMpConfig(resMp.data as any)
          }
        } catch (e: any) {
        }
      })()

    return () => {
      mounted = false
    }
  }, [api])

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

  const handleCriarUnidade = async () => {
    if (novaUnidadeNome.trim() === "" || novaUnidadeEmail.trim() === "" || novaUnidadePlano === "") {
      toast.error("Preencha todos os campos da unidade")
      return
    }

    setCriandoUnidade(true)
    try {
      const res = await api.post("/admin/unidade", {
        body: {
          nome: novaUnidadeNome.trim(),
          email: novaUnidadeEmail.trim(),
          plano: novaUnidadePlano,
        },
      })

      if (res.success) {
        setOpenCriarUsuario(false)
        setNovaUnidadeNome("")
        setNovaUnidadeEmail("")
        setNovaUnidadePlano("BASICO")
        toast.success("Unidade criada com sucesso!")
      } else {
        toast.error(res.message || "Erro ao criar unidade")
      }
    } catch (e: any) {
      toast.error(e?.message ?? "Erro ao criar unidade")
    } finally {
      setCriandoUnidade(false)
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
        setHasSenhaApp(true)
      } else {
        toast.error(res.message || "Erro ao salvar configurações de e-mail")
      }
    } catch (e: any) {
      toast.error(e?.message ?? "Erro ao salvar configurações de e-mail")
    } finally {
      setSalvandoEmail(false)
    }
  }

  const handleDeletarEmailConfig = async () => {
    setSalvandoEmail(true)
    try {
      await api.delete("/configuracao/email")
      toast.success("Configurações de e-mail removidas.")
      setEmailRemetente("")
      setEmailSenhaApp("")
      setHasSenhaApp(false)
    } catch (e: any) {
      toast.error("Erro ao remover configurações de e-mail")
    } finally {
      setSalvandoEmail(false)
    }
  }

  const handleConnectMercadoPago = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"
    const oauthUrl = apiUrl.replace("/api/v1", "/mp/autorizar")
    window.location.href = oauthUrl
  }

  const handleAtualizarTipoPagamento = async (tipo: "CHECKOUT" | "PIX") => {
    setSalvandoTipoPagamento(true)
    try {
      const res = await api.put("/configuracao/mercado-pago/tipo-pagamento", {
        body: { tipoPagamento: tipo },
      })
      if (res.success) {
        toast.success("Tipo de pagamento atualizado!")
        setMpConfig(prev => prev ? { ...prev, tipoPagamento: tipo } : null)
      } else {
        toast.error(res.message || "Erro ao atualizar")
      }
    } catch (e: any) {
      toast.error(e?.message ?? "Erro ao atualizar tipo de pagamento")
    } finally {
      setSalvandoTipoPagamento(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          <Settings2 className="h-6 w-6" />
        </div>
        <div className="flex flex-col gap-0.5">
          <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground text-sm">
            Gerencie seus dados de acesso e preferências.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6 items-start">
        {/* Coluna Principal (Esquerda) */}
        <div className="w-full flex flex-col gap-6 min-w-0">

          {/* Card: Geral */}
          <Card className="bg-card rounded-xl border border-border shadow-sm">
            <div className="px-6 py-4 border-b border-border flex items-center gap-2">
              <UserCog className="h-5 w-5 text-muted-foreground" />
              <div>
                <h2 className="font-semibold text-base">Geral</h2>
                <p className="text-sm text-muted-foreground">Informações principais da sua conta</p>
              </div>
            </div>

            <div className="px-6 py-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-muted/50 rounded-lg px-4 py-3">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Nome</div>
                  <div className="text-sm font-medium text-foreground">{me?.nome ?? (loading ? "Carregando..." : "")}</div>
                </div>
                <div className="bg-muted/50 rounded-lg px-4 py-3">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Email</div>
                  <div className="text-sm font-medium text-foreground">{me?.email ?? (loading ? "Carregando..." : "")}</div>
                </div>
                <div className="bg-muted/50 rounded-lg px-4 py-3">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Unidade</div>
                  <div className="text-sm font-medium text-foreground">{me?.unidadeNome ?? (loading ? "Carregando..." : "")}</div>
                </div>
                <div className="bg-muted/50 rounded-lg px-4 py-3">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Perfil</div>
                  <div className="text-sm font-medium text-foreground">{me?.perfilNome ?? (loading ? "Carregando..." : "")}</div>
                </div>
                <div className="bg-muted/50 rounded-lg px-4 py-3 sm:col-span-2">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Descrição do perfil</div>
                  <div className="text-sm font-medium text-foreground">{me?.perfilDescricao ?? (loading ? "Carregando..." : "")}</div>
                </div>
              </div>

              <div className="border-t border-border pt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
                <div className="flex flex-col">
                  <div className="font-medium text-sm">
                    {me?.email === "kaiquecgotardo@gmail.com" ? "Criar Unidade ou Usuário" : "Criar Novo Usuário"}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {me?.email === "kaiquecgotardo@gmail.com" 
                      ? "Gerar nova unidade / tenant do sistema ou novo usuário"
                      : "Gerar credenciais temporárias para um novo usuário"}
                  </div>
                </div>
                <Button
                  onClick={() => setOpenCriarUsuario(true)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2 w-full sm:w-auto"
                >
                  <UserPlus className="h-4 w-4" />
                  {me?.email === "kaiquecgotardo@gmail.com" ? "Criar Unidade/Usuário" : "Criar Usuário"}
                </Button>
              </div>
            </div>
          </Card>

          {/* Card: Integração API Pública */}
          <Card className="bg-card rounded-xl border border-border shadow-sm">
            <div className="px-6 py-4 border-b border-border flex items-center gap-2">
              <Webhook className="h-5 w-5 text-muted-foreground" />
              <div>
                <h2 className="font-semibold text-base">Integração API Pública</h2>
                <p className="text-sm text-muted-foreground">Gerencie seu token de integração</p>
              </div>
            </div>

            <div className="px-6 py-5 space-y-5">
              <div className="text-sm text-muted-foreground">
                Gere um token de API para integrar serviços externos e automatizar suas operações.
                O token identifica as requisições como sendo do seu usuário e unidade.
              </div>

              {!apiToken ? (
                <div
                  className="flex items-center justify-center p-6 border border-border border-dashed rounded-lg bg-muted/20 hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={handleGerarToken}
                >
                  <div className="flex flex-col items-center gap-2 text-primary">
                    <Key className="h-8 w-8" />
                    <span className="font-semibold text-sm">{gerandoToken ? "Gerando..." : "Gerar API Key"}</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Token de Acesso</label>
                  <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                    <div className="relative flex-1 w-full bg-muted rounded-lg px-4 py-3 flex items-center justify-between overflow-hidden">
                      <span className="font-mono text-sm break-all pt-0.5">
                        {showToken ? apiToken : maskToken(apiToken)}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-transparent -mr-2 shrink-0"
                        onClick={() => setShowToken(!showToken)}
                      >
                        {showToken ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                      </Button>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button variant="secondary" onClick={copyToken} className="flex-1 sm:flex-none">
                        <Copy className="h-4 w-4 mr-2" />
                        Copiar
                      </Button>
                      <Button variant="destructive" onClick={() => setOpenRevogarToken(true)} className="flex-1 sm:flex-none bg-destructive px-3">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Revogar
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Card: Configurações de E-mail */}
          <Card className="bg-card rounded-xl border border-border shadow-sm">
            <div className="px-6 py-4 border-b border-border flex items-center gap-2">
              <Send className="h-5 w-5 text-muted-foreground" />
              <div>
                <h2 className="font-semibold text-base">Configurações de E-mail</h2>
                <p className="text-sm text-muted-foreground">Configurar e-mail remetente e senha de app</p>
              </div>
            </div>

            <div className="px-6 py-5 space-y-5">
              <div className="text-sm text-muted-foreground">
                Configure o e-mail remetente usado para envio de notificações e comunicações automáticas do sistema.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email-remetente" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    E-mail remetente
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email-remetente"
                      type="email"
                      placeholder="seuemail@gmail.com"
                      value={emailRemetente}
                      onChange={(e) => setEmailRemetente(e.target.value)}
                      disabled={salvandoEmail || hasSenhaApp}
                      className="pl-9 h-10"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email-senha-app" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Senha de app
                  </Label>
                  {hasSenhaApp ? (
                    <div className="flex items-center gap-2 h-10 px-4 rounded-md border border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400">
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      <span className="text-sm font-medium">Configurada e funcionante</span>
                    </div>
                  ) : (
                    <div className="relative">
                      <Key className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email-senha-app"
                        type={showEmailSenha ? "text" : "password"}
                        placeholder="xxxx xxxx xxxx xxxx"
                        value={emailSenhaApp}
                        onChange={(e) => setEmailSenhaApp(e.target.value)}
                        disabled={salvandoEmail}
                        maxLength={50}
                        className="pl-9 pr-10 h-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-10 w-10 hover:bg-transparent"
                        onClick={() => setShowEmailSenha(!showEmailSenha)}
                        tabIndex={-1}
                      >
                        {showEmailSenha ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex gap-3">
                <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800 dark:text-blue-200 flex flex-col gap-2">
                  <span className="font-semibold">O que é a senha de app?</span>
                  <span>
                    É uma senha gerada pelo Google para aplicativos. Sua senha normal do Gmail <strong>não funciona</strong> aqui.
                  </span>
                  <span>
                    Você pode gerar sua senha de app acessando diretamente o link abaixo:
                  </span>
                  <a
                    href="https://myaccount.google.com/apppasswords"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 w-fit bg-blue-100 dark:bg-blue-900/50 px-2.5 py-1 rounded-md transition-colors"
                  >
                    🔗 myaccount.google.com/apppasswords
                  </a>
                  <span className="mt-1">
                    Para mais informações detalhadas sobre como funciona,{" "}
                    <a
                      href="https://support.google.com/accounts/answer/185833?hl=pt-BR"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-medium hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      leia a documentação oficial do Google
                    </a>.
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                {hasSenhaApp ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleDeletarEmailConfig}
                      disabled={salvandoEmail}
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive border-border w-full sm:w-auto"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      <span>{salvandoEmail ? "Removendo..." : "Remover"}</span>
                    </Button>
                    <Button disabled className="w-full sm:w-auto bg-primary text-primary-foreground opacity-70">
                      <Send className="h-4 w-4 mr-2" />
                      Configuração Salva
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={handleSalvarEmailConfig}
                    disabled={salvandoEmail}
                    className="bg-primary text-primary-foreground w-full sm:w-auto"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {salvandoEmail ? "Salvando..." : "Salvar"}
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Card: Mercado Pago */}
          <Card className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="h-1.5 bg-[#009EE3]"></div>
            <div className="px-6 py-4 border-b border-border flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <div>
                <h2 className="font-semibold text-base">Mercado Pago</h2>
                <p className="text-sm text-muted-foreground">Integração para pagamentos</p>
              </div>
            </div>

            <div className="px-6 py-5 space-y-5">
              <p className="text-sm text-muted-foreground">
                Permita que o La Femme utilize sua conta Mercado Pago para receber pagamentos automaticamente dos seus clientes.
              </p>

              {mpConfig?.conectado ? (
                <div className="flex flex-col gap-4">
                  <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-900/50 rounded-lg p-4 flex gap-3">
                    <div className="bg-emerald-100 dark:bg-emerald-900/50 p-2 rounded-full h-fit">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-semibold text-emerald-800 dark:text-emerald-400">
                        Sua conta do Mercado Pago está conectada e pronta para receber pagamentos automáticos.
                      </span>
                      <span className="text-xs text-emerald-700/70 dark:text-emerald-500/70">
                        Os pagamentos das ordens de serviço agora serão liquidados diretamente na sua conta.
                      </span>
                    </div>
                  </div>

                  <div className="border border-border dark:border-gray-800 rounded-lg p-4 flex flex-col gap-3 mt-2">
                    <h3 className="text-sm font-semibold">Tipo de Integração</h3>
                    <p className="text-sm text-muted-foreground mb-1">
                      Escolha como a tela de pagamento será apresentada para o cliente final.
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <label className={`flex gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors ${mpConfig.tipoPagamento === "CHECKOUT" || !mpConfig.tipoPagamento ? 'border-primary ring-1 ring-primary/20 bg-primary/5 dark:bg-primary/10' : 'border-border'}`}>
                        <div className="flex h-5 items-center">
                          <input
                            type="radio"
                            name="tipoPagamento"
                            value="CHECKOUT"
                            checked={mpConfig.tipoPagamento === "CHECKOUT" || !mpConfig.tipoPagamento}
                            onChange={() => handleAtualizarTipoPagamento("CHECKOUT")}
                            disabled={salvandoTipoPagamento}
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold">CHECKOUT</span>
                          <span className="text-xs text-muted-foreground mt-0.5">Redirecionar cliente para o Mercado Pago</span>
                        </div>
                      </label>
                      <label className={`flex gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors ${mpConfig.tipoPagamento === "PIX" ? 'border-primary ring-1 ring-primary/20 bg-primary/5 dark:bg-primary/10' : 'border-border'}`}>
                        <div className="flex h-5 items-center">
                          <input
                            type="radio"
                            name="tipoPagamento"
                            value="PIX"
                            checked={mpConfig.tipoPagamento === "PIX"}
                            onChange={() => handleAtualizarTipoPagamento("PIX")}
                            disabled={salvandoTipoPagamento}
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold">PIX</span>
                          <span className="text-xs text-muted-foreground mt-0.5">Gerar QR Code Pix diretamente no sistema</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button
                      variant="outline"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive border-border w-full sm:w-auto"
                      onClick={() => toast.error("Função de desconectar será implementada em breve.")}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Desconectar Conta
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 rounded-lg p-4 flex gap-3">
                    <Info className="h-5 w-5 text-[#009EE3] shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800 dark:text-blue-200">
                      Ao clicar no botão abaixo, você será redirecionado para o ambiente seguro do Mercado Pago para autorizar a conexão.
                    </div>
                  </div>

                  <div className="flex justify-end pt-2 text-[#009EE3]">
                    <Button
                      onClick={handleConnectMercadoPago}
                      className="bg-[#009EE3] hover:bg-[#0086C3] text-white w-full sm:w-auto h-11 px-6 font-semibold flex items-center gap-2"
                    >
                      Conectar Mercado Pago
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>

        {/* Coluna Secundária (Direita) */}
        <div className="w-full min-w-0">
          <Card className="bg-card rounded-xl border border-border shadow-sm sticky top-6">
            <div className="px-6 py-4 border-b border-border flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <h2 className="font-semibold text-base">Usuários da Unidade</h2>
                <p className="text-sm text-muted-foreground">Pessoas com acesso</p>
              </div>
            </div>

            <div className="px-0 py-0 pb-2">
              {loadingUsuarios ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  Carregando usuários...
                </div>
              ) : usuarios.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  Nenhum usuário encontrado
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {usuarios.map((usuario) => (
                    <div
                      key={usuario.id}
                      className="flex items-center gap-3 px-5 py-4"
                    >
                      <Avatar className="h-10 w-10 shrink-0">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                          {getInitials(usuario.nome)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold truncate text-foreground leading-none">{usuario.nome}</p>
                          {!usuario.ativo && (
                            <Badge variant="secondary" className="text-[10px] h-4 px-1 rounded-sm shrink-0">Inativo</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">{usuario.email}</p>
                      </div>
                      <div className="ml-auto shrink-0 pl-2">
                        <span className="bg-secondary text-secondary-foreground text-xs font-medium rounded-full px-2 py-0.5 inline-block">
                          {usuario.perfilNome}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      <Dialog open={openCriarUsuario} onOpenChange={setOpenCriarUsuario}>
        <DialogContent className={me?.email === "kaiquecgotardo@gmail.com" ? "max-w-md p-0 overflow-hidden" : ""}>
          {me?.email === "kaiquecgotardo@gmail.com" ? (
            <Tabs defaultValue="usuario" className="w-full">
              <div className="px-6 pt-6 pb-2">
                <DialogHeader>
                  <DialogTitle>Criar Cadastro</DialogTitle>
                  <DialogDescription>
                    Selecione se deseja criar um usuário comum ou uma nova unidade de tenant.
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="usuario">Usuário</TabsTrigger>
                    <TabsTrigger value="unidade">Nova Unidade</TabsTrigger>
                  </TabsList>
                </div>
              </div>

              <div className="px-6 pb-6">
                <TabsContent value="usuario" className="mt-0 outline-none">
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="nomeUsuario">Nome Completo</Label>
                      <Input
                        id="nomeUsuario"
                        placeholder="Ex: João Silva"
                        value={novoUsuarioNome}
                        onChange={(e) => setNovoUsuarioNome(e.target.value)}
                        disabled={criandoUsuario}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="emailUsuario">Email</Label>
                      <Input
                        id="emailUsuario"
                        type="email"
                        placeholder="Ex: joao@exemplo.com"
                        value={novoUsuarioEmail}
                        onChange={(e) => setNovoUsuarioEmail(e.target.value)}
                        disabled={criandoUsuario}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <Button variant="outline" onClick={() => setOpenCriarUsuario(false)} disabled={criandoUsuario}>
                      Cancelar
                    </Button>
                    <Button onClick={handleCriarUsuario} disabled={criandoUsuario}>
                      {criandoUsuario ? "Criando..." : "Criar Usuário"}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="unidade" className="mt-0 outline-none">
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="nomeUnidade">Nome da Unidade</Label>
                      <Input
                        id="nomeUnidade"
                        placeholder="Ex: La Femme SP"
                        value={novaUnidadeNome}
                        onChange={(e) => setNovaUnidadeNome(e.target.value)}
                        disabled={criandoUnidade}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="emailResp">Email do Responsável</Label>
                      <Input
                        id="emailResp"
                        type="email"
                        placeholder="Ex: admin@lafemmesp.com"
                        value={novaUnidadeEmail}
                        onChange={(e) => setNovaUnidadeEmail(e.target.value)}
                        disabled={criandoUnidade}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Plano</Label>
                      <Select value={novaUnidadePlano} onValueChange={setNovaUnidadePlano} disabled={criandoUnidade}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um plano" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BASICO">Básico</SelectItem>
                          <SelectItem value="PROFISSIONAL">Profissional</SelectItem>
                          <SelectItem value="PREMIUM">Premium</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <Button variant="outline" onClick={() => setOpenCriarUsuario(false)} disabled={criandoUnidade}>
                      Cancelar
                    </Button>
                    <Button onClick={handleCriarUnidade} disabled={criandoUnidade}>
                      {criandoUnidade ? "Criando..." : "Criar Unidade"}
                    </Button>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          ) : (
            <div className="p-6">
              <DialogHeader>
                <DialogTitle>Criar Novo Usuário</DialogTitle>
                <DialogDescription>
                  Preencha os dados do novo usuário. Uma senha temporária será gerada e enviada automaticamente para o e-mail informado.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4 mt-2">
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

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setOpenCriarUsuario(false)} disabled={criandoUsuario}>
                  Cancelar
                </Button>
                <Button onClick={handleCriarUsuario} disabled={criandoUsuario}>
                  {criandoUsuario ? "Criando..." : "Criar Usuário"}
                </Button>
              </div>
            </div>
          )}
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
