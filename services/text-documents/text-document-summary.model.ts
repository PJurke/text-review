import { z } from "zod";
import { TextDocumentSchema } from "@/services/text-documents/text-document.model";

export const TextDocumentSummarySchema = TextDocumentSchema.pick({
    id: true,
    title: true,
    author: true,
});

export type TextDocumentSummary = z.infer<typeof TextDocumentSummarySchema>;