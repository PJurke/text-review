import { TextDocumentSummary } from "@/types/TextDocumentSummary"
import TextDocumentSummaryEntity from "@/entities/TextDocumentSummaryEntity"

export function mapTextDocumentSummaryEntityToTextDocumentSummary(textDocumentSummary: TextDocumentSummaryEntity): TextDocumentSummary {
    return {
        id: textDocumentSummary._id.toHexString(),
        title: textDocumentSummary.title,
        author: textDocumentSummary.author,
    }
}