'use client';

import React from 'react';

interface TooltipProps {
    position: { top: number; left: number };
    onHighlight: () => void;
    onRemove?: () => void;
    hasExistingHighlight: boolean;
}

export default function Tooltip({ position, onHighlight, onRemove, hasExistingHighlight}: TooltipProps) {

    const handleButtonClick = () => {
        if (hasExistingHighlight) {
            onRemove && onRemove();
        } else {
            onHighlight();
        }
    };

    const buttonLabel = hasExistingHighlight ? 'Remove' : 'Highlight';

    return (
        <div className="absolute bg-gray-100 text-white px-3 py-1.5 rounded z-50 flex items-center gap-2"
            style={{ top: position.top, left: position.left }}
        >
            <button onClick={handleButtonClick}
                className="bg-blue-500 text-white px-3 py-1 border-none rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 hover:bg-blue-600 transition-colors"
            >
                {buttonLabel}
            </button>
        </div>
    );
}