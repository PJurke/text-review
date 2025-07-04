'use client';

import { useCallback, useEffect, useState } from "react";
import TopMenuToggleButton from "./TopMenuToggleButton";
import TopMenuItems from "./TopMenuItems";

/**
 * The main component that manages the status (open/closed) of the menu and renders the toggle button and the menu items.
 */
export default function TopMenu(): JSX.Element {

    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    const closeMenu = useCallback(() => {
        setIsOpen(false);
    }, []);

    useEffect(() => {

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isOpen) {
                closeMenu();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        } else {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, closeMenu]);

    return (
        <>
            <div className="flex justify-end p-3 sticky right-0 top-0 z-50 sm:hidden">
                <TopMenuToggleButton isOpen={isOpen} toggleMenu={toggleMenu} />
            </div>

            <nav aria-label="Main Navigation" className={`
                    bg-white/75 backdrop-blur-md fixed inset-0 z-40
                    duration-300 ease-in-out transform transition-transform
                    sm:flex sm:flex-row sm:justify-center sm:gap-x-4 sm:sticky sm:top-0 sm:z-auto
                    ${isOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'}
                `}>

                <TopMenuItems isOpen={isOpen} closeMenu={closeMenu} />
                    
            </nav>
        </>
    );

}