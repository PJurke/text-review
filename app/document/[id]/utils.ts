export const getSelectionIndices = (paragraphRef: React.RefObject<HTMLParagraphElement>): { start: number, end: number } | null => {
    
    const selection = window.getSelection();
    
    // Check whether there is a selection
    if (!selection || selection.rangeCount === 0)
        return null;

    // Get the range of the selection
    const range = selection.getRangeAt(0);

    // Check whether the selection is within the paragraph
    if (!paragraphRef.current?.contains(range.startContainer) || !paragraphRef.current.contains(range.endContainer))
        return null;

    let startIndex = 0;
    let endIndex = 0;
    let cumulativeLength = 0;

    const walker = document.createTreeWalker(
        paragraphRef.current,
        NodeFilter.SHOW_TEXT,
        null
    );

    let node: Node | null;
    
    // Iterate through the text nodes of the paragraph
    while (node = walker.nextNode()) {
        if (node === range.startContainer)
            startIndex = cumulativeLength + range.startOffset;

        if (node === range.endContainer) {
            endIndex = cumulativeLength + range.endOffset;
            break;
        }

        cumulativeLength += node.textContent?.length || 0;
    }

    return { start: startIndex, end: endIndex };

};