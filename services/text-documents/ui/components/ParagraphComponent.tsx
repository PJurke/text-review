interface ParagraphComponentProps {
    text: string;
}

export default function ParagraphComponent({ text }: ParagraphComponentProps): JSX.Element {

    return (
        <p className="leading-relaxed mt-8 text-lg">
            { text }
        </p>
    );

}