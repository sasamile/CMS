"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function deleteSpecialEventComment(commentId: string) {
  try {
    await db.specialEventComment.delete({
      where: { id: commentId }
    })
    
    revalidatePath("/special-events")
    return { success: "Comentario eliminado." }
  } catch {
    return { error: "Algo salio mal en el proceso." }
  }
}