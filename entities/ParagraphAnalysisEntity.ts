import { ObjectId } from "mongodb";
import HighlightEntity from "./HighlightEntity";

export default interface ParagraphAnalysisEntity {
    paragraphId: ObjectId;
    highlights: HighlightEntity[];
}