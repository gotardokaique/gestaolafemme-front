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
import { maskPhone, unmaskPhone } from "@/lib/utils"
import { UserCog } from "lucide-react"

type Props = {
  fornecedor: Fornecedor
  onUpdated: () => void
}

export function FornecedorEditSheet({ fornecedor, onUpdated }: Props) {
  const [open, setOpen] = React.useState(false)
  const [telefoneDisplay, setTelefoneDisplay] = React.useState("")

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
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
      const telefoneValue = fornecedor.telefone ?? ""
      reset({
        nome: fornecedor.nome,
        telefone: telefoneValue,
        email: fornecedor.email ?? "",
        ativo: fornecedor.ativo,
      })
      // Aplica máscara ao telefone existente
      setTelefoneDisplay(maskPhone(telefoneValue))
    }
  }, [open, fornecedor, reset])

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskPhone(e.target.value)
    setTelefoneDisplay(masked)
    // Salva apenas os dígitos no form
    setValue("telefone", unmaskPhone(masked))
  }

  const onSubmit = async (data: FornecedorUpdateDTO) => {
    try {
      const res = await fornecedorApi.update(fornecedor.id, data)

      setOpen(false)
      toast.success(res.message || "Fornecedor atualizado com sucesso!")
      onUpdated()
    } catch (err: any) {
      toast.error(err?.message ?? "Não foi possível atualizar o fornecedor.")
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <UserCog className="h-4 w-4" />
          Editar
        </Button>
      </SheetTrigger>

      <SheetContent className="sheet-content-standard">
        <SheetHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
              <UserCog className="h-5 w-5" />
            </div>
            <div>
              <SheetTitle>Editar fornecedor</SheetTitle>
              <SheetDescription>Atualize as informações do fornecedor.</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor={`fornecedor-nome-${fornecedor.id}`}>Nome *</Label>
            <Input id={`fornecedor-nome-${fornecedor.id}`} {...register("nome")} />
            {errors.nome && (
              <p className="text-sm text-destructive">{errors.nome.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`fornecedor-telefone-${fornecedor.id}`}>Telefone *</Label>
            <Input
              id={`fornecedor-telefone-${fornecedor.id}`}
              value={telefoneDisplay}
              onChange={handleTelefoneChange}
              placeholder="(00) 00000-0000"
              maxLength={15}
            />
            {errors.telefone && (
              <p className="text-sm text-destructive">{errors.telefone.message}</p>
            )}
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

