"use client";

import { useState } from "react";
import { createTask } from "../(actions)/tasks-actions";
import Modal from "../../../../components/Modal";

interface AddTaskModalProps {
    isOpen: boolean;
    onCloseAction: () => void; // Renamed from onClose to onCloseAction
}

export default function AddTaskModal({ isOpen, onCloseAction }: AddTaskModalProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [status, setStatus] = useState("upcoming"); // Default to 'upcoming'
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
        if (description) formData.append("description", description);
        if (dueDate) formData.append("due_date", dueDate);
        formData.append("status", status);

        try {
            const result = await createTask(formData);

            if (result.error) {
                setError(result.error);
                setIsSubmitting(false);
                return;
            }

            // Reset form and close modal
            setTitle("");
            setDescription("");
            setDueDate("");
            setStatus("upcoming");
            setIsSubmitting(false);
            onCloseAction();
        } catch (err) {
            console.error("Error creating task:", err);
            setError("An unexpected error occurred. Please try again.");
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onCloseAction={onCloseAction} title="Add New Task">
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
                        {isSubmitting ? "Creating..." : "Create Task"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}