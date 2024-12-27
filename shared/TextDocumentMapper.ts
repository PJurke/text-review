import { ObjectId } from "mongodb"
import TextDocument from "@/types/TextDocument"
import TextDocumentEntity from "@/services/shared/models/TextDocumentEntity"
import { mapHighlightEntityToHighlight, mapHighlightToHighlightEntity } from "./HighlightMapper"
import { mapParagraphEntityToParagraph, mapParagraphToParagraphEntity } from "./ParagraphMapper"

export function mapTextDocumentToTextDocumentEntity(textDocument: TextDocument): TextDocumentEntity {
    return {
        _id: new ObjectId(textDocument.id),
        title: textDocument.title,
        paragraphs: textDocument.paragraphs.map(paragraph => mapParagraphToParagraphEntity(paragraph)),
        highlights: textDocument.highlights.map(highlight => mapHighlightToHighlightEntity(highlight))
    }
}

export function mapTextDocumentEntityToTextDocument(textDocument: TextDocumentEntity): TextDocument {
    return {
        id: textDocument._id.toHexString(),
        title: textDocument.title,
        paragraphs: textDocument.paragraphs.map(paragraph => mapParagraphEntityToParagraph(paragraph)),
        highlights: textDocument.highlights.map(highlight => mapHighlightEntityToHighlight(highlight))
    }
}