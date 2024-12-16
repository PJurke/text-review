import { ObjectId } from "mongodb";
import { z } from "zod";

export default interface Highlight {
    id: string
    paragraphId: string
    start: number
    end: number
}

export const HighlightSchema = z.object({
    id: z.string().refine((value => ObjectId.isValid(value)), 'The id of a highlight must be a valid object id'),
    paragraphId: z.string().refine((value => ObjectId.isValid(value)), 'The id of a paragraph must be a valid object id'),
    start: z.number().int().nonnegative('The start position must be a positive integer'),
    end: z.number().int().nonnegative('The end position must be a positive integer')
});