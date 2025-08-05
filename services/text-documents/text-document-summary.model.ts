import { z } from "zod";

export const TextDocumentSummarySchema = z.object({
    id: z.string().oid('The id of a text document must be a valid object id'),
    title: z.string(),
    author: z.string()
});

export type TextDocumentSummary = z.infer<typeof TextDocumentSummarySchema>;