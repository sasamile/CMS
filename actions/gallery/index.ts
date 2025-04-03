"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createGallery(images: string[]) {
  try {
    // Eliminar todas las imágenes existentes (opcional)
    await db.gallery.deleteMany();

    // Insertar múltiples imágenes
    await db.gallery.createMany({
      data: images.map((imageUrl) => ({ imageUrl })),
    });

    revalidatePath("/gallery")
    return { success: "Proceso exitoso." };
  } catch {
    return { error: "Algo salio mal." };
  }
}
