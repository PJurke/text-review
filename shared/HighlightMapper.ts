import { ObjectId } from "mongodb";
import Highlight from "@/types/Highlight";
import HighlightEntity from "@/entities/HighlightEntity";

export function mapHighlightToHighlightEntity(highlight: Highlight): HighlightEntity {
    return {
        _id: new ObjectId(highlight.id),
        start: highlight.start,
        end: highlight.end,
    };
}

export function mapHighlightEntityToHighlight(highlight: HighlightEntity): Highlight {
    return {
        id: highlight._id.toHexString(),
        start: highlight.start,
        end: highlight.end
    };
}