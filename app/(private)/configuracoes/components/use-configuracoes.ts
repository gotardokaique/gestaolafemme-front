"use client"

import * as React from "react"
import toast from "react-hot-toast"
import { api } from "@/lib/api"
import {
  UserMeSchema,
  type UserMe,
  type UsuarioUnidade,
  type MercadoPagoConfig,
} from "./schemas"

export function useConfiguracoes() {
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

  const [apiToken, setApiToken] = React.useState<string | null>(null)
  const [gerandoToken, setGerandoToken] = React.useState(false)
  const [showToken, setShowToken] = React.useState(false)
  const [openRevogarToken, setOpenRevogarToken] = React.useState(false)

  const [emailRemetente, setEmailRemetente] = React.useState("")
  const [emailSenhaApp, setEmailSenhaApp] = React.useState("")
  const [showEmailSenha, setShowEmailSenha] = React.useState(false)
  const [salvandoEmail, setSalvandoEmail] = React.useState(false)
  const [hasSenhaApp, setHasSenhaApp] = React.useState(false)

  const [mpConfig, setMpConfig] = React.useState<MercadoPagoConfig | null>(null)
  const [salvandoTipoPagamento, setSalvandoTipoPagamento] = React.useState(false)

  const isAdmin = me?.email === "kaiquecgotardo@gmail.com"

  React.useEffect(() => {
    let mounted = true
    ;(async () => {
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
      } catch {
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
      } catch {}

      try {
        const resEmail = await api.get("/configuracao/email")
        if (!mounted) return
        const dataEmail = resEmail.data as { emailRemetente?: string; hasSenhaApp?: boolean } | undefined
        if (resEmail.success && dataEmail) {
          setEmailRemetente(dataEmail.emailRemetente || "")
          setHasSenhaApp(!!dataEmail.hasSenhaApp)
        }
      } catch {}

      try {
        const resMp = await api.get("/configuracao/mercado-pago")
        if (!mounted) return
        if (resMp.success && resMp.data) {
          setMpConfig(resMp.data as MercadoPagoConfig)
        }
      } catch {}
    })()

    return () => {
      mounted = false
    }
  }, [api])

  const reloadUsuarios = async () => {
    try {
      const resUsuarios = await api.get("/users/usuarios-unidade")
      if (resUsuarios.success && resUsuarios.data) {
        setUsuarios(resUsuarios.data as UsuarioUnidade[])
      }
    } catch {}
  }

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
        await reloadUsuarios()
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
    if (!novaUnidadeNome.trim() || !novaUnidadeEmail.trim() || !novoUsuarioNome.trim()) {
      toast.error("Preencha todos os campos da unidade")
      return
    }

    setCriandoUnidade(true)
    try {
      const res = await api.post("/admin/unidade", {
        body: {
          nomeUnidade: novaUnidadeNome.trim(),
          nomeUsuario: novoUsuarioNome.trim(),
          email: novaUnidadeEmail.trim(),
        },
      })

      if (res.success) {
        setOpenCriarUsuario(false)
        setNovaUnidadeNome("")
        setNovaUnidadeEmail("")
        setNovoUsuarioNome("")
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
    } catch {
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
    } catch {
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
    } catch {
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
        setMpConfig((prev) => (prev ? { ...prev, tipoPagamento: tipo } : null))
      } else {
        toast.error(res.message || "Erro ao atualizar")
      }
    } catch (e: any) {
      toast.error(e?.message ?? "Erro ao atualizar tipo de pagamento")
    } finally {
      setSalvandoTipoPagamento(false)
    }
  }

  return {
    loading,
    me,
    isAdmin,
    openCriarUsuario,
    setOpenCriarUsuario,
    criandoUsuario,
    novoUsuarioNome,
    setNovoUsuarioNome,
    novoUsuarioEmail,
    setNovoUsuarioEmail,
    usuarios,
    loadingUsuarios,
    criandoUnidade,
    novaUnidadeNome,
    setNovaUnidadeNome,
    novaUnidadeEmail,
    setNovaUnidadeEmail,
    apiToken,
    gerandoToken,
    showToken,
    setShowToken,
    openRevogarToken,
    setOpenRevogarToken,
    emailRemetente,
    setEmailRemetente,
    emailSenhaApp,
    setEmailSenhaApp,
    showEmailSenha,
    setShowEmailSenha,
    salvandoEmail,
    hasSenhaApp,
    mpConfig,
    salvandoTipoPagamento,
    handleCriarUsuario,
    handleCriarUnidade,
    handleGerarToken,
    handleRevogarToken,
    copyToken,
    handleSalvarEmailConfig,
    handleDeletarEmailConfig,
    handleConnectMercadoPago,
    handleAtualizarTipoPagamento,
  }
}
