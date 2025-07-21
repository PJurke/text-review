import { z } from "zod"
import "@/lib/zod/extensions"

export const ParagraphSchema = z.object({
    id: z.string().oid('The id of a paragraph must be a valid object id'),
    text: z.string(),
})