import { z } from 'zod'
import Highlight, { HighlightSchema } from './Highlight'
import Paragraph, { ParagraphSchema } from "./Paragraph"

export default interface TextDocument {
    id: string
    title: string
    paragraphs: Paragraph[]
    highlights: Highlight[]
}

export const TextDocumentSchema = z.object({
    id: z.string().uuid(),
    title: z.string(),
    paragraphs: z.array(ParagraphSchema),
    highlights: z.array(HighlightSchema)
})