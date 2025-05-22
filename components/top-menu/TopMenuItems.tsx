import TopMenuItem from "./TopMenuItem";

interface TopMenuItemsProps {
    isOpen: boolean;
}

/**
 * Renders the list of menu items.
 */
export default function TopMenuItems({ isOpen }: TopMenuItemsProps): JSX.Element {

    const menuItems = [
        { href: "/", label: "Homepage" },
        { href: "/why", label: "Why" },
        { href: "/document", label: "Documents" },
    ];

    return (
        <ul className={`flex flex-col sm:flex-row items-center sm:justify-center gap-x-4 sm:flex ${isOpen ? 'block' : 'hidden'}`}>
            { menuItems.map(item => (
                <TopMenuItem key={item.href} href={item.href}>{item.label}</TopMenuItem>
            ))}
        </ul>
    );
}