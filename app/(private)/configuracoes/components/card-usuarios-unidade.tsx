"use client"

import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"
import { getInitials } from "./utils"
import type { UsuarioUnidade } from "./schemas"

interface CardUsuariosUnidadeProps {
  usuarios: UsuarioUnidade[]
  loading: boolean
}

export function CardUsuariosUnidade({ usuarios, loading }: CardUsuariosUnidadeProps) {
  return (
    <Card className="bg-card rounded-xl border border-border shadow-sm sticky top-6">
      <div className="px-6 py-4 border-b border-border flex items-center gap-2">
        <Users className="h-5 w-5 text-muted-foreground" />
        <div>
          <h2 className="font-semibold text-base">Usuários da Unidade</h2>
          <p className="text-sm text-muted-foreground">Pessoas com acesso</p>
        </div>
      </div>

      <div className="px-0 py-0 pb-2">
        {loading ? (
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
              <UsuarioItem key={usuario.id} usuario={usuario} />
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}

function UsuarioItem({ usuario }: { usuario: UsuarioUnidade }) {
  return (
    <div className="flex items-center gap-3 px-5 py-4">
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
  )
}
