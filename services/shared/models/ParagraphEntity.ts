import { ObjectId } from "mongodb"
import HighlightEntity from "./HighlightEntity"

export default interface ParagraphEntity {
    _id: ObjectId
    text: string
    highlights: HighlightEntity[]
}