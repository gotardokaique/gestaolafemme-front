"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, CheckCircle2, Info, ExternalLink, Trash2 } from "lucide-react"
import toast from "react-hot-toast"
import type { MercadoPagoConfig } from "./schemas"

interface CardMercadoPagoProps {
  mpConfig: MercadoPagoConfig | null
  salvandoTipoPagamento: boolean
  onConnect: () => void
  onAtualizarTipo: (tipo: "CHECKOUT" | "PIX") => void
}

export function CardMercadoPago({
  mpConfig,
  salvandoTipoPagamento,
  onConnect,
  onAtualizarTipo,
}: CardMercadoPagoProps) {
  return (
    <Card className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="h-1.5 bg-[#009EE3]" />
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
          <ConectadoView
            mpConfig={mpConfig}
            salvandoTipoPagamento={salvandoTipoPagamento}
            onAtualizarTipo={onAtualizarTipo}
          />
        ) : (
          <DesconectadoView onConnect={onConnect} />
        )}
      </div>
    </Card>
  )
}

function ConectadoView({
  mpConfig,
  salvandoTipoPagamento,
  onAtualizarTipo,
}: {
  mpConfig: MercadoPagoConfig
  salvandoTipoPagamento: boolean
  onAtualizarTipo: (tipo: "CHECKOUT" | "PIX") => void
}) {
  return (
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
          <TipoPagamentoOption
            tipo="CHECKOUT"
            label="CHECKOUT"
            description="Redirecionar cliente para o Mercado Pago"
            selected={mpConfig.tipoPagamento === "CHECKOUT" || !mpConfig.tipoPagamento}
            disabled={salvandoTipoPagamento}
            onSelect={() => onAtualizarTipo("CHECKOUT")}
          />
          <TipoPagamentoOption
            tipo="PIX"
            label="PIX"
            description="Gerar QR Code Pix diretamente no sistema"
            selected={mpConfig.tipoPagamento === "PIX"}
            disabled={salvandoTipoPagamento}
            onSelect={() => onAtualizarTipo("PIX")}
          />
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
  )
}

function TipoPagamentoOption({
  tipo,
  label,
  description,
  selected,
  disabled,
  onSelect,
}: {
  tipo: string
  label: string
  description: string
  selected: boolean
  disabled: boolean
  onSelect: () => void
}) {
  return (
    <label
      className={`flex gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors ${
        selected ? "border-primary ring-1 ring-primary/20 bg-primary/5 dark:bg-primary/10" : "border-border"
      }`}
    >
      <div className="flex h-5 items-center">
        <input
          type="radio"
          name="tipoPagamento"
          value={tipo}
          checked={selected}
          onChange={onSelect}
          disabled={disabled}
          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600 dark:bg-gray-700"
        />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-semibold">{label}</span>
        <span className="text-xs text-muted-foreground mt-0.5">{description}</span>
      </div>
    </label>
  )
}

function DesconectadoView({ onConnect }: { onConnect: () => void }) {
  return (
    <>
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 rounded-lg p-4 flex gap-3">
        <Info className="h-5 w-5 text-[#009EE3] shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800 dark:text-blue-200">
          Ao clicar no botão abaixo, você será redirecionado para o ambiente seguro do Mercado Pago para autorizar a conexão.
        </div>
      </div>

      <div className="flex justify-end pt-2 text-[#009EE3]">
        <Button
          onClick={onConnect}
          className="bg-[#009EE3] hover:bg-[#0086C3] text-white w-full sm:w-auto h-11 px-6 font-semibold flex items-center gap-2"
        >
          Conectar Mercado Pago
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>
    </>
  )
}
