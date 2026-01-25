"use client"

import * as React from "react"
import { toast } from "@/components/ui/sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { fornecedorApi } from "@/services/fornecedor/fornecedor.api"
import { FornecedorCreateSchema, type FornecedorCreateDTO } from "@/services/fornecedor/fornecedor.schemas"

type Props = { onCreated: () => void }

export function FornecedorCreateSheet({ onCreated }: Props) {
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  const [form, setForm] = React.useState<FornecedorCreateDTO>({
    nome: "",
    telefone: "",
    email: "",
    ativo: true,
  })

  function setField<K extends keyof FornecedorCreateDTO>(k: K, v: FornecedorCreateDTO[K]) {
    setForm((p) => ({ ...p, [k]: v }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const dto = FornecedorCreateSchema.parse(form)
      await fornecedorApi.create(dto)
      toast.success("Fornecedor cadastrado com sucesso.")
      setOpen(false)
      setForm({ nome: "", telefone: "", email: "", ativo: true })
      onCreated()
    } catch (err: any) {
      toast.error(err?.message ?? "Não foi possível cadastrar o fornecedor.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>Adicionar fornecedor</Button>
      </SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <SheetTitle>Novo fornecedor</SheetTitle>
          <SheetDescription>Preencha os dados para cadastrar um fornecedor.</SheetDescription>
        </SheetHeader>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="fornecedor-nome">Nome</Label>
            <Input
              id="fornecedor-nome"
              value={form.nome}
              onChange={(e) => setField("nome", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fornecedor-telefone">Telefone</Label>
            <Input
              id="fornecedor-telefone"
              value={form.telefone ?? ""}
              onChange={(e) => setField("telefone", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fornecedor-email">Email</Label>
            <Input
              id="fornecedor-email"
              type="email"
              value={form.email ?? ""}
              onChange={(e) => setField("email", e.target.value)}
            />
          </div>

          <SheetFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
