import TopMenuItem from "./TopMenuItem";

interface TopMenuItemsProps {
    isOpen: boolean;
}

export default function TopMenuItems({ isOpen }: TopMenuItemsProps): JSX.Element {
    return (
        <ul className={`flex flex-col sm:flex-row items-center sm:justify-center gap-x-4 sm:flex ${isOpen ? 'block' : 'hidden'}`}>
            <TopMenuItem href="/">Homepage</TopMenuItem>
            <TopMenuItem href="/why">Why</TopMenuItem>
            <TopMenuItem href="/document">Documents</TopMenuItem>
        </ul>
    );
}