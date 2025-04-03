import { z } from "zod"

export const BillBoardSchema = z.object({
  title: z.string().min(1).trim(),
  description: z.string().trim().optional(),
  buttonLabel: z.string().min(1).trim(),
  href: z.string().min(1).trim(),
})
