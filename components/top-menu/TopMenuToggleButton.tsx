import Image from 'next/image';

interface MenuToggleButtonProps {
    isOpen: boolean;
    toggleMenu: () => void;
}

export default function TopMenuToggleButton({ isOpen, toggleMenu }: MenuToggleButtonProps): JSX.Element {

    let icon = isOpen ? '/close-icon.svg' : '/hamburger-icon.svg';

    return (
        <button
            aria-label={isOpen ? "Close menu" : "Open menu"}
            className="cursor-pointer sm:hidden px-3 py-2 self-end"
            onClick={toggleMenu}>
            <Image src={icon} alt="Menu icon" width={32} height={32} />
        </button>
    );
}