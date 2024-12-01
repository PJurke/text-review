import TextDocument, { Highlight } from "@/app/lib/TextDocument";
import { create } from "zustand/react";

interface HighlightsState {
    highlights: Highlight[]
    addHighlight: (highlight: Highlight) => void
    removeHighlight: (highlightId: string) => void
    setHighlights: (highlights: Highlight[]) => void
}

interface TooltipState {
    existingHighlight: Highlight | null
    paragraphId: string | null
    position: { top: number; left: number }
    selectedRange: { start: number; end: number } | null
    visible: boolean
}

interface TooltipActions {
    tooltipState: TooltipState
    showTooltip: (tooltip: Partial<TooltipState>) => void
    hideTooltip: () => void
}

interface StoreState extends HighlightsState, TooltipActions {
    document: TextDocument | null;
    setDocument: (document: TextDocument) => void;
}

export const useStore = create<StoreState>((set) => ({

    // Highlight States

    highlights: [],

    addHighlight: (highlight) => set((state) => ({
        highlights: [...state.highlights, highlight]
    })),

    removeHighlight: (highlightId) => set((state) => ({
        highlights: state.highlights.filter(h => h.id !== highlightId)
    })),

    setHighlights: (highlights) => set({ highlights }),

    // Tooltip States

    tooltipState: {
        visible: false,
        position: { top: 0, left: 0 },
        selectedRange: null,
        paragraphId: null,
        existingHighlight: null
    },

    showTooltip: (tooltip) => set((state) => ({
        tooltipState: { ...state.tooltipState, ...tooltip, visible: true }
    })),

    hideTooltip: () => set((state) => ({
        tooltipState: { ...state.tooltipState, visible: false, selectedRange: null, existingHighlight: null }
    })),

    // Document State

    document: null,
    setDocument: (document: TextDocument) => set({ document })

}))