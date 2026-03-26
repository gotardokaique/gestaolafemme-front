"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserCog, UserPlus } from "lucide-react"
import type { UserMe } from "./schemas"

interface CardGeralProps {
  me: UserMe | null
  loading: boolean
  isAdmin: boolean
  onCriarClick: () => void
}

export function CardGeral({ me, loading, isAdmin, onCriarClick }: CardGeralProps) {
  return (
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
          <InfoField label="Nome" value={me?.nome} loading={loading} />
          <InfoField label="Email" value={me?.email} loading={loading} />
          <InfoField label="Unidade" value={me?.unidadeNome} loading={loading} />
          <InfoField label="Perfil" value={me?.perfilNome} loading={loading} />
          <InfoField label="Descrição do perfil" value={me?.perfilDescricao} loading={loading} className="sm:col-span-2" />
        </div>

        <div className="border-t border-border pt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
          <div className="flex flex-col">
            <div className="font-medium text-sm">
              {isAdmin ? "Criar Unidade ou Usuário" : "Criar Novo Usuário"}
            </div>
            <div className="text-muted-foreground text-sm">
              {isAdmin
                ? "Gerar nova unidade / tenant do sistema ou novo usuário"
                : "Gerar credenciais temporárias para um novo usuário"}
            </div>
          </div>
          <Button
            onClick={onCriarClick}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2 w-full sm:w-auto"
          >
            <UserPlus className="h-4 w-4" />
            {isAdmin ? "Criar Unidade/Usuário" : "Criar Usuário"}
          </Button>
        </div>
      </div>
    </Card>
  )
}

function InfoField({
  label,
  value,
  loading,
  className = "",
}: {
  label: string
  value?: string | null
  loading: boolean
  className?: string
}) {
  return (
    <div className={`bg-muted/50 rounded-lg px-4 py-3 ${className}`}>
      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">{label}</div>
      <div className="text-sm font-medium text-foreground">{value ?? (loading ? "Carregando..." : "")}</div>
    </div>
  )
}
