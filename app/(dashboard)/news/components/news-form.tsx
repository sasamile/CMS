"use client"

import { z } from "zod"
import { News } from "@prisma/client"
import {
  ArrowLeft,
  ImageUp,
  Loader2,
  Trash2,
  X,
} from "lucide-react"
import Image from "next/image"
import { ChangeEvent, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { CustomProvider } from "rsuite"
import "rsuite/dist/rsuite-no-reset.min.css"
import esES from "rsuite/locales/es_ES"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { AlertModal } from "@/components/common/alert-modal"
import { Heading } from "@/components/common/heading"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { zodResolver } from "@hookform/resolvers/zod"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import {
  deleteFile,
  uploadImage,
} from "@/actions/uploadthing"
import { NewsSchema } from "@/schemas/news"
import { createNews, deleteNews, updateNews } from "@/actions/news"

interface EventFormProps {
  initialData: News | null
}

export function NewsForm({ initialData }: EventFormProps) {
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [loadingDelete, startDeleteTransition] = useTransition()

  const [isLoading, startTransition] = useTransition()
  const [imageSrc, setImageSrc] = useState<string | null>(
    initialData?.imageUrl ?? ""
  )

  const [file, setFile] = useState<File | null>(null)

  const title = initialData ? "Editar noticia" : "Crear noticia"
  const description = initialData
    ? "Realiza los cambios que necesites para la noticia"
    : "Agrega una nueva noticia"
  const toastMessage = initialData ? "Noticia actualizada" : "Noticia creada"
  const action = initialData ? "Guardar cambios" : "Crear noticia"

  const form = useForm<z.infer<typeof NewsSchema>>({
    resolver: zodResolver(NewsSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      link: initialData?.link || "",
    },
  })

  const { isSubmitting, isValid } = form.formState

  // Funciones para la elección de la imagen y el podcast
  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files && e.target.files[0]

    if (file) {
      const maxSizeInBytes = 1 * 1024 * 1024 // Tamaño máximo de la imagen 4MB
      if (file.size > maxSizeInBytes) {
        setImageSrc(null)
        toast.error(
          "La imagen seleccionada excede el tamaño máximo permitido de 4MB."
        )
        return
      }

      setFile(file)

      const src = URL.createObjectURL(file)
      setImageSrc(src)

      // Restablecer el valor del campo para permitir la selección del mismo archivo después
      e.target.value = ""
    }
  }

  const onSubmit = (values: z.infer<typeof NewsSchema>) => {
    const formData = new FormData()

    // Agregar la imagen principal si existe
    if (file) {
      formData.append("image", file)
    }

    startTransition(async () => {
      try {
        let billboardImage = initialData?.imageUrl || ""

        // Si hay una nueva imagen principal, subirla
        if (file) {
          const mainImageResult = await uploadImage(formData)
          if (!mainImageResult.success || !mainImageResult.imageUrl) {
            throw new Error("Error uploading main image")
          }
          billboardImage = mainImageResult.imageUrl

          // Eliminar la imagen principal anterior si existe
          if (initialData?.imageUrl) {
            await deleteFile(initialData.imageUrl)
          }
        }

        if (!initialData) {
          await creationProcess(values, billboardImage)
        } else {
          await updateProcess(values, billboardImage)
        }
      } catch {
        toast.error("Algo salió mal en la subida de los archivos multimedia.")
      }
    })
  }

  const creationProcess = async (
    values: z.infer<typeof NewsSchema>,
    billboardImage: string,
  ) => {
    try {
      const { success, error } = await createNews(
        values,
        billboardImage,
      )

      if (success) {
        toast.success(toastMessage)
        router.push("/news")
      }

      if (error) {
        toast.error(error)
      }
    } catch {
      toast.error("Algo salio mal al crear la noticia.")
    }
  }

  const updateProcess = async (
    values: z.infer<typeof NewsSchema>,
    billboardImage: string,
  ) => {
    try {
      if (initialData && initialData.id) {
        const { success, error } = await updateNews(
          initialData.id,
          values,
          billboardImage,
        )

        if (success) {
          toast.success(toastMessage)
          router.push("/news")
        }

        if (error) {
          toast.error(error)
        }
      }
    } catch {
      toast.error("Algo salió mal en la actualización de la noticia.")
    }
  }

  const handleDeletionConfirmation = () => {
    if (initialData) {
      const filesToDelete = [
        initialData.imageUrl,
      ]

      startDeleteTransition(async () => {
        try {
          const { success, error } = await deleteNews(
            initialData.id,
            filesToDelete
          )

          if (error) {
            toast.error(error)
          }

          if (success) {
            router.push("/news")
            toast.success(success)
          }
        } catch {
          toast.error("Algo salió mal al eliminar la noticia.")
        } finally {
          setOpen(false)
        }
      })
    }
  }

  return (
    <CustomProvider locale={esES}>
      <div className="space-y-6">
        <AlertModal
          isLoading={loadingDelete}
          isOpen={open}
          onClose={() => setOpen(false)}
          onConfirm={handleDeletionConfirmation}
        />

        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/news")}
          className="p-0 size-fit hover:bg-transparent dark:hover:bg-transparent mb-2"
        >
          <ArrowLeft className="size-5 mr-2" />
          <span className="text-base text-muted-foreground">Volver</span>
        </Button>
        <div className="flex max-xs:flex-col xs:items-center xs:justify-between gap-3">
          <Heading title={title} description={description} />
          {initialData && (
            <Button
              variant="destructive"
              size="icon"
              onClick={() => {
                setOpen(true)
              }}
              className="dark:bg-red-500 max-xs:w-full items-center"
            >
              <Trash2 className="size-4 max-xs:mr-2" />
              <p className="xs:hidden">Eliminar noticia</p>
            </Button>
          )}
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-5 mb-5">
              <Label className="text-xl font-semibold tracking-tight">
                Imagen principal de la noticia *
              </Label>
              <div className="relative size-fit flex items-center justify-center gap-4">
                <div className="size-[180px] rounded-lg mb-3">
                  <label
                    htmlFor="fileInput"
                    className="relative flex items-center justify-center size-full rounded-lg cursor-pointer"
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center z-50 inset-0 size-full rounded-lg bg-zinc-600/60 absolute",
                        imageSrc && "hidden"
                      )}
                    >
                      <ImageUp className="text-white size-2/5" />
                    </div>
                    <input
                      id="fileInput"
                      name="file"
                      type="file"
                      accept="image/*"
                      onChange={handleChange}
                      hidden
                    />
                    {initialData?.imageUrl && !imageSrc && (
                      <Image
                        src={initialData?.imageUrl}
                        alt="image file selected"
                        width={180}
                        height={180}
                        className="object-cover size-full rounded-lg"
                      />
                    )}
                    {imageSrc && (
                      <Image
                        src={imageSrc}
                        alt="image file selected"
                        width={180}
                        height={180}
                        className="object-cover size-full rounded-lg"
                      />
                    )}
                  </label>
                </div>
                {imageSrc && (
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="absolute top-1 right-1 dark:bg-red-500 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation()
                      setFile(null)
                      setImageSrc(null)
                    }}
                  >
                    <X className="size-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <Label className="text-xl font-semibold tracking-tight">
                  Informacion General
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 lg:gap-8">
                  <FormField
                    name="title"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título *</FormLabel>
                        <FormControl>
                          <Input
                            variant="largeRounded"
                            placeholder="Titulo del noticia"
                            disabled={isSubmitting}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="description"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción *</FormLabel>
                        <FormControl>
                          <Input
                            variant="largeRounded"
                            placeholder="Descripción del noticia"
                            disabled={isSubmitting}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="link"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dirección del evento *</FormLabel>
                        <FormControl>
                          <Input
                            variant="largeRounded"
                            placeholder="Enlace de la noticia"
                            disabled={isSubmitting}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 pb-2 text-end">
              <Button
                type="submit"
                disabled={
                  isSubmitting ||
                  !isValid ||
                  !imageSrc ||
                  isLoading
                }
                className="font-semibold"
              >
                {isSubmitting ||
                  (isLoading && (
                    <Loader2 className="size-5 mr-3 animate-spin" />
                  ))}
                {action}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </CustomProvider>
  )
}
