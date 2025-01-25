import { ErrorOverlayContent } from './ErrorOverlay';
import useErrorOverlay from './useErrorOverlay';
import { act } from 'react';

describe('useErrorOverlay Store', () => {

    const initialContent: ErrorOverlayContent = {
        title: '',
        message: ''
    };

    // Reset store before every new test
    beforeEach(() => {
        act(() => {
            useErrorOverlay.getState().setErrorOverlayContent(initialContent);
            useErrorOverlay.getState().hideErrorOverlay();
        });
    });

    it('should set the initial state correctly', () => {
        const state = useErrorOverlay.getState();
        expect(state.errorOverlayContent).toEqual(initialContent);
        expect(state.isErrorOverlayVisible).toBe(false);
    });

    it('should set ErrorOverlayContent without an action', () => {
        const newContent: ErrorOverlayContent = {
            title: 'Fehler',
            message: 'Ein unerwarteter Fehler ist aufgetreten.',
        };

        act(() => {
            useErrorOverlay.getState().setErrorOverlayContent(newContent);
        });

        const state = useErrorOverlay.getState();
        expect(state.errorOverlayContent).toEqual(newContent);
        expect(state.errorOverlayContent.action).toBeUndefined();
    });

    it('should set ErrorOverlayContent with an action', () => {
        const mockHandler = jest.fn();

        const newContent: ErrorOverlayContent = {
            title: 'Error',
            message: 'An unexpected error occurred.',
            action: {
                label: 'Retry',
                handler: mockHandler,
            },
        };

        act(() => {
            useErrorOverlay.getState().setErrorOverlayContent(newContent);
        });

        const state = useErrorOverlay.getState();
        expect(state.errorOverlayContent).toEqual(newContent);
        expect(state.errorOverlayContent.action).toBeDefined();
        expect(state.errorOverlayContent.action?.label).toBe('Retry');
        expect(typeof state.errorOverlayContent.action?.handler).toBe('function');
    });

    it('should make Error Overlay become visible without a set action', () => {
        const errorMessage: ErrorOverlayContent = {
            title: 'Error',
            message: 'An unexpected error occurred.',
        };

        act(() => {
            useErrorOverlay.getState().showErrorOverlay(errorMessage);
        });

        const state = useErrorOverlay.getState();
        expect(state.errorOverlayContent).toEqual(errorMessage);
        expect(state.isErrorOverlayVisible).toBe(true);
    });

    it('should make Error Overlay become visible, with a set action', () => {
        const mockHandler = jest.fn();

        const errorMessage: ErrorOverlayContent = {
            title: 'Error',
            message: 'An unexpected error occurred.',
            action: {
                label: 'Retry',
                handler: mockHandler,
            },
        };

        act(() => {
            useErrorOverlay.getState().showErrorOverlay(errorMessage);
        });

        const state = useErrorOverlay.getState();
        expect(state.errorOverlayContent).toEqual(errorMessage);
        expect(state.isErrorOverlayVisible).toBe(true);
        expect(state.errorOverlayContent.action).toBeDefined();
        expect(state.errorOverlayContent.action?.label).toBe('Retry');
    });

    it('should hide Error Overlay', () => {

        // Show Error Overlay first
        act(() => {
            useErrorOverlay.getState().showErrorOverlay({
              title: 'Error',
              message: 'An unexpected error occurred'
            });
        });

        // Request do hide
        act(() => {
            useErrorOverlay.getState().hideErrorOverlay();
        });

        const state = useErrorOverlay.getState();
        expect(state.isErrorOverlayVisible).toBe(false);
    });

    it('should call the action handler function', () => {
        const mockHandler = jest.fn();

        const errorMessage: ErrorOverlayContent = {
            title: 'Error',
            message: 'An unexpected error occurred.',
            action: {
              label: 'Retry',
              handler: mockHandler,
            },
        };

        act(() => {
            useErrorOverlay.getState().showErrorOverlay(errorMessage);
        });

        const state = useErrorOverlay.getState();
        state.errorOverlayContent.action?.handler();

        expect(mockHandler).toHaveBeenCalledTimes(1);
    });

});