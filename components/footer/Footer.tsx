import Link from "next/link";

export default function Footer(): JSX.Element {
    return (
        <footer className="bg-gray-900 flex min-h-20 items-center justify-center text-center text-sm text-white w-full">
            <p className="leading-relaxed">
                <Link className="underline" href="/">Text Review</Link> {new Date().getFullYear()}<br />
                Created by <Link className="underline" href="https://www.philipjurke.de" target="_blank">Philip Jurke</Link>
            </p>
        </footer>
    );
}