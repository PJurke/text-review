import Show from "@/components/Show";
import { TextDocumentSummary } from "@/types/TextDocumentSummary";

export default function TextDocumentItem({ id, title, author }: TextDocumentSummary): JSX.Element {
    return (
        <li>

            <a className="block p-3 rounded-lg hover:bg-gray-50" href={`/document/${id}`}>

                <h3 className="text-xl">{title}</h3>

                <Show when={!!author}>
                    <div className="text-neutral-500 text-sm">by {author}</div>
                </Show>

            </a>

        </li>
    );
}