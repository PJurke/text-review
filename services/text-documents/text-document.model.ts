import { z } from 'zod'

import { TextDocumentType } from '@prisma/client';
import { ParagraphSchema } from "./paragraph.model"

export const TextDocumentSchema = z.object({
    id: z.string().oid('The id of a text document must be a valid object id'),
    title: z.string(),
    author: z.string(),
    paragraphs: z.array(ParagraphSchema),

    type: z.nativeEnum(TextDocumentType).optional().nullable(),
    meta: z.any().optional().nullable(),
});

export type TextDocument = z.infer<typeof TextDocumentSchema>