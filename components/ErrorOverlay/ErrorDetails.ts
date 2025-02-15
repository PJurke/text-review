/**
 * Interface representing the data for the error overlay.
 */
export interface ErrorDetails {
    title: string;
    message: string;
    action?: {
        label: string;
        onAction: () => void;
    }
}