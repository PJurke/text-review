'use client';

import { useState } from "react";
import TopMenuToggleButton from "./TopMenuToggleButton";
import TopMenuItems from "./TopMenuItems";

/**
 * The main component that manages the status (open/closed) of the menu and renders the toggle button and the menu items.
 */
export default function TopMenu(): JSX.Element {

    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => setIsOpen(prev => !prev);

    return (
        <nav aria-label="Main Navigation" className="backdrop-blur-md bg-white/75 flex flex-col sm:flex-row justify-center gap-x-4 sticky top-0">

            <TopMenuToggleButton isOpen={isOpen} toggleMenu={toggleMenu} />
            <TopMenuItems isOpen={isOpen} />
                
        </nav>
    );

}
