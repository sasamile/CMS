"use server"

import { z } from "zod"
import { BillBoardSchema } from "@/schemas/billboard"
import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { currentUser } from "@/lib/auth-user"
import { deleteFile } from "../uploadthing"

export async function createBillboard(
  billboardData: z.infer<typeof BillBoardSchema>,
  image: string
) {
  const result = BillBoardSchema.safeParse(billboardData)

  if (result.error) {
    return { error: "Datos inváidos!" }
  }

  const { title, description, buttonLabel, href } = result.data

  try {
    await db.billboard.create({
      data: {
        title,
        description,
        buttonLabel,
        href,
        image,
      },
    })

    revalidatePath("/billboards")
    return { success: "Cartel publicitario creado." }
  } catch (error) {
    return { error: "Algo salio mal en el proceso." }
  }
}

export async function updateBillboard(
  billboardId: string,
  image: string,
  billboardData: z.infer<typeof BillBoardSchema>
) {
  const result = BillBoardSchema.safeParse(billboardData)

  if (result.error) {
    return { error: "Datos inváidos!" }
  }

  if (!billboardId) {
    return { error: "Datos inváidos!" }
  }

  const { title, description, buttonLabel, href } = result.data

  try {
    await db.billboard.update({
      where: { id: billboardId },
      data: {
        title,
        description,
        buttonLabel,
        href,
        image,
      },
    })

    revalidatePath("/billboards")
    return { success: "Cartel publicitario actualizado." }
  } catch (error) {
    return { error: "Algo salio mal en el proceso." }
  }
}

export async function deleteBillboard(billboardId: string, image: string) {
  try {
    const loggedUser = await currentUser()

    if (!loggedUser?.id) {
      return { error: "Acción restringida!" }
    }

    if (!billboardId) {
      return { error: "Datos inváidos!" }
    }

    const success = await deleteFile(image)

    if (!success) {
      return { error: "Error al eliminar la imagen" }
    }

    if (success) {
      await db.billboard.delete({
        where: { id: billboardId },
      })
    }
    revalidatePath("/billboards")
    return { success: "Cartel publicitario eliminado." }
  } catch (error) {
    return { error: "Algo salió mal en el proceso." }
  }
}
