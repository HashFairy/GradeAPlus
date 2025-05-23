// components/TaskCalendar.tsx
'use client';

import React, { useState } from 'react';

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

interface TaskCalendarProps {
    tasks: Task[];
    onTaskClick: (task: Task) => void;
    onDateClick: (date: string) => void;
    onAddTask: (date: string) => void;
}

export const TaskCalendar: React.FC<TaskCalendarProps> = ({
                                                              tasks,
                                                              onTaskClick,
                                                              onDateClick,
                                                              onAddTask
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
                        className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        aria-label="Previous month"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={() => navigateMonth('next')}
                        className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        aria-label="Next month"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
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
                        return <div key={`empty-${index}`} className="bg-white h-24 border-r border-b border-gray-100"></div>;
                    }

                    const dayTasks = getTasksForDate(day);
                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const isToday = today.toDateString() === new Date(year, month, day).toDateString();

                    return (
                        <div
                            key={`day-${day}`}
                            className={`bg-white h-24 p-2 cursor-pointer hover:bg-gray-50 border-r border-b border-gray-100 transition-colors ${
                                isToday ? 'ring-2 ring-indigo-500 ring-inset' : ''
                            }`}
                            onClick={() => onDateClick(dateStr)}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className={`text-sm font-medium ${
                                    isToday ? 'text-indigo-600 font-bold' : 'text-gray-900'
                                }`}>
                                    {day}
                                </span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onAddTask(dateStr);
                                    }}
                                    className="text-gray-400 hover:text-indigo-600 text-lg leading-none w-5 h-5 flex items-center justify-center rounded-full hover:bg-indigo-50 transition-colors"
                                    title="Add task"
                                    aria-label={`Add task for ${day}`}
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
                                        className={`text-xs px-2 py-1 rounded-full truncate cursor-pointer transition-colors ${
                                            task.priority === 'high' ? 'bg-red-100 text-red-800 hover:bg-red-200' :
                                                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' :
                                                    'bg-green-100 text-green-800 hover:bg-green-200'
                                        }`}
                                        title={`${task.title} - ${task.time}`}
                                    >
                                        {task.title}
                                    </div>
                                ))}
                                {dayTasks.length > 2 && (
                                    <div className="text-xs text-gray-500 font-medium">
                                        +{dayTasks.length - 2} more
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="mt-6 flex items-center justify-center space-x-6 text-xs">
                <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-red-100 rounded-full border border-red-200"></div>
                    <span className="text-gray-600">High Priority</span>
                </div>
                <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-yellow-100 rounded-full border border-yellow-200"></div>
                    <span className="text-gray-600">Medium Priority</span>
                </div>
                <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-green-100 rounded-full border border-green-200"></div>
                    <span className="text-gray-600">Low Priority</span>
                </div>
            </div>
        </div>
    );
};