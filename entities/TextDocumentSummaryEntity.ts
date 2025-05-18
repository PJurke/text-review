import { ObjectId } from "mongodb"

export default interface TextDocumentSummaryEntity {
    _id: ObjectId
    title: string
    author: string
}