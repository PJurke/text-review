import Link from "next/link";

import Show from "@/components/Show";
import { TextDocumentSummary } from "@/types/TextDocumentSummary";

export default function TextDocumentItem({ id, title, author }: TextDocumentSummary): JSX.Element {
    return (

            <Link className="block p-3 rounded-lg hover:bg-gray-50" href={`/document/${id}`}>

                <h2 className="text-xl">{title}</h2>

                <Show when={!!author}>
                    <div className="text-neutral-500 text-sm">by {author}</div>
                </Show>

            </Link>

    );
}