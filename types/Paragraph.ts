import { z } from "zod"
import Highlight, { HighlightSchema } from "./Highlight"

export default interface Paragraph {
    id: string
    text: string
    highlights: Highlight[]
}

export const ParagraphSchema = z.object({
    id: z.string().refine((value) => /^[0-9a-fA-F]{24}$/.test(value), 'The id of a paragraph must be a valid object id'),
    text: z.string(),
    highlights: z.array(HighlightSchema)
})