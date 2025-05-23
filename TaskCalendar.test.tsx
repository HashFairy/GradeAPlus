import { render, screen } from '@testing-library/react'
import TaskCalendar from '@/components/ui/TaskCalendar'

const mockTasks = [
    { id: 1, title: 'Assignment Due', date: '2024-03-15', type: 'assignment' },
    { id: 2, title: 'Exam', date: '2024-03-20', type: 'exam' }
]

describe('TaskCalendar', () => {
    test('renders tasks on correct dates', () => {
        render(<TaskCalendar tasks={mockTasks} />)

        expect(screen.getByText('Assignment Due')).toBeInTheDocument()
        expect(screen.getByText('Exam')).toBeInTheDocument()
    })

    test('filters tasks by type', () => {
        render(<TaskCalendar tasks={mockTasks} filter="assignment" />)

        expect(screen.getByText('Assignment Due')).toBeInTheDocument()
        expect(screen.queryByText('Exam')).not.toBeInTheDocument()
    })
})