import { z } from "zod"

export const TestimonialSchema = z.object({
  content: z.string().min(1).trim(),
  name: z.string().min(1).trim(),
  position: z.string().min(1).trim(),
})