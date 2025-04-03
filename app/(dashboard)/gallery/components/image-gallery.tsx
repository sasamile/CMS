"use client";

import Image from "next/image";
import { ChangeEvent, useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ImagePlus, Images, Loader2, X } from "lucide-react";
import { deleteFiles, uploadImages } from "@/actions/uploadthing";
import { createGallery } from "@/actions/gallery";

interface ImageGalleryProps {
  galleryData: string[];
}

export default function ImageGallery({ galleryData }: ImageGalleryProps) {
  const [imageFiles, setImageFiles] = useState<File[] | null>(null);
  const [imagesSrc, setImagesSrc] = useState<string[]>(galleryData);
  const [isLoading, startTransition] = useTransition();
  const [selectedImage, setSelectedImage] = useState<string | null>(
    imagesSrc[0]
  );

  const handleMultipleImageSelection = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files) return;

    const maxSizeInBytes = 4 * 1024 * 1024; // Tamaño máximo por imagen (4MB)
    const selectedFiles = Array.from(files);

    // Verifica si alguna imagen excede el tamaño permitido
    const validFiles = selectedFiles.filter((file) => {
      if (file.size > maxSizeInBytes) {
        toast.error(
          `La imagen ${file.name} excede el tamaño máximo permitido de 4MB.`
        );
        return false;
      }
      return true;
    });

    // Si hay imágenes válidas, las agregamos al estado
    if (validFiles.length > 0) {
      const imageUrls = validFiles.map((file) => URL.createObjectURL(file));
      setImagesSrc((prevImages) =>
        prevImages ? [...prevImages, ...imageUrls] : imageUrls
      );
      setImageFiles((prevFiles) =>
        prevFiles ? [...prevFiles, ...validFiles] : validFiles
      );
      setSelectedImage(imageUrls[0]);
    }

    // Restablecer el valor del input para permitir la selección del mismo archivo después
    e.target.value = "";
  };

  const onSubmit = () => {
    const formData = new FormData();

    // Agregar las imágenes múltiples al mismo campo del FormData
    if (imageFiles && imageFiles.length > 0) {
      imageFiles.forEach((imageFile) => {
        formData.append("images", imageFile); // Todas las imágenes se agregan bajo el mismo campo 'images'
      });
    }

    startTransition(async () => {
      try {
        let images = galleryData || [];

        // Si hay nuevas imágenes adicionales, subirlas
        if (imageFiles && imageFiles.length > 0) {
          const imagesResult = await uploadImages(formData);
          if (!imagesResult.success || !imagesResult.imageUrls) {
            throw new Error("Error uploading event images");
          }

          // Agregar las nuevas imágenes a la lista de imágenes existentes
          images = [...images, ...imagesResult.imageUrls.map((img) => img.url)];
        }

        // Si hay imágenes eliminadas, eliminarlas del servidor
        const removedImages = galleryData?.filter(
          (img) => !imagesSrc?.includes(img)
        );
        if (removedImages && removedImages.length > 0) {
          await deleteFiles(removedImages);
          // Actualizar la lista de imágenes existentes
          images = images.filter((img) => !removedImages.includes(img));
        }

        await creationProcess(images);
      } catch {
        toast.error("Algo salió mal en la subida de los archivos multimedia.");
      }
    });
  };

  const creationProcess = async (images: string[]) => {
    try {
      const { success, error } = await createGallery(images);

      if (success) {
        toast.success(success);
      }

      if (error) {
        toast.error(error);
      }
    } catch {
      toast.error("Algo salio mal en el proceso.");
    }
  };

  return (
    <div>
      <div className="flex max-sm:flex-col justify-center gap-4 p-4 xl:max-w-6xl w-full mx-auto">
        <div className="sm:flex-1 relative xl:max-w-6xl max-sm:h-[60vh] rounded-md bg-muted">
          {!selectedImage && (
            <div className="size-full flex items-center justify-center">
              <Images className="size-16 text-muted-foreground" />
            </div>
          )}
          {selectedImage && (
            <Image
              src={selectedImage}
              alt="Selected"
              fill
              className="absolute w-full h-full object-cover rounded-md"
            />
          )}
        </div>
        <div className="sm:grid sm:grid-cols-[repeat(auto-fill,minmax(100px,1fr))] sm:gap-2 flex max-sm:space-x-2 max-sm:overflow-x-auto overflow-auto sm:h-[511.934px]">
          <div className="flex max-md:flex-col gap-2 w-full">
            <div className="relative size-fit flex items-center justify-center gap-4">
              <div className="w-24 h-20 min-w-24 min-h-20 sm:w-32 lg:w-40 lg:h-24 rounded-lg mb-3">
                <label
                  htmlFor="multipleFileInput"
                  className="relative flex items-center justify-center size-full rounded-lg cursor-pointer"
                >
                  <div className="flex items-center justify-center inset-0 size-full rounded-lg bg-zinc-600/60 absolute">
                    <ImagePlus className="text-white size-2/5" />
                  </div>
                  <input
                    id="multipleFileInput"
                    name="file"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleMultipleImageSelection}
                    hidden
                  />
                </label>
              </div>
            </div>
          </div>
          {imagesSrc?.map((image, index) => (
            <Button
              variant="ghost"
              key={index}
              className={cn(
                "group grow relative w-24 h-20 min-w-24 min-h-20 sm:w-32 lg:w-40 lg:h-24 overflow-hidden transition-shadow hover:shadow-lg",
                selectedImage === image && "border-2 border-blue-500"
              )}
              onClick={() => setSelectedImage(image)}
            >
              <Image
                src={image}
                alt={`Thumbnail ${index}`}
                fill
                className={cn(
                  "absolute w-full h-full object-cover rounded-sm transition-transform duration-300 group-hover:scale-[1.3]"
                )}
              />

              <div
                className="flex items-center justify-center h-10 w-10 absolute top-0 right-0 dark:bg-red-500 rounded-full z-50"
                onClick={(e) => {
                  e.stopPropagation();
                  setImagesSrc((prev) => {
                    const updatedImages = prev.filter((_, i) => i !== index);
                    let newSelectedImage = null;

                    if (updatedImages.length > 0) {
                      // Intenta seleccionar la imagen anterior, si existe
                      newSelectedImage =
                        prev[index - 1] ?? prev[index + 1] ?? null;
                    }

                    setSelectedImage(newSelectedImage);
                    return updatedImages;
                  });
                  setImageFiles(
                    (prev) => prev?.filter((_, i) => i !== index) || null
                  );
                }}
              >
                <X className="size-4" />
              </div>
            </Button>
          ))}
        </div>
      </div>
      <div className="max-w-6xl w-full px-4 pt-3 pb-2 text-end mx-auto">
        <Button
          type="submit"
          disabled={isLoading}
          className="font-semibold"
          onClick={onSubmit}
        >
          {isLoading && <Loader2 className="size-5 mr-3 animate-spin" />}
          Guardar cambios
        </Button>
      </div>
    </div>
  );
}
