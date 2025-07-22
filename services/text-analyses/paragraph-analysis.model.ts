import { z } from "zod";
import { HighlightSchema } from "./highlight.model";

export const ParagraphAnalysisSchema = z.object({
    id: z.string().oid('The id of a paragraph analysis must be a valid object id'),
    text: z.string(),
    highlights: z.array(HighlightSchema),
})