"use server"

import { currentUser } from "@/lib/auth-user"
import { db } from "@/lib/db"
import { AboutUsSchema } from "@/schemas/about-us"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { deleteFile } from "../uploadthing"

export async function createAboutUsSection(
  aboutUsData: z.infer<typeof AboutUsSchema>,
  image: string
) {
  const result = AboutUsSchema.safeParse(aboutUsData)

  if (result.error) {
    return { error: "Datos inváidos!" }
  }

  const { title, description, reverse } = result.data

  try {
    await db.aboutUs.create({
      data: {
        title,
        description,
        reverse,
        image,
      },
    })

    revalidatePath("/about-us")
    return { success: "Sección informativa creada." }
  } catch {
    return { error: "Algo salio mal en el proceso." }
  }
}

export async function updateAboutUsSection(
  aboutUsSectionId: string,
  image: string,
  aboutUsData: z.infer<typeof AboutUsSchema>
) {
  const result = AboutUsSchema.safeParse(aboutUsData)

  if (result.error) {
    return { error: "Datos inváidos!" }
  }

  if (!aboutUsSectionId) {
    return { error: "Datos inváidos!" }
  }

  const { title, description, reverse } = result.data

  try {
    await db.aboutUs.update({
      where: { id: aboutUsSectionId },
      data: {
        title,
        description,
        reverse,
        image,
      },
    })

    revalidatePath("/about-us")
    return { success: "Sección informativa actualizada." }
  } catch {
    return { error: "Algo salio mal en el proceso." }
  }
}

export async function deleteAboutUsSection(
  aboutUsSectionId: string,
  image: string
) {
  try {
    const loggedUser = await currentUser()

    if (!loggedUser?.id) {
      return { error: "Acción restringida!" }
    }

    if (!aboutUsSectionId) {
      return { error: "Datos inváidos!" }
    }

    const success = await deleteFile(image)

    if (!success) {
      return { error: "Error al eliminar la imagen" }
    }

    if (success) {
      await db.aboutUs.delete({
        where: { id: aboutUsSectionId },
      })
    }
    revalidatePath("/about-us")
    return { success: "Sección informativa eliminada." }
  } catch {
    return { error: "Algo salió mal en el proceso." }
  }
}
