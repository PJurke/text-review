import { ErrorOverlayContent } from '@/components/ErrorOverlay/ErrorOverlay';
import { create } from 'zustand';

/**
 * Interface defining the state and actions for the error overlay.
 */
interface ErrorOverlayState {
    errorOverlayContent: ErrorOverlayContent;
    setErrorOverlayContent: (content: ErrorOverlayContent) => void;

    isErrorOverlayVisible: boolean;
    showErrorOverlay: (errorMessage: ErrorOverlayContent) => void;
    hideErrorOverlay: () => void;
}

/**
 * Zustand store hook for managing the error overlay state.
 */
const useErrorOverlay = create<ErrorOverlayState>((set) => ({

    // Error Overlay

    errorOverlayContent: {
        title: '',
        message: '',
        action: undefined
    },

    isErrorOverlayVisible: false,

    /**
     * Sets the content of the error overlay.
     * @param {ErrorOverlayContent} content - The new content for the error overlay.
     */
    setErrorOverlayContent: (content: ErrorOverlayContent) => set({ errorOverlayContent: content }),

    /**
     * Shows the error overlay with the provided error message.
     * @param {ErrorOverlayContent} errorMessage - The error message to display.
     */
    showErrorOverlay: (errorMessage: ErrorOverlayContent) => {
        set({
            errorOverlayContent: errorMessage,
            isErrorOverlayVisible: true
        });
    },

    /**
     * Hides the error overlay.
     */
    hideErrorOverlay: () => set({ isErrorOverlayVisible: false }),

}));

export default useErrorOverlay;