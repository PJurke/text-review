import Link from "next/link";
import Show from "@/components/Show";

export type TextDocumentItemProps = {
    id: string;
    title: string;
    author?: string;
};

export default function TextDocumentItem({ id, title, author }: TextDocumentItemProps): JSX.Element {
    return (

        <Link className="block duration-150 p-4 rounded-lg hover:bg-gray-100 transition-colors" href={`/document/${id}`}>
            <h2 className="mb-0.5 text-xl">{title}</h2>
            <Show when={!!author}>
                <div className="text-gray-600 text-sm">by {author}</div>
            </Show>
        </Link>

    );
}