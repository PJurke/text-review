import { z } from 'zod'
import Paragraph, { ParagraphSchema } from "./Paragraph"

export default interface TextDocument {
    id: string
    title: string
    author: string
    paragraphs: Paragraph[]
}

export const TextDocumentSchema = z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'The id of a text document must be a valid object id'),
    title: z.string(),
    author: z.string(),
    paragraphs: z.array(ParagraphSchema),
})