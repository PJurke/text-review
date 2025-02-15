import { ErrorDetails } from "./ErrorDetails";

/**
 * Props for the ErrorOverlay component, extending the ErrorOverlayContent.
 */
export interface ErrorOverlayProps extends ErrorDetails {
    onClose: () => void;
}

/**
 * Component that displays an error overlay dialog with a title, message, and optional action.
 * @param {ErrorOverlayProps} props - The properties for the error overlay.
 * @returns {JSX.Element} The rendered error overlay.
 */
export function ErrorOverlay({ title, message, action, onClose }: ErrorOverlayProps): JSX.Element {
    return (
        <div aria-modal="true" className="bg-white fixed overflow-hidden right-4 rounded-lg shadow-md text-sm top-4 w-80 z-50" role="alertdialog">
            <div className="bg-red-500 flex items-center justify-between p-3">
                <h3 className="text-white font-semibold">{ title }</h3>
                <button className="cursor-pointer text-white" onClick={onClose}>Close</button>
            </div>
            <div className="px-3 pt-3">
                <p>{ message }</p>
            </div>
            {action &&
                <div className="p-3">
                    <button className="cursor-pointer text-blue-600" onClick={action.onAction}>{ action.label }</button>
                </div>
            }
        </div>
    );
};