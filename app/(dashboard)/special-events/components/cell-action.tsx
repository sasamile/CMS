"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Edit, MoreHorizontal, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState, useTransition } from "react"
import { AlertModal } from "@/components/common/alert-modal"
import { toast } from "sonner"
import { SpecialEventsColumn } from "./columns"
import { deleteEvent, getEventById } from "@/actions/event"
import { Event } from "@prisma/client"

interface CellActionProps {
  eventData: SpecialEventsColumn
}

export function CellAction({ eventData }: CellActionProps) {
  const router = useRouter()

  const [open, setOpen] = useState<boolean>(false)
  const [isLoading, startTransition] = useTransition()
  const [event, setEvent] = useState<Event | null>(null)

  useEffect(() => {
    const getEventData = async () => {
      const event = await getEventById(eventData.id)
      setEvent(event)
    }

    getEventData()
  }, [eventData.id])

  const handleConfirm = () => {
    if (event) {
      const filesToDelete = [...event.images, event.billboard, event.podcastUrl]
      startTransition(async () => {
        try {
          if (event && event.id) {
            const { success, error } = await deleteEvent(
              event.id,
              filesToDelete as Array<string>
            )

            if (error) {
              toast.error(error)
            }

            if (success) {
              toast.success(success)
            }
          }
        } catch {
          toast.error("Algo salió mal al eliminar el evento.")
        } finally {
          setOpen(false)
        }
      })
    }
  }

  return (
    <>
      <AlertModal
        isLoading={isLoading}
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleConfirm}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <span className="sr-only">Abrir menú</span>
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() => router.push(`/special-events/${eventData.id}`)}
          >
            <Edit className="size-4 mr-2" />
            Editar
          </DropdownMenuItem>
      
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
