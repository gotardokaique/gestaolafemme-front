"use client"

import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, Mail, Key, Eye, EyeOff, CheckCircle2, Trash2, Info } from "lucide-react"

interface CardEmailProps {
  emailRemetente: string
  setEmailRemetente: (v: string) => void
  emailSenhaApp: string
  setEmailSenhaApp: (v: string) => void
  showEmailSenha: boolean
  setShowEmailSenha: (v: boolean) => void
  salvandoEmail: boolean
  hasSenhaApp: boolean
  onSalvar: () => void
  onDeletar: () => void
}

export function CardEmail({
  emailRemetente,
  setEmailRemetente,
  emailSenhaApp,
  setEmailSenhaApp,
  showEmailSenha,
  setShowEmailSenha,
  salvandoEmail,
  hasSenhaApp,
  onSalvar,
  onDeletar,
}: CardEmailProps) {
  return (
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
                onClick={onDeletar}
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
              onClick={onSalvar}
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
  )
}
