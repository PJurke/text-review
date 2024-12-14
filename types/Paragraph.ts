import { z } from "zod"

export default interface Paragraph {
    id: string
    text: string
}

export const ParagraphSchema = z.object({
    id: z.string().uuid(),
    text: z.string()
})