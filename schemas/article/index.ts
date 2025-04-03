import { z } from "zod"

export const ArticleSchema = z.object({
  title: z.string().min(1).trim(),
  description: z.string().min(1).trim(),
  reverse: z.boolean()
})