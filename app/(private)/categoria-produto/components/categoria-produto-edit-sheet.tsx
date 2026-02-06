"use client"

import * as React from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { toast } from "@/components/ui/sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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

import { categoriaProdutoApi } from "@/services/categoria-produto/categoria-produto.api"
import {
  CategoriaProdutoUpdateSchema,
  type CategoriaProduto,
  type CategoriaProdutoUpdateDTO,
} from "@/services/categoria-produto/categoria-produto.schemas"
import { Tag } from "lucide-react"

type Props = {
  categoria: CategoriaProduto
  onUpdated: () => void
}

export function CategoriaProdutoEditSheet({ categoria, onUpdated }: Props) {
  const [open, setOpen] = React.useState(false)

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting, errors },
  } = useForm<CategoriaProdutoUpdateDTO>({
    resolver: zodResolver(CategoriaProdutoUpdateSchema),
    defaultValues: {
      nome: categoria.nome,
      descricao: categoria.descricao ?? "",
      ativo: categoria.ativo,
    },
  })

  // Sincroniza o form quando a categoria muda ou o sheet abre
  React.useEffect(() => {
    if (open) {
      reset({
        nome: categoria.nome,
        descricao: categoria.descricao ?? "",
        ativo: categoria.ativo,
      })
    }
  }, [open, categoria, reset])

  const onSubmit = async (data: CategoriaProdutoUpdateDTO) => {
    try {
      const res = await categoriaProdutoApi.update(categoria.id, data)

      setOpen(false)
      toast.success(res.message || "Categoria atualizada com sucesso!")
      onUpdated()
    } catch (err: any) {
      console.error("[EditCategoriaProduto]", err)
      toast.error(err?.message ?? "Não foi possível atualizar a categoria.")
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
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-violet-500/10 text-violet-500">
              <Tag className="h-5 w-5" />
            </div>
            <div>
              <SheetTitle>Editar categoria</SheetTitle>
              <SheetDescription>Atualize as informações da categoria.</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor={`categoria-nome-${categoria.id}`}>Nome</Label>
            <Input id={`categoria-nome-${categoria.id}`} {...register("nome")} />
            {errors.nome && (
              <p className="text-sm text-destructive">{errors.nome.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`categoria-descricao-${categoria.id}`}>Descrição</Label>
            <Textarea
              id={`categoria-descricao-${categoria.id}`}
              {...register("descricao")}
              rows={4}
            />
          </div>

          <div className="flex items-center justify-between rounded-md border p-3">
            <div>
              <p className="text-sm font-medium">Ativo</p>
              <p className="text-muted-foreground text-xs">
                Define se a categoria está ativa.
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
