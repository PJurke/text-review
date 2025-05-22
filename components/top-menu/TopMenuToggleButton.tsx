import Image from 'next/image';

interface MenuToggleButtonProps {
    isOpen: boolean;
    toggleMenu: () => void;
    className?: string;
}

/**
 * Displays the button for opening and closing the menu on mobile devices.
 */
export default function TopMenuToggleButton({ isOpen, toggleMenu, className }: MenuToggleButtonProps): JSX.Element {

    const icon = isOpen ? '/close-icon.svg' : '/hamburger-icon.svg';

    return (
        <button
            aria-label={isOpen ? "Close menu" : "Open menu"}
            //className="cursor-pointer sm:hidden px-3 py-2 self-end"
            className={`cursor-pointer z-50 ${className}`}
            onClick={toggleMenu}>
            <Image src={icon} alt="Menu icon" width={32} height={32} />
        </button>
    );
}