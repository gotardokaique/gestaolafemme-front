"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface DialogRevogarTokenProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function DialogRevogarToken({ open, onOpenChange, onConfirm }: DialogRevogarTokenProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Revogar API Key</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja revogar este token? Qualquer integração ou aplicativo usando esta chave perderá acesso imediatamente. Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Sim, Revogar Token
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
