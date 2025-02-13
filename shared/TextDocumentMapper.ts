import { ObjectId } from "mongodb"
import TextDocument from "@/types/TextDocument"
import TextDocumentEntity from "@/entities/TextDocumentEntity"
import { mapParagraphEntityToParagraph, mapParagraphToParagraphEntity } from "./ParagraphMapper"

export function mapTextDocumentToTextDocumentEntity(textDocument: TextDocument): TextDocumentEntity {
    return {
        _id: new ObjectId(textDocument.id),
        title: textDocument.title,
        author: textDocument.author,
        paragraphs: textDocument.paragraphs.map(paragraph => mapParagraphToParagraphEntity(paragraph)),
    }
}

export function mapTextDocumentEntityToTextDocument(textDocument: TextDocumentEntity): TextDocument {
    return {
        id: textDocument._id.toHexString(),
        title: textDocument.title,
        author: textDocument.author,
        paragraphs: textDocument.paragraphs.map(paragraph => mapParagraphEntityToParagraph(paragraph)),
    }
}