"use client";

import { useState } from "react";
import TaskItem from "./TaskItem";
import AddTaskButton from "./AddTaskButton";
import AddTaskModal from "./AddTaskModal";

interface Task {
    id: string;
    title: string;
    description: string | null;
    status: string;
    due_date: string | null;
    created_at: string;
}

interface TasksListProps {
    tasks: Task[];
}

export default function TasksList({ tasks }: TasksListProps) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState<string | null>(null);

    // Group tasks by status
    const tasksByStatus = {
        upcoming: tasks.filter((task) => task.status === "upcoming"),
        due: tasks.filter((task) => task.status === "due"),
        overdue: tasks.filter((task) => task.status === "overdue"),
        complete: tasks.filter((task) => task.status === "complete"),
    };

    // Filter tasks based on activeFilter
    const filteredTasks = activeFilter
        ? tasks.filter(task => task.status === activeFilter)
        : tasks;

    const handleAddButtonClick = () => {
        setIsAddModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsAddModalOpen(false);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Tasks</h1>
                <AddTaskButton onClickAction={handleAddButtonClick} />
            </div>

            {/* Status filter tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
                <button
                    onClick={() => setActiveFilter(null)}
                    className={`px-3 py-1 text-sm rounded-full ${
                        activeFilter === null
                            ? 'bg-gray-800 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    All
                </button>
                <button
                    onClick={() => setActiveFilter("upcoming")}
                    className={`px-3 py-1 text-sm rounded-full ${
                        activeFilter === "upcoming"
                            ? 'bg-blue-800 text-white'
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                >
                    Upcoming ({tasksByStatus.upcoming.length})
                </button>
                <button
                    onClick={() => setActiveFilter("due")}
                    className={`px-3 py-1 text-sm rounded-full ${
                        activeFilter === "due"
                            ? 'bg-amber-800 text-white'
                            : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                    }`}
                >
                    Due ({tasksByStatus.due.length})
                </button>
                <button
                    onClick={() => setActiveFilter("overdue")}
                    className={`px-3 py-1 text-sm rounded-full ${
                        activeFilter === "overdue"
                            ? 'bg-red-800 text-white'
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                >
                    Overdue ({tasksByStatus.overdue.length})
                </button>
                <button
                    onClick={() => setActiveFilter("complete")}
                    className={`px-3 py-1 text-sm rounded-full ${
                        activeFilter === "complete"
                            ? 'bg-green-800 text-white'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                >
                    Complete ({tasksByStatus.complete.length})
                </button>
            </div>

            {tasks.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <p className="text-gray-600">No tasks found.</p>
                    <p className="text-sm text-gray-500 mt-2">Click the "Add Task" button to get started.</p>
                </div>
            ) : filteredTasks.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <p className="text-gray-600">No {activeFilter} tasks found.</p>
                    <p className="text-sm text-gray-500 mt-2">
                        Try selecting a different filter or create a new task.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredTasks.map((task) => (
                        <TaskItem key={task.id} task={task} />
                    ))}
                </div>
            )}

            <AddTaskModal
                isOpen={isAddModalOpen}
                onCloseAction={handleCloseModal}
            />
        </div>
    );
}