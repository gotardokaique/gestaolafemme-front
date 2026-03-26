"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface DialogCriarCadastroProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isAdmin: boolean
  novoUsuarioNome: string
  setNovoUsuarioNome: (v: string) => void
  novoUsuarioEmail: string
  setNovoUsuarioEmail: (v: string) => void
  criandoUsuario: boolean
  onCriarUsuario: () => void
  novaUnidadeNome: string
  setNovaUnidadeNome: (v: string) => void
  novaUnidadeEmail: string
  setNovaUnidadeEmail: (v: string) => void
  criandoUnidade: boolean
  onCriarUnidade: () => void
}

export function DialogCriarCadastro({
  open,
  onOpenChange,
  isAdmin,
  novoUsuarioNome,
  setNovoUsuarioNome,
  novoUsuarioEmail,
  setNovoUsuarioEmail,
  criandoUsuario,
  onCriarUsuario,
  novaUnidadeNome,
  setNovaUnidadeNome,
  novaUnidadeEmail,
  setNovaUnidadeEmail,
  criandoUnidade,
  onCriarUnidade,
}: DialogCriarCadastroProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={isAdmin ? "max-w-md p-0 overflow-hidden" : ""}>
        {isAdmin ? (
          <AdminTabbedView
            novoUsuarioNome={novoUsuarioNome}
            setNovoUsuarioNome={setNovoUsuarioNome}
            novoUsuarioEmail={novoUsuarioEmail}
            setNovoUsuarioEmail={setNovoUsuarioEmail}
            criandoUsuario={criandoUsuario}
            onCriarUsuario={onCriarUsuario}
            novaUnidadeNome={novaUnidadeNome}
            setNovaUnidadeNome={setNovaUnidadeNome}
            novaUnidadeEmail={novaUnidadeEmail}
            setNovaUnidadeEmail={setNovaUnidadeEmail}
            criandoUnidade={criandoUnidade}
            onCriarUnidade={onCriarUnidade}
            onClose={() => onOpenChange(false)}
          />
        ) : (
          <UsuarioSimples
            novoUsuarioNome={novoUsuarioNome}
            setNovoUsuarioNome={setNovoUsuarioNome}
            novoUsuarioEmail={novoUsuarioEmail}
            setNovoUsuarioEmail={setNovoUsuarioEmail}
            criandoUsuario={criandoUsuario}
            onCriarUsuario={onCriarUsuario}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

function AdminTabbedView({
  novoUsuarioNome,
  setNovoUsuarioNome,
  novoUsuarioEmail,
  setNovoUsuarioEmail,
  criandoUsuario,
  onCriarUsuario,
  novaUnidadeNome,
  setNovaUnidadeNome,
  novaUnidadeEmail,
  setNovaUnidadeEmail,
  criandoUnidade,
  onCriarUnidade,
  onClose,
}: {
  novoUsuarioNome: string
  setNovoUsuarioNome: (v: string) => void
  novoUsuarioEmail: string
  setNovoUsuarioEmail: (v: string) => void
  criandoUsuario: boolean
  onCriarUsuario: () => void
  novaUnidadeNome: string
  setNovaUnidadeNome: (v: string) => void
  novaUnidadeEmail: string
  setNovaUnidadeEmail: (v: string) => void
  criandoUnidade: boolean
  onCriarUnidade: () => void
  onClose: () => void
}) {
  return (
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
              <Label htmlFor="nomeUsuarioTab">Nome Completo</Label>
              <Input
                id="nomeUsuarioTab"
                placeholder="Ex: João Silva"
                value={novoUsuarioNome}
                onChange={(e) => setNovoUsuarioNome(e.target.value)}
                disabled={criandoUsuario}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="emailUsuarioTab">Email</Label>
              <Input
                id="emailUsuarioTab"
                type="email"
                placeholder="Ex: joao@exemplo.com"
                value={novoUsuarioEmail}
                onChange={(e) => setNovoUsuarioEmail(e.target.value)}
                disabled={criandoUsuario}
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose} disabled={criandoUsuario}>
              Cancelar
            </Button>
            <Button onClick={onCriarUsuario} disabled={criandoUsuario}>
              {criandoUsuario ? "Criando..." : "Criar Usuário"}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="unidade" className="mt-0 outline-none">
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nomeUnidadeTab">Nome da Unidade</Label>
              <Input
                id="nomeUnidadeTab"
                placeholder="Ex: La Femme SP"
                value={novaUnidadeNome}
                onChange={(e) => setNovaUnidadeNome(e.target.value)}
                disabled={criandoUnidade}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="nomeUsuarioUnidadeTab">Nome do Usuário</Label>
              <Input
                id="nomeUsuarioUnidadeTab"
                placeholder="Ex: João Silva"
                value={novoUsuarioNome}
                onChange={(e) => setNovoUsuarioNome(e.target.value)}
                disabled={criandoUnidade}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="emailRespTab">Email do Responsável</Label>
              <Input
                id="emailRespTab"
                type="email"
                placeholder="Ex: admin@lafemmesp.com"
                value={novaUnidadeEmail}
                onChange={(e) => setNovaUnidadeEmail(e.target.value)}
                disabled={criandoUnidade}
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose} disabled={criandoUnidade}>
              Cancelar
            </Button>
            <Button onClick={onCriarUnidade} disabled={criandoUnidade}>
              {criandoUnidade ? "Criando..." : "Criar Unidade"}
            </Button>
          </div>
        </TabsContent>
      </div>
    </Tabs>
  )
}

function UsuarioSimples({
  novoUsuarioNome,
  setNovoUsuarioNome,
  novoUsuarioEmail,
  setNovoUsuarioEmail,
  criandoUsuario,
  onCriarUsuario,
  onClose,
}: {
  novoUsuarioNome: string
  setNovoUsuarioNome: (v: string) => void
  novoUsuarioEmail: string
  setNovoUsuarioEmail: (v: string) => void
  criandoUsuario: boolean
  onCriarUsuario: () => void
  onClose: () => void
}) {
  return (
    <div className="p-6">
      <DialogHeader>
        <DialogTitle>Criar Novo Usuário</DialogTitle>
        <DialogDescription>
          Preencha os dados do novo usuário. Uma senha temporária será gerada e enviada automaticamente para o e-mail informado.
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-4 mt-2">
        <div className="grid gap-2">
          <Label htmlFor="nomeSimples">Nome Completo</Label>
          <Input
            id="nomeSimples"
            placeholder="Ex: João Silva"
            value={novoUsuarioNome}
            onChange={(e) => setNovoUsuarioNome(e.target.value)}
            disabled={criandoUsuario}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="emailSimples">Email</Label>
          <Input
            id="emailSimples"
            type="email"
            placeholder="Ex: joao@exemplo.com"
            value={novoUsuarioEmail}
            onChange={(e) => setNovoUsuarioEmail(e.target.value)}
            disabled={criandoUsuario}
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onClose} disabled={criandoUsuario}>
          Cancelar
        </Button>
        <Button onClick={onCriarUsuario} disabled={criandoUsuario}>
          {criandoUsuario ? "Criando..." : "Criar Usuário"}
        </Button>
      </div>
    </div>
  )
}
