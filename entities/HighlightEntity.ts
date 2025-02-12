import { ObjectId } from "mongodb"

export default interface HighlightEntity {
    _id: ObjectId
    start: number
    end: number
}