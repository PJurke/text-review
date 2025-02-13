import { z } from "zod";
import Highlight, { HighlightSchema } from "./Highlight";

export default interface ParagraphAnalysis {
    id: string;
    text: string;
    highlights: Highlight[];
}

export const ParagraphAnalysisSchema = z.object({
    id: z.string().refine((value) => /^[0-9a-fA-F]{24}$/.test(value), 'The id of a paragraph analysis must be a valid object id'),
    text: z.string(),
    highlights: z.array(HighlightSchema),
})