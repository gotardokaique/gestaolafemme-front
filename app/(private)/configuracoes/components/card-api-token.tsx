"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Webhook, Key, Eye, EyeOff, Copy, Trash2 } from "lucide-react"
import { maskToken } from "./utils"

interface CardApiTokenProps {
  apiToken: string | null
  gerandoToken: boolean
  showToken: boolean
  onToggleShow: () => void
  onGerar: () => void
  onCopy: () => void
  onRevogar: () => void
}

export function CardApiToken({
  apiToken,
  gerandoToken,
  showToken,
  onToggleShow,
  onGerar,
  onCopy,
  onRevogar,
}: CardApiTokenProps) {
  return (
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
            onClick={onGerar}
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
                  onClick={onToggleShow}
                >
                  {showToken ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                </Button>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button variant="secondary" onClick={onCopy} className="flex-1 sm:flex-none">
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar
                </Button>
                <Button variant="destructive" onClick={onRevogar} className="flex-1 sm:flex-none bg-destructive px-3">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Revogar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
