import { z } from 'zod'

import { TextDocumentType } from '@prisma/client';
import { ParagraphSchema } from "./paragraph.model"

const BaseTextDocumentSchema = z.object({
    id: z.string().oid('The id of a text document must be a valid object id'),
    title: z.string(),
    author: z.string(),
    paragraphs: z.array(ParagraphSchema),
})

const SpeechTextDocumentSchema = BaseTextDocumentSchema.extend({
    type: z.literal(TextDocumentType.SPEECH),
    meta: z.object({
        date: z.string().datetime(),
        location: z.string(),
        occasion: z.string(),
    })
})

export const TextDocumentSchema = z.discriminatedUnion('type', [
    SpeechTextDocumentSchema
])

export type TextDocument = z.infer<typeof TextDocumentSchema>