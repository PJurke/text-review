import { z } from "zod"

export const HighlightSchema = z.object({
    id: z.string().oid('The id of a highlight must be a valid object id'),
    start: z.number().int().nonnegative('The start position must be a positive integer'),
    end: z.number().int().nonnegative('The end position must be a positive integer')
})

export type Highlight = z.infer<typeof HighlightSchema>