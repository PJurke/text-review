interface ParagraphComponentProps {
    text: string;
}

export default function ParagraphComponent({ text }: ParagraphComponentProps): JSX.Element {

    return (
        <p className="leading-9 mt-8 text-lg">
            { text }
        </p>
    );

}