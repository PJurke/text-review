import { create } from "zustand";
import { Highlight } from "@/app/lib/TextDocument";

interface HighlightState {
    highlights: Highlight[];
    addHighlight: (highlight: Highlight) => void;
    removeHighlight: (highlightId: string) => void;
    setHighlights: (highlights: Highlight[]) => void;
}

export const useStore = create<HighlightState>((set) => ({

    highlights: [],

    addHighlight: (newHighlight: Highlight) => {
        set((state) => ({
            highlights: [...state.highlights, newHighlight],
        }));
    },

    removeHighlight: (highlightId: string) => {
        set((state) => ({
            highlights: state.highlights.filter(highlight => highlight.id !== highlightId),
        }));
    },

    setHighlights: (allHighlights: Highlight[]) => {
        set({ highlights: allHighlights });
    },

}));