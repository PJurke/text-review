import { ObjectId } from "mongodb"
import ParagraphEntity from "./ParagraphEntity"

export default interface TextDocumentEntity {
    _id: ObjectId
    title: string
    author: string
    paragraphs: ParagraphEntity[]
}