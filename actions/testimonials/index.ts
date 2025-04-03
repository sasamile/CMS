"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { TestimonialSchema } from "@/schemas/testimonials";
import { currentUser } from "@/lib/auth-user";
import { deleteFile } from "../uploadthing";

export async function createTestimonial(
  testimonial: z.infer<typeof TestimonialSchema>,
  imageUrl: string
) {
  const result = TestimonialSchema.safeParse(testimonial);

  if (result.error) {
    return { error: "Datos inváidos!" };
  }

  const { content, name, position } = result.data;

  try {
    await db.testimonials.create({
      data: {
        content,
        name,
        position,
        imageUrl,
      },
    });

    revalidatePath("/testimonials");
    return { success: "Testimonio creado." };
  } catch {
    return { error: "Algo salio mal en el proceso." };
  }
}

export async function updateTestimonial(
  testimonialId: string,
  imageUrl: string,
  testimonialData: z.infer<typeof TestimonialSchema>
) {
  const result = TestimonialSchema.safeParse(testimonialData)

  if (result.error) {
    return { error: "Datos inváidos!" }
  }

  if (!testimonialId) {
    return { error: "Datos inváidos!" }
  }

  const { content, name, position } = result.data

  try {
    await db.testimonials.update({
      where: { id: testimonialId },
      data: {
        content,
        name,
        position,
        imageUrl,
      },
    })

    revalidatePath("/testimonials")
    return { success: "Testimonio actualizado." }
  } catch {
    return { error: "Algo salio mal en el proceso." }
  }
}

export async function deleteTestimonial(
  testimonialId: string,
  image: string
) {
  try {
    const loggedUser = await currentUser()

    if (!loggedUser?.id) {
      return { error: "Acción restringida!" }
    }

    if (!testimonialId) {
      return { error: "Datos inváidos!" }
    }

    const success = await deleteFile(image)

    if (!success) {
      return { error: "Error al eliminar la imagen" }
    }

    if (success) {
      await db.testimonials.delete({
        where: { id: testimonialId },
      })
    }
    revalidatePath("/testimonials")
    return { success: "Sección informativa eliminada." }
  } catch {
    return { error: "Algo salió mal en el proceso." }
  }
}