import Link from "next/link";
import LoginMenuItem from "./LoginMenuItem";

export default function TopMenu(): JSX.Element {

    return (
        <nav aria-label="Main Navigation" className="backdrop-blur-md bg-white/75 sticky top-0 w-full">
            <ul className="flex flex-col sm:flex-row sm:justify-center">
                <li><Link className="block p-3" href="/">Homepage</Link></li>
                <li><Link className="block p-3" href="/document">Documents</Link></li>
                <li><LoginMenuItem /></li>
            </ul>
        </nav>
    );

}