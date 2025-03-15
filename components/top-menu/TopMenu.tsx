export default function TopMenu(): JSX.Element {

    return (
        <nav aria-label="Main Navigation" className="bg-white fixed w-full">
            <ul className="flex flex-col sm:flex-row sm:justify-center">
                <li><a className="block p-3 hover:bg-gray-100" href="/">Homepage</a></li>
                <li><a className="block p-3 hover:bg-gray-100" href="/document">Texts</a></li>
                <li><a className="block p-3 hover:bg-gray-100" href="/login">Log in</a></li>
            </ul>
        </nav>
    );

}