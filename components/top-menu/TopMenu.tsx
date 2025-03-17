'use client';

import { useState } from "react";
import TopMenuToggleButton from "./TopMenuToggleButton";
import TopMenuItems from "./TopMenuItems";

export default function TopMenu(): JSX.Element {

    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => setIsOpen(prev => !prev);

    return (
        <nav aria-label="Main Navigation" className="backdrop-blur-md bg-white/75 sticky top-0">
            <div className="flex flex-col sm:flex-row  gap-x-4 justify-center">

                <TopMenuToggleButton isOpen={isOpen} toggleMenu={toggleMenu} />
                <TopMenuItems isOpen={isOpen} />
                
            </div>
        </nav>
    );

}
