'use client';

import { useCallback, useEffect, useRef, useState } from "react";
import TopMenuToggleButton from "./TopMenuToggleButton";
import TopMenuItems from "./TopMenuItems";

/**
 * The main component that manages the status (open/closed) of the menu and renders the toggle button and the menu items.
 */
export default function TopMenu(): JSX.Element {

    const menuRef = useRef<HTMLElement>(null);

    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    const handleClickOutside = useCallback((event: MouseEvent) => {
        if (isOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen)
            document.addEventListener('mousedown', handleClickOutside);
        else
            document.removeEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, handleClickOutside]);

    return (
        <nav aria-label="Main Navigation" className="backdrop-blur-md bg-white/75 flex flex-col sm:flex-row justify-center gap-x-4 sticky top-0" ref={menuRef}>

            <TopMenuToggleButton isOpen={isOpen} toggleMenu={toggleMenu} />
            <TopMenuItems isOpen={isOpen} />
                
        </nav>
    );

}
