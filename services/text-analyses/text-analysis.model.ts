import { z } from "zod";
import { ParagraphAnalysisSchema } from "./paragraph-analysis.model";

export const TextAnalysisSchema = z.object({
    id: z.string().oid('The id of a text analysis must be a valid object id'),
    title: z.string(),
    author: z.string(),
    paragraphs: z.array(ParagraphAnalysisSchema),
})