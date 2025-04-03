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
import { Article } from "@prisma/client"
import { AlertModal } from "@/components/common/alert-modal"
import { Button } from "@/components/ui/button"
import { useAboutUsStore } from "@/stores/about-us"
import { ArticleForm } from "./article-form"
import { deleteArticleSection } from "@/actions/article"

interface aboutUsInfoProps {
  initialData: Article[]
  selectItems: string[]
}

export function RelevantArticleClient({ initialData, selectItems }: aboutUsInfoProps) {
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
          const { success, error } = await deleteArticleSection(
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
              selectedItem === "Crear" ? "Nuevo artículo" : selectedItem
            }
            description="Crea, visualiza o modifica la sección de Artículos Relevantes"
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
              <SelectContent className="z-[9999] max-w-[200px]">
                {selectItems.map((item, i) => (
                  <SelectItem key={i} value={item} className="line-clamp-1 py-1 overflow-y-hidden">
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

        <ArticleForm initialData={initialData} selectedItem={selectedItem} />
      </div>
    </>
  )
}
