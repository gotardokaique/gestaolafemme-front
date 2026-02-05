"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
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
} from "@/components/ui/sheet"

import {
  EstoqueAjusteSchema,
  type EstoqueAjusteDTO,
  type Estoque,
} from "@/services/estoque/estoque.schemas"
import { estoqueApi } from "@/services/estoque/estoque.api"

type Props = {
  estoque: Estoque | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdated: () => void
}

export function EstoqueAjusteSheet({ estoque, open, onOpenChange, onUpdated }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<EstoqueAjusteDTO>({
    resolver: zodResolver(EstoqueAjusteSchema),
  })

  React.useEffect(() => {
    if (open && estoque) {
      reset({
        novaQuantidade: estoque.quantidadeAtual,
        observacao: "",
      })
    }
  }, [open, estoque, reset])

  const onSubmit = async (formData: EstoqueAjusteDTO) => {
    if (!estoque) return

    try {
      const res = await estoqueApi.ajustar(estoque.productId, formData)
      toast.success(res.message || "Estoque ajustado com sucesso!")
      onOpenChange(false)
      onUpdated()
    } catch (err: any) {
      toast.error(err?.message ?? "Erro ao ajustar estoque.")
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sheet-content-standard">
        <SheetHeader>
          <SheetTitle>Ajustar Estoque</SheetTitle>
          <SheetDescription>
            Alteração manual de saldo para o produto <strong>{estoque?.produtoNome}</strong>.
          </SheetDescription>
        </SheetHeader>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label>Quantidade Atual em Sistema</Label>
            <Input value={estoque?.quantidadeAtual} disabled className="bg-muted" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="novaQuantidade">Nova Quantidade Real</Label>
            <Input
              id="novaQuantidade"
              type="number"
              {...register("novaQuantidade", { valueAsNumber: true })}
            />
            {errors.novaQuantidade && (
              <p className="text-sm text-destructive">{errors.novaQuantidade.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacao">Motivo do Ajuste</Label>
            <Textarea
              id="observacao"
              placeholder="Ex: Quebra, perda, contagem de inventário..."
              {...register("observacao")}
            />
            {errors.observacao && (
              <p className="text-sm text-destructive">{errors.observacao.message}</p>
            )}
          </div>

          <SheetFooter className="pt-4">
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Salvando..." : "Confirmar Ajuste"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
