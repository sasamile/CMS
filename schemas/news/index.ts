import { z } from "zod"

export const NewsSchema = z.object({
  title: z
    .string()
    .min(1, "El título es requerido")
    .max(255, "El título es demasiado largo"),
  description: z
    .string()
    .min(1, "La descripción es requerida")
    .max(500, "La descripción es demasiado larga"),
  link: z.string().min(1, "El link es requerido"),
})
