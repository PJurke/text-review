import { ObjectId } from "mongodb";
import ParagraphAnalysisEntity from "./ParagraphAnalysisEntity";

export default interface TextAnalysisEntity {
    _id: ObjectId;
    textDocumentId: ObjectId;
    paragraphAnalyses: ParagraphAnalysisEntity[];
}