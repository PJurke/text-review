import { z } from 'zod'
import Highlight, { HighlightSchema } from './Highlight'
import Paragraph, { ParagraphSchema } from "./Paragraph"
import { ObjectId } from 'mongodb'

export default interface TextDocument {
    id: string
    title: string
    paragraphs: Paragraph[]
    highlights: Highlight[]
}

export const TextDocumentSchema = z.object({
    id: z.string().refine((value => ObjectId.isValid(value)), 'The id of a text document must be a valid object id'),
    title: z.string(),
    paragraphs: z.array(ParagraphSchema),
    highlights: z.array(HighlightSchema)
})