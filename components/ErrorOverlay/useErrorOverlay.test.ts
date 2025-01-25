import { ErrorOverlayContent } from './ErrorOverlay';
import useErrorOverlay from './useErrorOverlay';
import { act } from 'react';

describe('useErrorOverlay Store', () => {

    // Reset store before every new test
    beforeEach(() => {
        const { setErrorOverlayContent, hideErrorOverlay } = useErrorOverlay.getState();

        setErrorOverlayContent({
            title: '',
            message: '',
            action: undefined,
        });

        hideErrorOverlay();
    });

    it('should set the initial state correctly', () => {
        const state = useErrorOverlay.getState();

        expect(state.errorOverlayContent).toEqual({
            title: '',
            message: '',
            action: undefined,
        });

        expect(state.isErrorOverlayVisible).toBe(false);
    });

    it('should set the ErrorOverlayContent correctly', () => {

        const newContent: ErrorOverlayContent = {
            title: 'Error',
            message: 'An unexpected error occurred.',
            action: {
                label: 'Retry',
                handler: () => {}
            }
        };

        act(() => {
            useErrorOverlay.getState().setErrorOverlayContent(newContent);
        });

        const state = useErrorOverlay.getState();

        expect(state.errorOverlayContent).toEqual(newContent);
    });

    it('should make Error Overlay visible', () => {

        const errorMessage = {
            title: 'Error',
            message: 'An unexpected error occurred',
            action: undefined,
        };

        act(() => {
            useErrorOverlay.getState().showErrorOverlay(errorMessage);
        });

        const state = useErrorOverlay.getState();
        expect(state.errorOverlayContent).toEqual(errorMessage);
        expect(state.isErrorOverlayVisible).toBe(true);
    });

    it('should hide Error Overlay', () => {

        // Show Error Overlay first
        act(() => {
            useErrorOverlay.getState().showErrorOverlay({
              title: 'Error',
              message: 'An unexpected error occurred',
              action: undefined,
            });
        });

        // Request do hide
        act(() => {
            useErrorOverlay.getState().hideErrorOverlay();
        });

        const state = useErrorOverlay.getState();
        expect(state.isErrorOverlayVisible).toBe(false);
    });

});