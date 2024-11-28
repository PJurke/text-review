// components/Tooltip.tsx
'use client';

import React from 'react';

interface TooltipProps {
    position: { top: number; left: number };
    onHighlight: () => void;
}

export default function Tooltip({ position, onHighlight }: TooltipProps) {
    return (
        <div
            style={{
                position: 'absolute',
                top: position.top,
                left: position.left,
                backgroundColor: '#333',
                color: '#fff',
                padding: '5px 10px',
                borderRadius: '4px',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
            }}
        >
            <button
                onClick={onHighlight}
                style={{
                    backgroundColor: '#fff',
                    color: '#333',
                    border: 'none',
                    padding: '5px 10px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                }}
            >
                Highlight
            </button>
        </div>
    );
};