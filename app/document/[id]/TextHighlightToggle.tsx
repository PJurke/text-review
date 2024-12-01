'use client';

interface TextHighlightToggleProps {
    position: { top: number; left: number };
    onHighlight: () => void;
    onRemove?: () => void;
    hasExistingHighlight: boolean;
}

/**
 * `TextHighlightToggle` is a React functional component that renders a toggle button
 * for highlighting and removing highlights on a specified text segment.
 * @param param0 
 * @returns A JSX element representing the toggle button within a styled
 * div. The button label and click behavior change based on the `hasExistingHighlight` prop.
 */
export default function TextHighlightToggle({ position, onHighlight, onRemove, hasExistingHighlight}: TextHighlightToggleProps) {

    const handleButtonClick = () => {
        if (hasExistingHighlight) {
            onRemove?.();
        } else {
            onHighlight();
        }
    };

    return (
        <div className="absolute bg-gray-800 text-white px-3 py-1.5 rounded z-50 flex items-center gap-2" style={{ top: position.top, left: position.left }}>
            <button onClick={handleButtonClick} className="bg-blue-500 text-white px-3 py-1 border-none rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 hover:bg-blue-600 transition-colors">
                {hasExistingHighlight ? 'Remove' : 'Highlight'}
            </button>
        </div>
    );
}