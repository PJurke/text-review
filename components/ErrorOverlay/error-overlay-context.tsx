import { ErrorDetails } from "./ErrorDetails";
import { ErrorOverlay } from "./ErrorOverlay";
import { createContext, ReactNode, useContext, useState } from "react";

interface ErrorOverlayContextProps {
    errorDetails: ErrorDetails | null;
    showError: (data: ErrorDetails) => void;
    hideError: () => void;
}

const ErrorOverlayContext = createContext<ErrorOverlayContextProps | undefined>(undefined);

export const useErrorOverlay = (): ErrorOverlayContextProps => {
    const context = useContext(ErrorOverlayContext);

    if (!context)
        throw new Error('useErrorOverlay must be used within an ErrorOverlayProvider');

    return context;
};

export const ErrorOverlayProvider = ({ children }: { children: ReactNode }) => {
    
    const [errorDetails, setErrorDetails] = useState<ErrorDetails | null>(null);

    const showError = (data: ErrorDetails) => {
        setErrorDetails(data);
    };

    const hideError = () => setErrorDetails(null);

    return (
        <ErrorOverlayContext.Provider value={{ errorDetails, showError, hideError }}>
            {children}

            {errorDetails && (
                <ErrorOverlay
                    title={errorDetails.title}
                    message={errorDetails.message}
                    action={errorDetails.action}
                    onClose={hideError}
                />
            )}
        </ErrorOverlayContext.Provider>
    );

};

export default ErrorOverlayContext;