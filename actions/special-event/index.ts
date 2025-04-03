"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { EventSchema } from "@/schemas/event"
import { currentUser } from "@/lib/auth-user"
import { deleteFiles } from "../uploadthing"

export async function getSpecialEventById(eventId: string) {
  try {
    const event = await db.specialEvent.findUnique({
      where: { id: eventId },
      include: {
        comments: true
      }
    })

    return event
  } catch {
    return null
  }
}

export async function createSpecialEvent(
  eventData: z.infer<typeof EventSchema>,
  billboardImge: string,
  images: string[],
  podcast: string,
  videoUrl?: string
) {
  const result = EventSchema.safeParse(eventData)

  if (result.error) {
    return { error: "Datos inváidos!" }
  }

  const { title, description, address, startDate, endDate } =
    result.data

  try {
    await db.specialEvent.create({
      data: {
        title,
        description,
        address,
        startDate,
        endDate,
        videoUrl,
        billboard: billboardImge,
        images,
        podcastUrl: podcast,
      },
    })

    revalidatePath("/special-events")
    return { success: "Evento creado." }
  } catch {
    return { error: "Algo salio mal en el proceso." }
  }
}

export async function updateSpecialEvent(
  eventId: string,
  eventData: z.infer<typeof EventSchema>,
  images: string[],
  billboardImage: string,
  audioUrl: string,
  videoUrl?: string
) {
  const result = EventSchema.safeParse(eventData)

  if (result.error) {
    return { error: "Datos inváidos!" }
  }

  if (!eventId) {
    return { error: "Datos inváidos!" }
  }

  const { title, description, address, startDate, endDate } =
    result.data

  try {
    await db.specialEvent.update({
      where: { id: eventId },
      data: {
        title,
        description,
        address,
        startDate,
        endDate,
        videoUrl,
        images,
        billboard: billboardImage,
        podcastUrl: audioUrl,
      },
    })

    revalidatePath("/special-events")
    return { success: "Evento actualizado." }
  } catch {
    return { error: "Algo salio mal en el proceso." }
  }
}

export async function deleteSpecialEvent(eventId: string, files: string[]) {
  try {
    const loggedUser = await currentUser()

    if (!loggedUser?.id) {
      return { error: "Acción restringida!" }
    }

    if (!eventId) {
      return { error: "Datos inváidos!" }
    }

    const success = await deleteFiles(files)

    if (!success) {
      return { error: "Error al eliminar los archivos" }
    }

    if (success) {
      await db.specialEvent.delete({
        where: { id: eventId },
      })
    }
    revalidatePath("/special-events")
    return { success: "Evento eliminado." }
  } catch {
    return { error: "Algo salió mal en el proceso." }
  }
}
