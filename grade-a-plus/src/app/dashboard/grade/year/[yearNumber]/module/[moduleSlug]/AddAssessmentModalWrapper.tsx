// /dashboard/grade/(component)/AddAssessmentModal.tsx
"use client";

import React, { useState } from "react";
import { addAssessmentAction } from "../../../../(actions)/addAssessmentAction";

interface AddAssessmentModalProps {
    moduleId: string;
    yearNumber: string;
    moduleSlug: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function AddAssessmentModal({
                                               moduleId,
                                               yearNumber,
                                               moduleSlug,
                                               isOpen,
                                               onClose
                                           }: AddAssessmentModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle form submission
    const handleSubmit = async (formData: FormData) => {
        try {
            setIsSubmitting(true);
            // Make sure moduleId is set in the formData
            formData.set("moduleId", moduleId);
            formData.set("yearNumber", yearNumber);
            formData.set("moduleSlug", moduleSlug);

            await addAssessmentAction(formData);
            onClose(); // Close the modal on success
        } catch (error) {
            console.error("Error adding assessment:", error);
            alert("Failed to add assessment. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Add Assessment</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form action={handleSubmit} className="space-y-6">
                        {/* Hidden fields */}
                        <input type="hidden" name="moduleId" value={moduleId} />
                        <input type="hidden" name="yearNumber" value={yearNumber} />
                        <input type="hidden" name="moduleSlug" value={moduleSlug} />

                        <div>
                            <label htmlFor="assessmentName" className="block text-sm font-medium text-gray-700 mb-1">
                                Assessment Name*
                            </label>
                            <input
                                type="text"
                                id="assessmentName"
                                name="assessmentName"
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., Final Exam, Midterm Paper, Project"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="assessmentWeight" className="block text-sm font-medium text-gray-700 mb-1">
                                Weight (%)*
                            </label>
                            <input
                                type="number"
                                id="assessmentWeight"
                                name="assessmentWeight"
                                min="1"
                                max="100"
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Assessment weight (e.g., 40 for 40%)"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">How much this assessment contributes to your final module grade</p>
                        </div>

                        <div>
                            <label htmlFor="assessmentGrade" className="block text-sm font-medium text-gray-700 mb-1">
                                Grade (if known)
                            </label>
                            <input
                                type="number"
                                id="assessmentGrade"
                                name="assessmentGrade"
                                min="0"
                                max="100"
                                step="0.1"
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Leave blank if not graded yet"
                            />
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Adding...' : 'Add Assessment'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}