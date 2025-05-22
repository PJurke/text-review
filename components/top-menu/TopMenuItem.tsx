'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

interface TopMenuItemProps {
    href: string;
    children: React.ReactNode;
}

/**
 * Represents a single menu item as a link.
 */
export default function TopMenuItem({ children, href }: TopMenuItemProps): JSX.Element {

    const pathname = usePathname();
    const isActive = pathname === href;

    const cssClasses = `block font-medium px-3 py-2 ${isActive ? 'font-semibold' : ''}`;

    return (
        <li>
            <Link className={cssClasses} href={href}>{children}</Link>
        </li>
    );

}