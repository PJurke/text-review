import { ObjectId } from "mongodb"
import HighlightEntity from "./HighlightEntity"
import ParagraphEntity from "./ParagraphEntity"

export default interface TextDocumentEntity {
    _id: ObjectId
    title: string
    author: string
    paragraphs: ParagraphEntity[]
    highlights: HighlightEntity[]
}