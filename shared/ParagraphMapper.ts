import { ObjectId } from "mongodb";
import Paragraph from "@/types/Paragraph";
import ParagraphEntity from "@/services/shared/models/ParagraphEntity";
import { mapHighlightEntityToHighlight, mapHighlightToHighlightEntity } from "./HighlightMapper";

export function mapParagraphToParagraphEntity(paragraph: Paragraph): ParagraphEntity {
    return {
        _id: new ObjectId(paragraph.id),
        text: paragraph.text,
        highlights: paragraph.highlights.map(highlight => mapHighlightToHighlightEntity(highlight))
    };
}

export function mapParagraphEntityToParagraph(paragraph: ParagraphEntity): Paragraph {
    return {
        id: paragraph._id.toHexString(),
        text: paragraph.text,
        highlights: paragraph.highlights.map(highlight => mapHighlightEntityToHighlight(highlight))
    };
}