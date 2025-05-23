'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/app/utils/supabase/client';

interface Task {
    id: string;
    title: string;
    description?: string;
    time: string;
    datetime: string;
    priority: 'low' | 'medium' | 'high';
    status: 'upcoming' | 'due' | 'overdue' | 'complete';
    category?: string;
    href?: string;
}

// Simple Calendar Component
const TaskCalendar = ({
                          tasks,
                          onTaskClick,
                          onDateClick,
                          onAddTask
                      }: {
    tasks: Task[];
    onTaskClick: (task: Task) => void;
    onDateClick: (date: string) => void;
    onAddTask: (date: string) => void;
}) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const today = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    // Generate calendar days
    const calendarDays = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDayOfWeek; i++) {
        calendarDays.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        calendarDays.push(day);
    }

    // Get tasks for a specific date
    const getTasksForDate = (day: number) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return tasks.filter(task => task.datetime.startsWith(dateStr));
    };

    const navigateMonth = (direction: 'prev' | 'next') => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            if (direction === 'prev') {
                newDate.setMonth(prev.getMonth() - 1);
            } else {
                newDate.setMonth(prev.getMonth() + 1);
            }
            return newDate;
        });
    };

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="p-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                    {monthNames[month]} {year}
                </h2>
                <div className="flex space-x-2">
                    <button
                        onClick={() => navigateMonth('prev')}
                        className="p-2 rounded-md border border-gray-300 hover:bg-gray-50"
                    >
                        ←
                    </button>
                    <button
                        onClick={() => navigateMonth('next')}
                        className="p-2 rounded-md border border-gray-300 hover:bg-gray-50"
                    >
                        →
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
                {/* Day headers */}
                {dayNames.map(day => (
                    <div key={day} className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-700">
                        {day}
                    </div>
                ))}

                {/* Calendar days */}
                {calendarDays.map((day, index) => {
                    if (!day) {
                        return <div key={index} className="bg-white h-24"></div>;
                    }

                    const dayTasks = getTasksForDate(day);
                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const isToday = today.toDateString() === new Date(year, month, day).toDateString();

                    return (
                        <div
                            key={day}
                            className={`bg-white h-24 p-2 cursor-pointer hover:bg-gray-50 ${
                                isToday ? 'ring-2 ring-indigo-500' : ''
                            }`}
                            onClick={() => onDateClick(dateStr)}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className={`text-sm ${isToday ? 'font-bold text-indigo-600' : 'text-gray-900'}`}>
                                    {day}
                                </span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onAddTask(dateStr);
                                    }}
                                    className="text-gray-400 hover:text-indigo-600 text-xs"
                                    title="Add task"
                                >
                                    +
                                </button>
                            </div>

                            {/* Task indicators */}
                            <div className="space-y-1">
                                {dayTasks.slice(0, 2).map(task => (
                                    <div
                                        key={task.id}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onTaskClick(task);
                                        }}
                                        className={`text-xs px-1 py-0.5 rounded truncate cursor-pointer ${
                                            task.priority === 'high' ? 'bg-red-100 text-red-800' :
                                                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-green-100 text-green-800'
                                        }`}
                                        title={task.title}
                                    >
                                        {task.title}
                                    </div>
                                ))}
                                {dayTasks.length > 2 && (
                                    <div className="text-xs text-gray-500">
                                        +{dayTasks.length - 2} more
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default function CalendarPage() {
    const router = useRouter();
    const [userTasks, setUserTasks] = useState<Task[]>([]);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [addTaskDate, setAddTaskDate] = useState<string>('');
    const [usingMockData, setUsingMockData] = useState(false);

    // Load tasks from database
    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            const supabase = createClient();

            // Get current user
            const { data: { user }, error: userError } = await supabase.auth.getUser();

            if (userError) {
                console.error('Auth error:', userError);
                setUserTasks(getMockTasks());
                setUsingMockData(true);
                return;
            }

            if (!user) {
                console.log('No user found, using mock data');
                setUserTasks(getMockTasks());
                setUsingMockData(true);
                return;
            }

            console.log('User authenticated:', user.id);

            // Try to fetch tasks from database
            const { data: tasks, error } = await supabase
                .from('task')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Database error details:', {
                    message: error.message,
                    details: error.details,
                    hint: error.hint,
                    code: error.code
                });

                console.log('Using mock data due to database error');
                setUserTasks(getMockTasks());
                setUsingMockData(true);
                return;
            }

            console.log('Tasks loaded from database:', tasks?.length || 0);

            if (!tasks || tasks.length === 0) {
                console.log('No tasks found, using mock data for demo');
                setUserTasks(getMockTasks());
                setUsingMockData(true);
                return;
            }

            // Transform database tasks to match our Task interface
            const transformedTasks: Task[] = tasks.map(task => {
                let taskDatetime = new Date().toISOString();
                let taskTime = '12:00 PM';

                if (task.due_date) {
                    const dueDate = new Date(task.due_date);
                    taskDatetime = dueDate.toISOString();
                    taskTime = dueDate.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit'
                    });
                }

                return {
                    id: task.id,
                    title: task.title,
                    description: task.description || '',
                    time: taskTime,
                    datetime: taskDatetime,
                    priority: task.priority || 'medium',
                    status: task.status || 'upcoming',
                    category: task.category,
                    href: `/dashboard/tasks/${task.id}`
                };
            });

            setUserTasks(transformedTasks);
        } catch (error) {
            console.log('Unexpected error:', error);
            console.log('Using mock data due to unexpected error');
            setUserTasks(getMockTasks());
            setUsingMockData(true);
        } finally {
            setLoading(false);
        }
    };

    // Mock data for testing/demo purposes
    const getMockTasks = (): Task[] => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);

        return [
            {
                id: '1',
                title: 'Team Meeting',
                description: 'Weekly sync with the development team',
                time: '10:00 AM',
                datetime: `${today.toISOString().split('T')[0]}T10:00:00Z`,
                priority: 'high',
                status: 'upcoming',
                category: 'work'
            },
            {
                id: '2',
                title: 'Project Review',
                description: 'Review current project progress',
                time: '2:00 PM',
                datetime: `${today.toISOString().split('T')[0]}T14:00:00Z`,
                priority: 'medium',
                status: 'due',
                category: 'work'
            },
            {
                id: '3',
                title: 'Study Session',
                description: 'Computer Science assignment due next week',
                time: '6:00 PM',
                datetime: `${tomorrow.toISOString().split('T')[0]}T18:00:00Z`,
                priority: 'high',
                status: 'upcoming',
                category: 'academic'
            },
            {
                id: '4',
                title: 'Gym Workout',
                description: 'Cardio and strength training',
                time: '7:00 AM',
                datetime: `${nextWeek.toISOString().split('T')[0]}T07:00:00Z`,
                priority: 'low',
                status: 'upcoming',
                category: 'personal'
            }
        ];
    };

    // Event handlers
    const openTaskModal = (task: Task) => {
        setSelectedTask(task);
        setShowTaskModal(true);
    };

    const openAddTaskModal = (date: string) => {
        setAddTaskDate(date);
        setShowAddModal(true);
    };

    const handleDateClick = (date: string) => {
        setSelectedDate(date);
    };

    const closeModals = () => {
        setShowTaskModal(false);
        setShowAddModal(false);
        setSelectedTask(null);
        setAddTaskDate('');
        loadTasks();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center">
                            <h1 className="text-xl font-semibold text-gray-900">
                                Task Calendar
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-500">
                                {userTasks.length} total tasks
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                {/* Mock Data Banner */}
                {usingMockData && (
                    <div className="mb-6 rounded-md bg-yellow-50 p-4">
                        <div className="flex">
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-yellow-800">
                                    Demo Mode - Using Sample Data
                                </h3>
                                <div className="mt-2 text-sm text-yellow-700">
                                    <p>
                                        The tasks table doesn't exist yet or you're not authenticated.
                                        <span className="font-medium underline hover:text-yellow-600 ml-1 cursor-pointer">
                                            Set up your database to see real tasks.
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow">
                    <TaskCalendar
                        tasks={userTasks}
                        onTaskClick={openTaskModal}
                        onDateClick={handleDateClick}
                        onAddTask={openAddTaskModal}
                    />
                </div>
            </main>

            {/* Task Modal */}
            {showTaskModal && selectedTask && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={closeModals}></div>

                        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                            <div>
                                <div className="text-center">
                                    <h3 className="text-lg font-semibold leading-6 text-gray-900">
                                        {selectedTask.title}
                                    </h3>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            {selectedTask.description}
                                        </p>
                                        <div className="mt-4 space-y-2">
                                            <p className="text-sm">
                                                <span className="font-medium">Time:</span> {selectedTask.time}
                                            </p>
                                            <p className="text-sm">
                                                <span className="font-medium">Priority:</span>{' '}
                                                <span className={`capitalize ${
                                                    selectedTask.priority === 'high' ? 'text-red-600' :
                                                        selectedTask.priority === 'medium' ? 'text-yellow-600' :
                                                            'text-green-600'
                                                }`}>
                                                    {selectedTask.priority}
                                                </span>
                                            </p>
                                            <p className="text-sm">
                                                <span className="font-medium">Status:</span>{' '}
                                                <span className="capitalize">{selectedTask.status}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                                <button
                                    type="button"
                                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                                    onClick={() => {
                                        router.push(`/dashboard/tasks/${selectedTask.id}/edit`);
                                    }}
                                >
                                    Edit Task
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                                    onClick={closeModals}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Task Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={closeModals}></div>

                        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                            <div>
                                <div className="text-center">
                                    <h3 className="text-lg font-semibold leading-6 text-gray-900">
                                        Add Task
                                    </h3>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            Create a new task for {new Date(addTaskDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                                <button
                                    type="button"
                                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                                    onClick={() => {
                                        router.push(`/dashboard/tasks/create?date=${addTaskDate}`);
                                    }}
                                >
                                    Create Task
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                                    onClick={closeModals}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}