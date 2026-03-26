"use client"

import { Settings2 } from "lucide-react"
import {
  CardGeral,
  CardApiToken,
  CardEmail,
  CardMercadoPago,
  CardUsuariosUnidade,
  DialogCriarCadastro,
  DialogRevogarToken,
  AlertasDeIntegracao,
  useConfiguracoes,
} from "./components"

export default function ConfiguracoesPage() {
  const config = useConfiguracoes()

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <AlertasDeIntegracao />

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
        <div className="w-full flex flex-col gap-6 min-w-0">
          <CardGeral
            me={config.me}
            loading={config.loading}
            isAdmin={config.isAdmin}
            onCriarClick={() => config.setOpenCriarUsuario(true)}
          />

          <CardApiToken
            apiToken={config.apiToken}
            gerandoToken={config.gerandoToken}
            showToken={config.showToken}
            onToggleShow={() => config.setShowToken(!config.showToken)}
            onGerar={config.handleGerarToken}
            onCopy={config.copyToken}
            onRevogar={() => config.setOpenRevogarToken(true)}
          />

          <CardEmail
            emailRemetente={config.emailRemetente}
            setEmailRemetente={config.setEmailRemetente}
            emailSenhaApp={config.emailSenhaApp}
            setEmailSenhaApp={config.setEmailSenhaApp}
            showEmailSenha={config.showEmailSenha}
            setShowEmailSenha={config.setShowEmailSenha}
            salvandoEmail={config.salvandoEmail}
            hasSenhaApp={config.hasSenhaApp}
            onSalvar={config.handleSalvarEmailConfig}
            onDeletar={config.handleDeletarEmailConfig}
          />

          <CardMercadoPago
            mpConfig={config.mpConfig}
            salvandoTipoPagamento={config.salvandoTipoPagamento}
            onConnect={config.handleConnectMercadoPago}
            onAtualizarTipo={config.handleAtualizarTipoPagamento}
          />
        </div>

        <div className="w-full min-w-0">
          <CardUsuariosUnidade
            usuarios={config.usuarios}
            loading={config.loadingUsuarios}
          />
        </div>
      </div>

      <DialogCriarCadastro
        open={config.openCriarUsuario}
        onOpenChange={config.setOpenCriarUsuario}
        isAdmin={config.isAdmin}
        novoUsuarioNome={config.novoUsuarioNome}
        setNovoUsuarioNome={config.setNovoUsuarioNome}
        novoUsuarioEmail={config.novoUsuarioEmail}
        setNovoUsuarioEmail={config.setNovoUsuarioEmail}
        criandoUsuario={config.criandoUsuario}
        onCriarUsuario={config.handleCriarUsuario}
        novaUnidadeNome={config.novaUnidadeNome}
        setNovaUnidadeNome={config.setNovaUnidadeNome}
        novaUnidadeEmail={config.novaUnidadeEmail}
        setNovaUnidadeEmail={config.setNovaUnidadeEmail}
        criandoUnidade={config.criandoUnidade}
        onCriarUnidade={config.handleCriarUnidade}
      />

      <DialogRevogarToken
        open={config.openRevogarToken}
        onOpenChange={config.setOpenRevogarToken}
        onConfirm={config.handleRevogarToken}
      />
    </div>
  )
}
