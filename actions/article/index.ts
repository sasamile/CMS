"use server"

import { currentUser } from "@/lib/auth-user"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { deleteFile } from "../uploadthing"
import { ArticleSchema } from "@/schemas/article"

export async function createArticleSection(
  articleData: z.infer<typeof ArticleSchema>,
  image: string
) {
  const result = ArticleSchema.safeParse(articleData)

  if (result.error) {
    return { error: "Datos inváidos!" }
  }

  const { title, description, reverse } = result.data

  try {
    await db.article.create({
      data: {
        title,
        description,
        reverse,
        image,
      },
    })

    revalidatePath("/relevant-articles")
    return { success: "Sección de artículo creada." }
  } catch {
    return { error: "Algo salio mal en el proceso." }
  }
}

export async function updateArticleSection(
  articleSectionId: string,
  image: string,
  articleData: z.infer<typeof ArticleSchema>
) {
  const result = ArticleSchema.safeParse(articleData)

  if (result.error) {
    return { error: "Datos inváidos!" }
  }

  if (!articleSectionId) {
    return { error: "Datos inváidos!" }
  }

  const { title, description, reverse } = result.data

  try {
    await db.article.update({
      where: { id: articleSectionId },
      data: {
        title,
        description,
        reverse,
        image,
      },
    })

    revalidatePath("/relevant-articles")
    return { success: "Sección de artículo actualizada." }
  } catch {
    return { error: "Algo salio mal en el proceso." }
  }
}

export async function deleteArticleSection(
  articleSectionId: string,
  image: string
) {
  try {
    const loggedUser = await currentUser()

    if (!loggedUser?.id) {
      return { error: "Acción restringida!" }
    }

    if (!articleSectionId) {
      return { error: "Datos inváidos!" }
    }

    const success = await deleteFile(image)

    if (!success) {
      return { error: "Error al eliminar la imagen" }
    }

    if (success) {
      await db.article.delete({
        where: { id: articleSectionId },
      })
    }
    revalidatePath("/relevant-articles")
    return { success: "Sección de artículo eliminada." }
  } catch {
    return { error: "Algo salió mal en el proceso." }
  }
}
