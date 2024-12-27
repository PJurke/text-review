import { ObjectId } from "mongodb";
import Highlight from "@/types/Highlight";
import HighlightEntity from "@/services/shared/models/HighlightEntity";

export function mapHighlightToHighlightEntity(highlight: Highlight): HighlightEntity {
    return {
        _id: new ObjectId(highlight.id),
        paragraphId: new ObjectId(highlight.paragraphId),
        start: highlight.start,
        end: highlight.end
    };
}

export function mapHighlightEntityToHighlight(highlight: HighlightEntity): Highlight {
    return {
        id: highlight._id.toHexString(),
        paragraphId: highlight.paragraphId.toHexString(),
        start: highlight.start,
        end: highlight.end
    };
}