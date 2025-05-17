"use client";

import React from "react";

interface AddAssessmentFormProps {
    moduleId: string;
    yearNumber: string;
    moduleSlug: string;
    addAssessmentAction: (formData: FormData) => Promise<any>;
}

export default function AddAssessmentForm({
                                              moduleId,
                                              yearNumber,
                                              moduleSlug,
                                              addAssessmentAction
                                          }: AddAssessmentFormProps) {
    // Create a wrapper function that ensures moduleId and paths are included
    const handleAction = async (formData: FormData) => {
        // Make sure moduleId is set in the formData
        formData.set("moduleId", moduleId);
        formData.set("yearNumber", yearNumber);
        formData.set("moduleSlug", moduleSlug);
        return addAssessmentAction(formData);
    };

    return (
        <form action={handleAction} className="p-6">
            <h2 className="text-xl font-semibold mb-4">Add Assessment</h2>

            {/* Hidden fields */}
            <input type="hidden" name="moduleId" value={moduleId} />
            <input type="hidden" name="yearNumber" value={yearNumber} />
            <input type="hidden" name="moduleSlug" value={moduleSlug} />

            <div className="space-y-6">
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

                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        className="py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        onClick={() => window.history.back()}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Add Assessment
                    </button>
                </div>
            </div>
        </form>
    );
}