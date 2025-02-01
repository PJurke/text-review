import { z } from "zod";

export default interface Highlight {
    id: string
    start: number
    end: number
    __typename?: string
}

export const HighlightSchema = z.object({
    id: z.string().refine((value) => /^[0-9a-fA-F]{24}$/.test(value), 'The id of a highlight must be a valid object id'),
    start: z.number().int().nonnegative('The start position must be a positive integer'),
    end: z.number().int().nonnegative('The end position must be a positive integer')
});