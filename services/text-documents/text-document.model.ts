import { z } from 'zod'
import { ParagraphSchema } from "./paragraph.model"

export const TextDocumentSchema = z.object({
    id: z.string().oid('The id of a text document must be a valid object id'),
    title: z.string(),
    author: z.string(),
    paragraphs: z.array(ParagraphSchema),
})

export type TextDocument = z.infer<typeof TextDocumentSchema>