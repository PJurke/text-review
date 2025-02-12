import { ObjectId } from "mongodb"

export default interface ParagraphEntity {
    _id: ObjectId
    text: string
}