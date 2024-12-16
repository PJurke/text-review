import { ObjectId } from "mongodb"
import { z } from "zod"

export default interface Paragraph {
    id: string
    text: string
}

export const ParagraphSchema = z.object({
    id: z.string().refine((value => ObjectId.isValid(value)), 'The id of a paragraph must be a valid object id'),
    text: z.string()
})