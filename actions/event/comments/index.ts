"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function deleteEventComment(commentId: string) {
  try {
    await db.eventComment.delete({
      where: { id: commentId }
    })
    
    revalidatePath("/events")
    return { success: "Comentario eliminado." }
  } catch {
    return { error: "Algo salio mal en el proceso." }
  }
}