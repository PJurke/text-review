import useErrorOverlay from './useErrorOverlay';
import { ErrorOverlay } from './ErrorOverlay';

/**
 * Container component that displays the ErrorOverlay when an error is present.
 * @returns {JSX.Element | null} The ErrorOverlay component or null if not visible.
 */
export function ErrorOverlayContainer(): JSX.Element | null {
    const { errorOverlayContent, isErrorOverlayVisible: errorOverlayVisible, hideErrorOverlay } = useErrorOverlay();

    if (!errorOverlayVisible) return null;

    return (
        <ErrorOverlay 
            title={errorOverlayContent.title}
            message={errorOverlayContent.message}
            action={errorOverlayContent.action}
            onClose={hideErrorOverlay}
        />
    );
}