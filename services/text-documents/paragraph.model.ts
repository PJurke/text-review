import { z } from "zod"

export const ParagraphSchema = z.object({
    id: z.string().oid('The id of a paragraph must be a valid object id'),
    text: z.string(),
})