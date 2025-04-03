import { z } from "zod"

export const EventSchema = z.object({
  title: z
    .string()
    .min(1, "El título es requerido")
    .max(255, "El título es demasiado largo"),
  description: z
    .string()
    .min(1, "La descripción es requerida")
    .max(500, "La descripción es demasiado larga"),
  address: z.string().min(1, "La dirección es requerida"),
  startDate: z.date({
    required_error: "La fecha de inicio es requerida",
    invalid_type_error: "Formato de fecha inválido",
  }),
  endDate: z.date({
    required_error: "La fecha de finalización es requerida",
    invalid_type_error: "Formato de fecha inválido",
  }),
  // videoUrl: z.string().url("La URL del video debe ser válida").optional()
  // billboard: z.string().url("La URL del billboard debe ser válida"),
  // images: z.array(z.string().url("Cada imagen debe ser una URL válida")),
  // podcastUrl: z.string().url("La URL del podcast debe ser válida"),
})
