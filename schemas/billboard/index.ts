// @/schemas/billboard.ts
import { z } from "zod";

export const BillBoardSchema = z.object({
  title: z
    .string()
    .min(1, { message: "El título es requerido" })
    .max(80, { message: "El título no puede exceder los 50 caracteres" }),
  description: z
    .string()
    .max(110, { message: "La descripción no puede exceder los 50 caracteres" })
    .optional(),
  buttonLabel: z
    .string()
    .min(1, { message: "La etiqueta del botón es requerida" })
    .max(80, { message: "La etiqueta del botón no puede exceder los 50 caracteres" }),
  href: z
    .string()
    .min(1, { message: "El enlace es requerido" })
    .url({ message: "Debe ser una URL válida (ej. https://example.com)" }),
});