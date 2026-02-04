"use client"

import * as React from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

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
import {
  FornecedorUpdateSchema,
  type Fornecedor,
  type FornecedorUpdateDTO,
} from "@/services/fornecedor/fornecedor.schemas"

type Props = {
  fornecedor: Fornecedor
  onUpdated: () => void
}

export function FornecedorEditSheet({ fornecedor, onUpdated }: Props) {
  const [open, setOpen] = React.useState(false)

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting, errors },
  } = useForm<FornecedorUpdateDTO>({
    resolver: zodResolver(FornecedorUpdateSchema),
    defaultValues: {
      nome: fornecedor.nome,
      telefone: fornecedor.telefone ?? "",
      email: fornecedor.email ?? "",
      ativo: fornecedor.ativo,
    },
  })

  // Sincroniza o form quando o fornecedor muda ou o sheet abre
  React.useEffect(() => {
    if (open) {
      reset({
        nome: fornecedor.nome,
        telefone: fornecedor.telefone ?? "",
        email: fornecedor.email ?? "",
        ativo: fornecedor.ativo,
      })
    }
  }, [open, fornecedor, reset])

  const onSubmit = async (data: FornecedorUpdateDTO) => {
    try {
      const res = await fornecedorApi.update(fornecedor.id, data)

      setOpen(false)
      toast.success(res.message || "Fornecedor atualizado com sucesso!")
      onUpdated()
    } catch (err: any) {
      console.error("[EditFornecedor]", err)
      toast.error(err?.message ?? "Não foi possível atualizar o fornecedor.")
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          Editar
        </Button>
      </SheetTrigger>

      <SheetContent className="sheet-content-standard">
        <SheetHeader>
          <SheetTitle>Editar fornecedor</SheetTitle>
          <SheetDescription>Atualize as informações do fornecedor.</SheetDescription>
        </SheetHeader>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor={`fornecedor-nome-${fornecedor.id}`}>Nome</Label>
            <Input id={`fornecedor-nome-${fornecedor.id}`} {...register("nome")} />
            {errors.nome && (
              <p className="text-sm text-destructive">{errors.nome.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`fornecedor-telefone-${fornecedor.id}`}>Telefone</Label>
            <Input id={`fornecedor-telefone-${fornecedor.id}`} {...register("telefone")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`fornecedor-email-${fornecedor.id}`}>Email</Label>
            <Input
              id={`fornecedor-email-${fornecedor.id}`}
              type="email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between rounded-md border p-3">
            <div>
              <p className="text-sm font-medium">Ativo</p>
              <p className="text-muted-foreground text-xs">
                Define se o fornecedor está ativo.
              </p>
            </div>
            <Controller
              name="ativo"
              control={control}
              render={({ field }) => (
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
          </div>

          <SheetFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}

