"use client"

import * as React from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { NumericInput } from "@/components/ui/numeric-input"
import { financeiroApi, type LancamentoFinanceiroRequest } from "@/services/financeiro/financeiro.api"
import { Plus, Wallet } from "lucide-react"

const LancamentoSchema = z.object({
  descricao: z.string().min(1, "Descrição é obrigatória"),
  tipo: z.enum(["ENTRADA", "SAIDA"]),
  valor: z.number().min(0.01, "Valor deve ser maior que zero"),
  dataLancamento: z.string().min(1, "Data é obrigatória"),
})

type Props = { onCreated: () => void }

export function LancamentoFinanceiroCreateSheet({ onCreated }: Props) {
  const [open, setOpen] = React.useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { isSubmitting, errors },
  } = useForm<LancamentoFinanceiroRequest>({
    resolver: zodResolver(LancamentoSchema),
    defaultValues: {
      descricao: "",
      tipo: "SAIDA",
      valor: 0,
      dataLancamento: new Date().toISOString().split('T')[0],
    },
  })

  const onSubmit = async (formData: LancamentoFinanceiroRequest) => {
    try {
      await financeiroApi.create(formData)
      setOpen(false)
      toast.success("Lançamento registrado com sucesso!")
      onCreated()
      reset()
    } catch (err: any) {
      toast.error(err?.message ?? "Erro ao registrar lançamento.")
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
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Lançamento
        </Button>
      </SheetTrigger>

      <SheetContent className="sheet-content-standard">
        <SheetHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <SheetTitle>Novo Lançamento</SheetTitle>
              <SheetDescription>
                Registre uma entrada ou saída manual no financeiro.
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label>Descrição</Label>
            <Input {...register("descricao")} placeholder="Ex: Aluguel, Luz, Ajuste de caixa..." />
            {errors.descricao && (
              <p className="text-sm text-destructive">{errors.descricao.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Controller
                control={control}
                name="tipo"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ENTRADA">Entrada (Receita)</SelectItem>
                      <SelectItem value="SAIDA">Saída (Despesa)</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label>Data</Label>
              <Controller
                control={control}
                name="dataLancamento"
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
            <Label>Valor</Label>
            <Controller
              control={control}
              name="valor"
              render={({ field }) => (
                <NumericInput
                  variant="currency"
                  prefix="R$"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.valor && (
              <p className="text-sm text-destructive">{errors.valor.message}</p>
            )}
          </div>

          <SheetFooter className="pt-4">
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Salvando..." : "Registrar Lançamento"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
