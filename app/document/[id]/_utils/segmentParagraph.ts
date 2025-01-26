import Highlight from "@/types/Highlight";

export interface Segment {
    text: string;
    highlightIds: string[];
}

const segmentParagraph = (text: string, paragraphHighlights: Highlight[]): Segment[] => {

    // Start and end positions of all existing highlights + text boundaries (=segment positions)
    const boundaries = new Set<number>();

    paragraphHighlights.forEach(highlight => {
        boundaries.add(highlight.start);
        boundaries.add(highlight.end);
    });
    boundaries.add(0);
    boundaries.add(text.length);

    // Sorting segment positions ASC for algorithm
    const sortedBoundaries = Array.from(boundaries).sort((a, b) => a - b);
    const tempSegments: Segment[] = [];

    for (let i = 0; i < sortedBoundaries.length - 1; i++) {
        const segmentStart = sortedBoundaries[i];
        const segmentEnd = sortedBoundaries[i + 1];
        const segmentText = text.slice(segmentStart, segmentEnd);

        // Find all highlights that completely cover the current segment + store their highlight ids
        const coveringHighlights = paragraphHighlights
            .filter(highlight => highlight.start <= segmentStart && highlight.end >= segmentEnd)
            .map(highlight => highlight.id);

        tempSegments.push({
            text: segmentText,
            highlightIds: coveringHighlights
        });
    }

    return tempSegments;

};

export default segmentParagraph;