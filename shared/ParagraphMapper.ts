import { ObjectId } from "mongodb";
import Paragraph from "@/types/Paragraph";
import ParagraphEntity from "@/entities/ParagraphEntity";

export function mapParagraphToParagraphEntity(paragraph: Paragraph): ParagraphEntity {
    return {
        _id: new ObjectId(paragraph.id),
        text: paragraph.text
    };
}

export function mapParagraphEntityToParagraph(paragraph: ParagraphEntity): Paragraph {
    return {
        id: paragraph._id.toHexString(),
        text: paragraph.text
    };
}