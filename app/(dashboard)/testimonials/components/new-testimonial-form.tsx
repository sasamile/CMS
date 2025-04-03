"use client";

import { createTestimonial, updateTestimonial } from "@/actions/testimonials";
import { uploadImage } from "@/actions/uploadthing";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TestimonialSchema } from "@/schemas/testimonials";
import { ImageUp, Loader2, X } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { TestimonialsColumn } from "./columns";

interface NewTestimonialFormProps {
  data?: TestimonialsColumn | null;
  closeModal: () => void;
}

export function NewTestimonialForm({
  data,
  closeModal,
}: NewTestimonialFormProps) {
  const [content, setContent] = useState("");
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [loading, startTransition] = useTransition();

  const [file, setFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!data) {
      clearData();
    } else {
      setContent(data.content);
      setName(data.name);
      setPosition(data.position);
      setImageSrc(data.image || null);
    }
  }, [data]);

  const clearData = () => {
    setContent("");
    setName("");
    setPosition("");
    setImageSrc(null);
    setFile(null);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];

    if (file) {
      const maxSizeInBytes = 1 * 1024 * 1024; // Tamaño máximo de la imagen 4MB
      if (file.size > maxSizeInBytes) {
        setImageSrc(null);
        toast.error(
          "La imagen seleccionada excede el tamaño máximo permitido de 4MB."
        );
        return;
      }

      setFile(file);

      const src = URL.createObjectURL(file);
      setImageSrc(src);

      // Restablecer el valor del campo para permitir la selección del mismo archivo después
      e.target.value = "";
    }
  };

  const handleSubmit = () => {
    startTransition(async () => {
      try {
        let newImage = data?.image;

        const infoData: z.infer<typeof TestimonialSchema> = {
          content: content!,
          name: name!,
          position: position!,
        };

        if (file) {
          const formData = new FormData();
          formData.append("image", file);

          const { success, imageUrl } = await uploadImage(formData);

          if (success && imageUrl) {
            newImage = imageUrl;
          }

          if (!success) {
            toast.error("Algo salió mal al subir la imagen.");
          }
        }

        if (!data) {
          const { error, success } = await createTestimonial(
            infoData,
            newImage!
          );

          if (success) {
            toast.success(success);
            closeModal();
          }

          if (error) {
            toast.error(error);
          }
        }

        if (data) {
          const { error, success } = await updateTestimonial(
            data.id,
            newImage!,
            infoData
          );

          if (success) {
            toast.success(success);
            closeModal();
          }

          if (error) {
            toast.error(error);
          }
        }
      } catch {
        toast.error("Algo salió mal");
      }
    });
  };

  return (
    <div className="select-none flex flex-col items-center justify-center ms:px-6 px-3 py-6 gap-6 border-none">
      <div className="relative">
        <div className="relative size-fit flex items-center justify-center gap-4">
          <div className="size-[120px] rounded-full">
            <label
              htmlFor="fileInput"
              className="relative flex items-center justify-center size-full rounded-full cursor-pointer"
            >
              <div
                className={cn(
                  "flex items-center justify-center z-50 inset-0 size-full rounded-full bg-zinc-600/60 absolute",
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
              {imageSrc && (
                <Image
                  src={imageSrc}
                  alt="image file selected"
                  width={180}
                  height={180}
                  className="object-cover size-full rounded-full"
                />
              )}
            </label>
          </div>
          {imageSrc && (
            <Button
              type="button"
              size="icon"
              variant="destructive"
              className="absolute -top-1 -right-1 dark:bg-red-500 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
                setImageSrc(null);
              }}
            >
              <X className="size-4" />
            </Button>
          )}
        </div>
      </div>
      <div className="space-y-3">
        <blockquote className="text-base font-medium leading-snug italic text-center">
          &quot;
          <p
            contentEditable
            suppressContentEditableWarning
            onInput={(e) => setContent(e.currentTarget.textContent || "")}
            className="inline outline-none focus:outline-none border-none"
          >
            {data
              ? data.content
              : "Escribe aquí el testimonio de la experiencia"}
          </p>
          &quot;
        </blockquote>
        <div className="space-y-1 text-center">
          <h3
            contentEditable
            suppressContentEditableWarning
            onInput={(e) => setName(e.currentTarget.textContent || "")}
            className="text-sm font-bold outline-none focus:outline-none border-none"
          >
            {data ? data.name : "Nombre de la persona"}
          </h3>
          <p
            contentEditable
            suppressContentEditableWarning
            onInput={(e) => setPosition(e.currentTarget.textContent || "")}
            className="text-xs text-gray-500 dark:text-gray-400 outline-none focus:outline-none border-none"
          >
            {data ? data.position : "Cargo de la persona"}
          </p>
        </div>
      </div>
      <div className="w-full">
        <Button
          disabled={!content || !name || !position || !imageSrc || loading}
          onClick={handleSubmit}
          className="h-9 w-full mt-10"
        >
          {loading && <Loader2 className="size-5 animate-spin mr-3" />}
          {data ? "Actualizar" : "Crear"}
        </Button>
      </div>
    </div>
  );
}
