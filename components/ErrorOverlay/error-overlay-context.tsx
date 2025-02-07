import { ErrorOverlay, ErrorOverlayData } from "@/components/ErrorOverlay/ErrorOverlay";
import { createContext, ReactNode, useContext, useState } from "react";

interface ErrorContextValue {
    errorData: ErrorOverlayData | null;
    setErrorData: (content: ErrorOverlayData | null) => void;
}

const ErrorOverlayContext = createContext<ErrorContextValue | undefined>(undefined);

export const ErrorOverlayProvider = ({ children }: { children: ReactNode }) => {
    
    const [errorData, setErrorContent] = useState<ErrorOverlayData | null>(null);

    // Close the error overlay by setting the error content to null
    const handleClose = () => setErrorContent(null);

    return (
        <ErrorOverlayContext.Provider value={{ errorData: errorData, setErrorData: setErrorContent }}>
            {children}

            {errorData && (
                <ErrorOverlay
                    title={errorData.title}
                    message={errorData.message}
                    action={errorData.action}
                    onClose={handleClose}
                />
            )}
        </ErrorOverlayContext.Provider>
    );

};

export const useErrorOverlay = (): ErrorContextValue => {
    const context = useContext(ErrorOverlayContext);

    if (!context)
        throw new Error('useError must be used within an ErrorProvider');

    return context;
};

export default ErrorOverlayContext;