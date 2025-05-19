"use client";

import { useState } from "react";
import { updateTaskStatus, deleteTask } from "../(actions)/tasks-actions";
import { CalendarClock, Edit, Trash2 } from "lucide-react";
import EditTaskModal from "./EditTaskModal";

interface Task {
    id: string;
    title: string;
    description: string | null;
    status: string;
    due_date: string | null;
    created_at: string;
}

interface TaskItemProps {
    task: Task;
}

export default function TaskItem({ task }: TaskItemProps) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isChangingStatus, setIsChangingStatus] = useState(false);

    // Format the due date if it exists with UK/EU format
    const formattedDate = task.due_date
        ? new Date(task.due_date).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        })
        : null;

    // Format the created_at date with UK/EU locale for DD/MM/YYYY format
    const formattedCreatedAt = new Date(task.created_at).toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    });

    const handleStatusChange = async (newStatus: string) => {
        if (task.status === newStatus) return;

        setIsChangingStatus(true);
        try {
            await updateTaskStatus(task.id, newStatus);
        } catch (error) {
            console.error("Error updating task status:", error);
        } finally {
            setIsChangingStatus(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            setIsDeleting(true);
            try {
                await deleteTask(task.id);
            } catch (error) {
                console.error("Error deleting task:", error);
            } finally {
                setIsDeleting(false);
            }
        }
    };

    // Determine background color based on status
    const getStatusBg = (status: string) => {
        switch (status) {
            case 'upcoming':
                return 'bg-blue-100 text-blue-800';
            case 'due':
                return 'bg-amber-100 text-amber-800';
            case 'overdue':
                return 'bg-red-100 text-red-800';
            case 'complete':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const statusBg = getStatusBg(task.status);

    return (
        <>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{task.title}</h3>

                        {task.description && (
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{task.description}</p>
                        )}

                        <div className="flex flex-wrap gap-2 mt-3">
              <span className={`text-xs px-2 py-1 rounded-full ${statusBg} font-medium capitalize`}>
                {task.status}
              </span>

                            {formattedDate && (
                                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 font-medium flex items-center gap-1">
                  <CalendarClock className="h-3 w-3" />
                                    {formattedDate}
                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex space-x-1">
                        <button
                            onClick={() => setIsEditModalOpen(true)}
                            className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                            aria-label="Edit task"
                        >
                            <Edit className="h-4 w-4" />
                        </button>

                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                            aria-label="Delete task"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex justify-between text-xs text-gray-500">
                        <select
                            value={task.status}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            disabled={isChangingStatus}
                            className="text-xs bg-transparent border-none focus:ring-0 p-0 text-gray-500 cursor-pointer"
                        >
                            <option value="upcoming">Upcoming</option>
                            <option value="due">Due</option>
                            <option value="overdue">Overdue</option>
                            <option value="complete">Complete</option>
                        </select>

                        <span>
              {formattedCreatedAt}
            </span>
                    </div>
                </div>
            </div>

            {isEditModalOpen && (
                <EditTaskModal
                    isOpen={isEditModalOpen}
                    onCloseAction={() => setIsEditModalOpen(false)}
                    task={task}
                />
            )}
        </>
    );
}