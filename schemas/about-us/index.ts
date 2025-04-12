import { z } from "zod"

export const AboutUsSchema = z.object({
  title: z.string().min(1).trim().max(80),
  description: z.string().min(1).trim().max(890),
  reverse: z.boolean()
})