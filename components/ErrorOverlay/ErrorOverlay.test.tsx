import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'
import { ErrorOverlay, ErrorOverlayProps } from './ErrorOverlay';

describe('ErrorOverlay Component', () => {

    const defaultProps: ErrorOverlayProps = {
        title: 'Error',
        message: 'An unexpected error occurred.',
        onClose: jest.fn(),
    };

    it('renders title and message correctly', () => {
        render(<ErrorOverlay {...defaultProps} />);

        expect(screen.getByText('Error')).toBeInTheDocument();
        expect(screen.getByText('An unexpected error occurred.')).toBeInTheDocument();
    });

    it('calls onClose, when the close-button is being clicked', () => {
        render(<ErrorOverlay {...defaultProps} />);

        const closeButton = screen.getByText('Close');
        fireEvent.click(closeButton);

        expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    it('renders the action button if an action is being passed on', () => {
        const action = {
            label: 'Retry',
            handler: jest.fn(),
        };

        render(<ErrorOverlay {...defaultProps} action={action} />);

        const actionButton = screen.getByText('Retry');
        expect(actionButton).toBeInTheDocument();
    });

    it('calls the action handler if the action button is being clicked', () => {
        const action = {
            label: 'Retry',
            handler: jest.fn(),
        };

        render(<ErrorOverlay {...defaultProps} action={action} />);

        const actionButton = screen.getByText('Retry');
        fireEvent.click(actionButton);

        expect(action.handler).toHaveBeenCalledTimes(1);
    });

    it('does not render the action button, if no action is being passed on', () => {
        render(<ErrorOverlay {...defaultProps} />);

        const actionButton = screen.queryByText('Retry');
        expect(actionButton).not.toBeInTheDocument();
    });

});