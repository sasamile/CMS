"use client"

import { toast } from "sonner"
import { Trash2 } from "lucide-react"
import { useEffect, useState, useTransition } from "react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Heading } from "@/components/common/heading"
import { AboutUs } from "@prisma/client"
import { AboutUsForm } from "./about-us-form"
import { AlertModal } from "@/components/common/alert-modal"
import { Button } from "@/components/ui/button"
import { deleteAboutUsSection } from "@/actions/about-us"
import { useAboutUsStore } from "@/stores/about-us"

interface aboutUsInfoProps {
  initialData: AboutUs[]
  selectItems: string[]
}

export function AboutUsClient({ initialData, selectItems }: aboutUsInfoProps) {
  const [loading, startTransition] = useTransition()
  const [open, setOpen] = useState(false)

  const { selectedItem, setSelectedItem } = useAboutUsStore()

  useEffect(() => {
    if (selectItems.length > 0) {
      setSelectedItem(selectItems[0]) // Inicializa con el primer ítem si no hay ninguno seleccionado
    }
  }, [selectItems, setSelectedItem])

  const onConfirm = () => {
    startTransition(async () => {
      const section = initialData.find(
        (section) => section.title === selectedItem
      )
      try {
        if (section?.id && section?.image) {
          const { success, error } = await deleteAboutUsSection(
            section.id,
            section.image
          )

          if (error) {
            toast.error(error)
          }
  
          if (success) {
            toast.success(success)
          }
        }
      } catch {
        toast.error("Algo salió mal.")
      } finally {
        setOpen(false)
      }
    })
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        isLoading={loading}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
      />
      <div className="space-y-6">
        <div className="flex max-sm:flex-col sm:items-center sm:justify-between sm:gap-3 gap-6">
          <Heading
            title={
              selectedItem === "Crear" ? "Agrega información" : selectedItem
            }
            description="Crear, visualiza o modifica la información sobre CACTO"
            className="max-sm:text-start"
          />

          <div className="flex items-center gap-3">
            <Select
              onValueChange={(value) => setSelectedItem(value)}
              value={selectedItem}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent className="z-[9999]">
                {selectItems.map((item, i) => (
                  <SelectItem key={i} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
              {selectedItem !== "Crear" && (
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => {
                    setOpen(true)
                  }}
                  className="dark:bg-red-500"
                >
                  <Trash2 className="size-4" />
                </Button>
              )}
            </Select>
          </div>
        </div>

        <AboutUsForm initialData={initialData} selectedItem={selectedItem} />
      </div>
    </>
  )
}
