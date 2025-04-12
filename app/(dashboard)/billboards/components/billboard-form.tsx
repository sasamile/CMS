// Tu componente existente con ajustes
"use client";

import { Billboard } from "@prisma/client";
import { ArrowLeft, ImageUp, Loader2, Trash2, X } from "lucide-react";
import { ChangeEvent, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { Heading } from "@/components/common/heading";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BillBoardSchema } from "@/schemas/billboard";
import BillboardPreview from "./billboard-preview";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { uploadImage } from "@/actions/uploadthing";
import {
  createBillboard,
  deleteBillboard,
  updateBillboard,
} from "@/actions/billboard";
import { AlertModal } from "@/components/common/alert-modal";

interface BillboardFormProps {
  initialData: Billboard | null;
}

export function BillboardForm({ initialData }: BillboardFormProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [isLoading, startTransition] = useTransition();
  const [imageSrc, setImageSrc] = useState<string | null>(
    initialData?.image ?? ""
  );
  const [file, setFile] = useState<File | null>(null);

  // Estado para los inputs
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    buttonLabel: initialData?.buttonLabel || "",
    href: initialData?.href || "",
    image: initialData?.image || "",
  });

  const title = initialData
    ? "Editar cartel publicitario"
    : "Crear cartel publicitario";
  const description = initialData
    ? "Realiza los cambios que necesites para el cartel publicitario"
    : "Agrega un nuevo cartel publicitario";
  const toastMessage = initialData
    ? "Cartel publicitario actualizado"
    : "Cartel publicitario creado";
  const action = initialData ? "Guardar cambios" : "Crear cartel publicitario";

  const form = useForm<z.infer<typeof BillBoardSchema>>({
    resolver: zodResolver(BillBoardSchema),
    defaultValues: {
      title: formData.title || "",
      description: formData.description || "",
      href: formData.href || "",
      buttonLabel: formData.buttonLabel || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof BillBoardSchema>) => {
    try {
      let newImage = initialData?.image;

      if (file) {
        const formData = new FormData();
        formData.append("image", file);

        const { success, imageUrl } = await uploadImage(formData);

        if (success && imageUrl) {
          newImage = imageUrl;
        }

        if (!success) {
          return toast.error("Algo salió mal al subir la imagen.");
        }
      }

      if (!initialData) {
        creationProcess(values, newImage);
      }

      if (initialData) {
        updateProcess(values, newImage!);
      }
    } catch {
      toast.error("Algo salió mal.");
    }
  };

  const creationProcess = async (
    values: z.infer<typeof BillBoardSchema>,
    imageUrl: string | undefined
  ) => {
    try {
      const { success, error } = await createBillboard(values, imageUrl!);

      if (success) {
        toast.success(toastMessage);
        router.push("/billboards");
      }

      if (error) {
        toast.error(error);
      }
    } catch {
      toast.error("Algo salió mal al crear el cartel publicitario.");
    }
  };

  const updateProcess = async (
    values: z.infer<typeof BillBoardSchema>,
    imageUrl: string
  ) => {
    try {
      if (initialData && initialData.id) {
        const { success, error } = await updateBillboard(
          initialData.id,
          imageUrl,
          values
        );

        if (success) {
          toast.success(toastMessage);
          router.push("/billboards");
        }

        if (error) {
          toast.error(error);
        }
      }
    } catch {
      toast.error("Algo salió mal en la actualización.");
    }
  };

  const handleDeletionConfirmation = () => {
    startTransition(async () => {
      try {
        if (initialData && initialData.id) {
          const { success, error } = await deleteBillboard(
            initialData.id,
            initialData.image
          );

          if (error) {
            toast.error(error);
          }

          if (success) {
            router.push("/billboards");
            toast.success(success);
          }
        }
      } catch {
        toast.error("Algo salió mal al eliminar el cartel publicitario.");
      } finally {
        setOpen(false);
      }
    });
  };

  // Actualizar el estado conforme se editen los campos
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Funciones para la elección de la imagen para el cartel
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];

    if (file) {
      const maxSizeInBytes = 1 * 1024 * 1024; // Tamaño máximo de la imagen 1MB
      if (file.size > maxSizeInBytes) {
        setImageSrc(null);
        toast.error(
          "La imagen seleccionada excede el tamaño máximo permitido de 1MB."
        );
        return;
      }

      setFile(file);

      const src = URL.createObjectURL(file);
      setImageSrc(src);

      // Actualizar el campo image en formData con la URL de la imagen
      setFormData((prevData) => ({
        ...prevData,
        image: src,
      }));
    }
  };

  return (
    <div className="space-y-6">
      <AlertModal
        isLoading={isLoading}
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDeletionConfirmation}
      />

      <Button
        variant="ghost"
        size="icon"
        onClick={() => router.push("/billboards")}
        className="p-0 size-fit hover:bg-transparent dark:hover:bg-transparent mb-2"
      >
        <ArrowLeft className="size-5 mr-2" />
        <span className="text-base text-muted-foreground">Volver</span>
      </Button>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            variant="destructive"
            size="icon"
            onClick={() => {
              setOpen(true);
            }}
            className="dark:bg-red-500"
          >
            <Trash2 className="size-4" />
          </Button>
        )}
      </div>
      <BillboardPreview
        title={formData.title || "Sin título"}
        description={formData.description}
        buttonLabel={formData.buttonLabel || "Sin etiqueta"}
        imageSrc={imageSrc}
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-5 mb-5">
            <Label className="text-xl font-semibold tracking-tight">
              Imagen de fondo para el cartel *
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
                  {initialData?.image && !imageSrc && (
                    <Image
                      src={initialData?.image}
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
                    e.stopPropagation();
                    setFormData((prevData) => ({
                      ...prevData,
                      image: "",
                    }));
                    setImageSrc(null);
                    setFile(null);
                  }}
                >
                  <X className="size-4" />
                </Button>
              )}
            </div>
          </div>

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
                      maxLength={80}
                      placeholder="Título del cartel publicitario"
                      disabled={isSubmitting}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleInputChange(e);
                      }}
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
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Input
                      variant="largeRounded"
                      maxLength={110}
                      placeholder="Descripción del cartel publicitario"
                      disabled={isSubmitting}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleInputChange(e);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="buttonLabel"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Etiqueta del botón *</FormLabel>
                  <FormControl>
                    <Input
                      variant="largeRounded"
                      maxLength={80}
                      placeholder="Etiqueta"
                      disabled={isSubmitting}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleInputChange(e);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="href"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enlace del botón *</FormLabel>
                  <FormControl>
                    <Input
                      variant="largeRounded"
                      placeholder="https://example.com"
                      disabled={isSubmitting}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleInputChange(e);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="pt-3 pb-2 text-end">
            <Button
              type="submit"
              disabled={isSubmitting || !isValid || !formData.image}
              className="font-semibold"
            >
              {isSubmitting && <Loader2 className="size-5 mr-3 animate-spin" />}
              {action}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}