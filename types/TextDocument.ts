import { z } from 'zod'
import Highlight, { HighlightSchema } from './Highlight'
import Paragraph, { ParagraphSchema } from "./Paragraph"

export default interface TextDocument {
    id: string
    title: string
    author: string
    paragraphs: Paragraph[]
    highlights: Highlight[]
}

export const TextDocumentSchema = z.object({
    id: z.string().refine((value) => /^[0-9a-fA-F]{24}$/.test(value), 'The id of a text document must be a valid object id'),
    title: z.string(),
    author: z.string(),
    paragraphs: z.array(ParagraphSchema),
    highlights: z.array(HighlightSchema)
})