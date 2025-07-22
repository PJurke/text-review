import Link from "next/link";
import TopMenuItem from "./TopMenuItem";

interface TopMenuItemsProps {
    isOpen: boolean;
    closeMenu: () => void;
}

/**
 * Renders the list of menu items.
 */
export default function TopMenuItems({ isOpen, closeMenu }: TopMenuItemsProps): JSX.Element {

    const menuItems = [
        { href: "/why", label: "Why" },
        { href: "/document", label: "Documents" },
        { href: "/signin", label: "Account" },
    ];

    return (
        <ul className={`flex flex-col sm:flex-row items-center justify-center h-full sm:h-auto pt-16 sm:pt-0 sm:gap-x-4 w-full ${isOpen ? 'flex' : 'hidden sm:flex'}`}>
            <li className="font-semibold mb-2 sm:mb-0 px-3 text-xl sm:text-lg"><Link href="/" onClick={closeMenu}>Text Review</Link></li>
            { menuItems.map(item => (
                <TopMenuItem key={item.href} href={item.href} onClick={closeMenu}>{item.label}</TopMenuItem>
            ))}
        </ul>
    );
}