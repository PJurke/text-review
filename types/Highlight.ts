import { z } from "zod";

export default interface Highlight {
    id: string
    paragraphId: string
    start: number
    end: number
}

export const HighlightSchema = z.object({
    id: z.string().uuid(),
    paragraphId: z.string().uuid(),
    start: z.number().int().nonnegative('The start position must be a positive integer'),
    end: z.number().int().nonnegative('The end position must be a positive integer')
});