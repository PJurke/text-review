import { useEffect } from "react";
import useErrorOverlay from "@/components/ErrorOverlay/useErrorOverlay";

export const useAddHighlightError = (addError: Error | undefined) => {

    const { showErrorOverlay } = useErrorOverlay();

    useEffect(() => {
        if (addError) {
            switch (addError.message) {
                case 'Document not found':
                case 'Paragraph not found':
                case 'Invalid input':
                default: {
                    showErrorOverlay({
                        title: 'Error Saving Highlight',
                        message: 'An unknown server error occurred while saving the highlight.',
                        action: {
                            handler: () => window.location.reload(),
                            label: 'Please try reloading the page.'
                        }
                    });
                }
            }
        }
    }, [addError, showErrorOverlay]);

};

export const useRemoveHighlightError = (removeError: Error | undefined) => {

    const { showErrorOverlay } = useErrorOverlay();

    useEffect(() => {
        if (removeError) {
            switch (removeError.message) {
                case 'Document not found':
                case 'Highlight not found':
                case 'Invalid input':
                default: {
                    showErrorOverlay({
                        title: 'Error Removing Highlight',
                        message: 'An unknown server error occurred while removing the highlight.',
                        action: {
                            handler: () => window.location.reload(),
                            label: 'Please try reloading the page.'
                        }
                    });
                }
            }
        }
    }, [removeError, showErrorOverlay])

};