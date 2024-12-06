import { create } from "zustand";
import { Highlight } from "../TextDocument";

interface HighlightState {
    highlights: Highlight[];
    addHighlight: (highlight: Highlight) => void;
    setHighlights: (highlights: Highlight[]) => void;
    getHighlightsByParagraph: (paragraphId: string) => Highlight[];
}

export const useStore = create<HighlightState>((set, get) => ({

    highlights: [],

    addHighlight: (newHighlight: Highlight) => {
        set((state) => ({
            highlights: [...state.highlights, newHighlight],
        }));
    },

    setHighlights: (allHighlights: Highlight[]) => {
        set({ highlights: allHighlights });
    },

    getHighlightsByParagraph: (paragraphId: string) => {
        return get().highlights.filter(highlight => highlight.paragraphId === paragraphId);
    },

}));