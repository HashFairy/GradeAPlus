import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AddAssessmentForm from '@/app/grade/components/AddAssessmentForm'
// Mock the actions
jest.mock('@/app/grade/actions/addAssessmentAction', () => ({
    addAssessmentAction: jest.fn(),
}))

describe('AddAssessmentForm', () => {
    test('renders form fields', () => {
        render(<AddAssessmentForm />)

        expect(screen.getByLabelText(/assessment name/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/total marks/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /add assessment/i })).toBeInTheDocument()
    })

    test('submits form with correct data', async () => {
        const user = userEvent.setup()
        const mockAddAssessment = require('@/app/grade/actions/addAssessmentAction').addAssessmentAction

        render(<AddAssessmentForm />)

        await user.type(screen.getByLabelText(/assessment name/i), 'Midterm Exam')
        await user.type(screen.getByLabelText(/total marks/i), '100')
        await user.click(screen.getByRole('button', { name: /add assessment/i }))

        expect(mockAddAssessment).toHaveBeenCalledWith({
            name: 'Midterm Exam',
            totalMarks: 100
        })
    })
})