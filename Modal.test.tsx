import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Modal from '@/components/ui/Modal'

describe('Modal', () => {
    test('renders when open', () => {
        render(
            <Modal isOpen={true} onClose={jest.fn()}>
                <p>Modal content</p>
            </Modal>
        )

        expect(screen.getByText('Modal content')).toBeInTheDocument()
    })

    test('calls onClose when overlay is clicked', async () => {
        const user = userEvent.setup()
        const mockOnClose = jest.fn()

        render(
            <Modal isOpen={true} onClose={mockOnClose}>
                <p>Modal content</p>
            </Modal>
        )

        await user.click(screen.getByTestId('modal-overlay'))
        expect(mockOnClose).toHaveBeenCalled()
    })
})