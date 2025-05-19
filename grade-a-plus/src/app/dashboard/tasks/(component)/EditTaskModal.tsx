"use client";

import { useState } from "react";
import { updateTask } from "../(actions)/tasks-actions";
import Modal from "../../../../components/Modal";

interface Task {
    id: string;
    title: string;
    description: string | null;
    status: string;
    due_date: string | null;
}

interface EditTaskModalProps {
    isOpen: boolean;
    onCloseAction: () => void; // Renamed from onClose to onCloseAction
    task: Task;
}

export default function EditTaskModal({ isOpen, onCloseAction, task }: EditTaskModalProps) {
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description || "");
    const [dueDate, setDueDate] = useState(task.due_date || "");
    const [status, setStatus] = useState(task.status);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            setError("Title is required");
            return;
        }

        setIsSubmitting(true);
        setError("");

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        if (dueDate) formData.append("due_date", dueDate);
        formData.append("status", status);

        try {
            const result = await updateTask(task.id, formData);

            if (result.error) {
                setError(result.error);
                setIsSubmitting(false);
                return;
            }

            setIsSubmitting(false);
            onCloseAction();
        } catch (err) {
            console.error("Error updating task:", err);
            setError("An unexpected error occurred. Please try again.");
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onCloseAction={onCloseAction} title="Edit Task">
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 bg-red-100 text-red-700 rounded-md">
                        {error}
                    </div>
                )}

                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Task Title*
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="What needs to be done?"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description (Optional)
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Add details about this task..."
                        rows={3}
                    />
                </div>

                <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Due Date (Optional)
                    </label>
                    <input
                        type="date"
                        id="dueDate"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>

                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                    </label>
                    <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    >
                        <option value="upcoming">Upcoming</option>
                        <option value="due">Due</option>
                        <option value="overdue">Overdue</option>
                        <option value="complete">Complete</option>
                    </select>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                    <button
                        type="button"
                        onClick={onCloseAction}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}