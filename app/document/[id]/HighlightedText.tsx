import { Paragraph, Highlight } from "@/app/lib/TextDocument";

interface HighlightedTextProps {
    paragraph: Paragraph;
    highlights: Highlight[];
}

interface TextSegment {
    text: string;
    highlight: Highlight | null;
}

export default function HighlightedText({paragraph, highlights}: HighlightedTextProps) {

    const segments: TextSegment[] = [];
    const text = paragraph.text;
    const length = text.length;

    const highlightMap: (Highlight | null)[] = Array(length).fill(null);

    highlights.forEach(highlight => {
        let start = 0;
        let end = length;

        if (highlight.start.paragraphId === paragraph.id) {
            start = highlight.start.offset;
        }

        if (highlight.end.paragraphId === paragraph.id) {
            end = highlight.end.offset;
        }

        for (let i = start; i < end && i < length; i++) {
            // Bei Überschneidungen priorisieren Sie beispielsweise den ersten Highlight
            if (!highlightMap[i]) {
                highlightMap[i] = highlight;
            }
        }
    });

    let currentHighlight = highlightMap[0];
    let currentText = '';

    for (let i = 0; i < length; i++) {
        if (highlightMap[i] !== currentHighlight) {
            segments.push({
                text: currentText,
                highlight: currentHighlight,
            });
            currentText = text[i];
            currentHighlight = highlightMap[i];
        } else {
            currentText += text[i];
        }
    }

    if (currentText) {
        segments.push({
            text: currentText,
            highlight: currentHighlight,
        });
    }

    return (

        <>
            {segments.map((segment, index) => {
                if (segment.highlight) {
                    return (
                        <mark key={index}>{segment.text}</mark>
                    )
                }
                return <span key={index}>{segment.text}</span>;
            })}
        </>

    )

}