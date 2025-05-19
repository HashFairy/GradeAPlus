"use client";

import { useState } from "react";
import Modal from "../../../../components/Modal";

interface AddAssessmentModalProps {
    isOpen: boolean;
    onCloseAction: () => void;
    moduleId: string;
}

export default function AddAssessmentModal({ isOpen, onCloseAction, moduleId }: AddAssessmentModalProps) {
    const [title, setTitle] = useState("");
    const [weight, setWeight] = useState("");
    const [grade, setGrade] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // After successful creation:
        onCloseAction();
    };

    return (
        <Modal isOpen={isOpen} onCloseAction={onCloseAction} title="Add New Assessment">
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 bg-red-100 text-red-700 rounded-md">
                        {error}
                    </div>
                )}

                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Assessment Title*
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="e.g., Midterm Exam, Final Project"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                        Weight (%)
                    </label>
                    <input
                        type="number"
                        id="weight"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        min="0"
                        max="100"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="e.g., 25 for 25%"
                    />
                </div>

                <div>
                    <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">
                        Grade (%)
                    </label>
                    <input
                        type="number"
                        id="grade"
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        min="0"
                        max="100"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="e.g., 85 for 85%"
                    />
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
                        {isSubmitting ? "Adding..." : "Add Assessment"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}