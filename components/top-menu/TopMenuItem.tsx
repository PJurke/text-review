'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

interface TopMenuItemProps {
    href: string;
    children: React.ReactNode;
    onClick?: () => void;
}

/**
 * Represents a single menu item as a link.
 */
export default function TopMenuItem({ children, href, onClick }: TopMenuItemProps): JSX.Element {

    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <li className="w-full sm:w-auto">
            <Link className={`block font-medium px-3 py-1 sm:py-2 text-center w-full sm:w-auto ${isActive ? 'font-semibold text-slate-500' : ''}`} href={href} onClick={onClick}>
                {children}
            </Link>
        </li>
    );

}