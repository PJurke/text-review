import LoginMenuItem from "./LoginMenuItem";

export default function TopMenu(): JSX.Element {

    return (
        <nav aria-label="Main Navigation" className="bg-white fixed w-full">
            <ul className="flex flex-col sm:flex-row sm:justify-center">
                <li><a className="block p-3 hover:bg-gray-100" href="/">Homepage</a></li>
                <li><a className="block p-3 hover:bg-gray-100" href="/document">Documents</a></li>
                <li><LoginMenuItem /></li>
            </ul>
        </nav>
    );

}