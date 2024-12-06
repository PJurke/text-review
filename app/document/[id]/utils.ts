export const getSelectionIndices = (paragraphRef: React.RefObject<HTMLParagraphElement>): { start: number, end: number } | null => {
    
    const selection = window.getSelection();
    
    if (!selection || selection.rangeCount === 0)
        return null;

    const range = selection.getRangeAt(0);

    // Check whether the selection is within the paragraph
    if (!paragraphRef.current?.contains(range.startContainer) || !paragraphRef.current.contains(range.endContainer))
        return null;

    const preSelectionRange = range.cloneRange();
    preSelectionRange.selectNodeContents(paragraphRef.current);
    preSelectionRange.setEnd(range.startContainer, range.startOffset);

    const start = preSelectionRange.toString().length;
    const end = start + range.toString().length;

    return { start, end };
};