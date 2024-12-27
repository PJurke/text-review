import { ObjectId } from "mongodb"

export default interface HighlightEntity {
    _id: ObjectId
    paragraphId: ObjectId
    start: number
    end: number
}