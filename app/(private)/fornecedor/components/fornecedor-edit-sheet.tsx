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
import { Switch } from "@/components/ui/switch"

import { fornecedorApi } from "@/services/fornecedor/fornecedor.api"
import { FornecedorUpdateSchema, type Fornecedor, type FornecedorUpdateDTO } from "@/services/fornecedor/fornecedor.schemas"

type Props = {
  fornecedor: Fornecedor
  onUpdated: () => void
}

export function FornecedorEditSheet({ fornecedor, onUpdated }: Props) {
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  const [form, setForm] = React.useState<FornecedorUpdateDTO>({
    nome: fornecedor.nome,
    telefone: fornecedor.telefone ?? "",
    email: fornecedor.email ?? "",
    ativo: fornecedor.ativo,
  })

  React.useEffect(() => {
    if (!open) return
    setForm({
      nome: fornecedor.nome,
      telefone: fornecedor.telefone ?? "",
      email: fornecedor.email ?? "",
      ativo: fornecedor.ativo,
    })
  }, [open, fornecedor])

  function setField<K extends keyof FornecedorUpdateDTO>(k: K, v: FornecedorUpdateDTO[K]) {
    setForm((p) => ({ ...p, [k]: v }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const dto = FornecedorUpdateSchema.parse(form)
      await fornecedorApi.update(fornecedor.id, dto)
      toast.success("Fornecedor atualizado com sucesso.")
      setOpen(false)
      onUpdated()
    } catch (err: any) {
      toast.error(err?.message ?? "Não foi possível atualizar o fornecedor.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          Editar
        </Button>
      </SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <SheetTitle>Editar fornecedor</SheetTitle>
          <SheetDescription>Atualize as informações do fornecedor.</SheetDescription>
        </SheetHeader>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor={`fornecedor-nome-${fornecedor.id}`}>Nome</Label>
            <Input
              id={`fornecedor-nome-${fornecedor.id}`}
              value={form.nome}
              onChange={(e) => setField("nome", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`fornecedor-telefone-${fornecedor.id}`}>Telefone</Label>
            <Input
              id={`fornecedor-telefone-${fornecedor.id}`}
              value={form.telefone ?? ""}
              onChange={(e) => setField("telefone", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`fornecedor-email-${fornecedor.id}`}>Email</Label>
            <Input
              id={`fornecedor-email-${fornecedor.id}`}
              type="email"
              value={form.email ?? ""}
              onChange={(e) => setField("email", e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between rounded-md border p-3">
            <div>
              <p className="text-sm font-medium">Ativo</p>
              <p className="text-muted-foreground text-xs">
                Define se o fornecedor está ativo.
              </p>
            </div>
            <Switch checked={!!form.ativo} onCheckedChange={(v) => setField("ativo", v)} />
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
