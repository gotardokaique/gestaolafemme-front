"use client"

import * as React from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { toast } from "@/components/ui/sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { VoiceField } from "@/components/fields/voice-field"
import { DatePicker } from "@/components/ui/date-picker"
import { ProdutoField } from "@/components/fields/produto-field"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  VendaRequestSchema,
  type VendaRequestDTO,
} from "@/services/venda/venda.schemas"
import { vendaApi } from "@/services/venda/venda.api"
import { produtoApi } from "@/services/produto/produto.api"
import type { Produto } from "@/services/produto/produto.schemas"
import { NumericInput } from "@/components/ui/numeric-input"
import { ShoppingCart } from "lucide-react"

type Props = { onCreated: () => void }

export function VendaCreateSheet({ onCreated }: Props) {
  const [open, setOpen] = React.useState(false)
  const [produtos, setProdutos] = React.useState<Produto[]>([])

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { isSubmitting, errors },
  } = useForm<VendaRequestDTO>({
    resolver: zodResolver(VendaRequestSchema),
    defaultValues: {
      produtoId: 0,
      quantidade: 1,
      formaPagamento: "",
      observacao: "",
      dataVenda: new Date().toISOString().split('T')[0],
    },
  })

  const selectedProdutoId = watch("produtoId")
  const quantidade = watch("quantidade")
  const valorTotal = watch("valorTotal")

  React.useEffect(() => {
    if (open) {
      produtoApi.list(true).then(setProdutos).catch(() => {
        toast.error("Erro ao carregar produtos.")
      })
    }
  }, [open])

  const selectedProduto = React.useMemo(() =>
    produtos.find(p => p.id === selectedProdutoId),
    [produtos, selectedProdutoId]
  )

  // Auto-fill valorTotal based on quantity and product price
  React.useEffect(() => {
    if (selectedProduto) {
      setValue("valorTotal", selectedProduto.valorVenda * (quantidade || 0))
    }
  }, [selectedProduto, quantidade, setValue])

  const onSubmit = async (formData: VendaRequestDTO) => {
    try {
      const res = await vendaApi.create(formData)
      setOpen(false)
      toast.success(res.message || "Venda realizada com sucesso!")
      onCreated()
    } catch (err: any) {
      toast.error(err?.message ?? "Erro ao realizar venda.")
    }
  }


  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        setOpen(v)
        if (!v) reset()
      }}
    >
      <SheetTrigger asChild>
        <Button>Nova Venda</Button>
      </SheetTrigger>

      <SheetContent className="sheet-content-standard overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
              <ShoppingCart className="h-5 w-5" />
            </div>
            <div>
              <SheetTitle>Nova Venda</SheetTitle>
              <SheetDescription>
                Registre uma nova venda no sistema.
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <form className="mt-6 space-y-4 pb-10" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label>Produto</Label>
            <Controller
              control={control}
              name="produtoId"
              render={({ field }) => (
                <ProdutoField
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.produtoId && (
              <p className="text-sm text-destructive">{errors.produtoId.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Quantidade</Label>
              <Input
                type="number"
                {...register("quantidade", { valueAsNumber: true })}
              />
              {errors.quantidade && (
                <p className="text-sm text-destructive">{errors.quantidade.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Data da Venda</Label>
              <Controller
                control={control}
                name="dataVenda"
                render={({ field }) => (
                  <DatePicker
                    value={field.value ? new Date(field.value) : undefined}
                    onChange={(date) => field.onChange(date?.toISOString().split('T')[0])}
                  />
                )}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Forma de Pagamento</Label>
            <Select onValueChange={(val) => setValue("formaPagamento", val)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DINHEIRO">Dinheiro</SelectItem>
                <SelectItem value="PIX">Pix</SelectItem>
                <SelectItem value="CARTAO_CREDITO">Cartão de Crédito</SelectItem>
                <SelectItem value="CARTAO_DEBITO">Cartão de Débito</SelectItem>
              </SelectContent>
            </Select>
            {errors.formaPagamento && (
              <p className="text-sm text-destructive">{errors.formaPagamento.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Observação</Label>
            <Controller
              control={control}
              name="observacao"
              render={({ field }) => (
                <VoiceField
                  as="textarea"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="Opcional..."
                />
              )}
            />
          </div>

          <div className="rounded-lg bg-muted p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Preço Unitário sugerido:</span>
              <span className="font-medium">
                {selectedProduto ? `R$ ${selectedProduto.valorVenda.toFixed(2)}` : "-"}
              </span>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Valor Total da Venda (Editável)</Label>
              <Controller
                control={control}
                name="valorTotal"
                render={({ field }) => (
                  <NumericInput
                    variant="currency"
                    prefix="R$"
                    value={field.value || 0}
                    onChange={field.onChange}
                    className="bg-background"
                  />
                )}
              />
            </div>
          </div>

          <SheetFooter>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Processando..." : "Confirmar Venda"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
