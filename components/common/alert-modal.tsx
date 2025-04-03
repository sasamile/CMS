"use client"

import { Loader2 } from "lucide-react"
import { Button } from "../ui/button"
import Modal from "./modal"

interface AlertModalProps {
  isOpen: boolean
  isLoading: boolean
  onClose: () => void
  onConfirm: () => void
}

export function AlertModal({
  isOpen,
  isLoading,
  onClose,
  onConfirm,
}: AlertModalProps) {
  return (
    <Modal
      title="¿Estás completamente seguro?"
      descripion="Después de confirmar los cambios no se podrán revertir."
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="flex items-center justify-end gap-2">
        <Button disabled={isLoading} variant="ghost" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          disabled={isLoading}
          variant="destructive"
          onClick={onConfirm}
          className="dark:bg-red-500"
        >
          {isLoading && <Loader2 className="size-4 mr-2 animate-spin" />}
          Continuar
        </Button>
      </div>
    </Modal>
  )
}
