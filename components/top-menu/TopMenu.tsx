import LoginMenuItem from "./LoginMenuItem";
import TopMenuItem from "./TopMenuItem";

export default function TopMenu(): JSX.Element {

    return (
        <nav aria-label="Main Navigation" className="backdrop-blur-md bg-white/75 sticky top-0">
            <ul className="flex flex-col sm:flex-row items-center sm:justify-center gap-x-4">
                <TopMenuItem href="/">Homepage</TopMenuItem>
                <TopMenuItem href="/document">Documents</TopMenuItem>
                <LoginMenuItem />
            </ul>
        </nav>
    );

}