"use server"

import { z } from "zod"
import { NewsSchema } from "@/schemas/news"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { currentUser } from "@/lib/auth-user"
import { deleteFiles } from "../uploadthing"

export async function createNews(
  newsData: z.infer<typeof NewsSchema>,
  billboardImge: string,
) {
  const result = NewsSchema.safeParse(newsData)

  if (result.error) {
    return { error: "Datos inváidos!" }
  }

  const { title, description, link } =
    result.data

  try {
    await db.news.create({
      data: {
        title,
        description,
        link,
        imageUrl: billboardImge,
      },
    })

    revalidatePath("/news")
    return { success: "Noticia creada." }
  } catch {
    return { error: "Algo salio mal en el proceso." }
  }
}

export async function updateNews(
  newsId: string,
  newsData: z.infer<typeof NewsSchema>,
  billboardImage: string,
) {
  const result = NewsSchema.safeParse(newsData)

  if (result.error) {
    return { error: "Datos inváidos!" }
  }

  if (!newsId) {
    return { error: "Datos inváidos!" }
  }

  const { title, description, link } =
    result.data

  try {
    await db.news.update({
      where: { id: newsId },
      data: {
        title,
        description,
        link,
        imageUrl: billboardImage,
      },
    })

    revalidatePath("/news")
    return { success: "Noticia actualizada." }
  } catch {
    return { error: "Algo salio mal en el proceso." }
  }
}

export async function deleteNews(newsId: string, files: string[]) {
  try {
    const loggedUser = await currentUser()

    if (!loggedUser?.id) {
      return { error: "Acción restringida!" }
    }

    if (!newsId) {
      return { error: "Datos inváidos!" }
    }

    const success = await deleteFiles(files)

    if (!success) {
      return { error: "Error al eliminar los archivos" }
    }

    if (success) {
      await db.news.delete({
        where: { id: newsId },
      })
    }
    revalidatePath("/news")
    return { success: "Noticia eliminada." }
  } catch {
    return { error: "Algo salió mal en el proceso." }
  }
}