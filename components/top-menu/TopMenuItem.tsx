import Link from "next/link";

interface TopMenuItemProps {
    href: string;
    children: React.ReactNode;
}

/**
 * Represents a single menu item as a link.
 */
export default function TopMenuItem({ children, href }: TopMenuItemProps): JSX.Element {
    return <li><Link className="block font-medium px-3 py-2" href={href}>{children}</Link></li>
}