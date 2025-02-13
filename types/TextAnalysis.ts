import { z } from "zod";
import ParagraphAnalysis, { ParagraphAnalysisSchema } from "./ParagraphAnalysis";

export default interface TextAnalysis {
    id: string;
    title: string;
    author: string;
    paragraphs: ParagraphAnalysis[];
}

export const TextAnalysisSchema = z.object({
    id: z.string().refine((value) => /^[0-9a-fA-F]{24}$/.test(value), 'The id of a paragraph analysis must be a valid object id'),
    title: z.string(),
    author: z.string(),
    paragraphs: z.array(ParagraphAnalysisSchema),
})