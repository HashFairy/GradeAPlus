"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addModuleAction } from "../(actions)/addModuleAction";

interface AddModuleFormProps {
    yearId: string;
    yearNumber: string;
    onSuccess?: () => void;
}

export default function AddModuleForm({ yearId, yearNumber, onSuccess }: AddModuleFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [moduleName, setModuleName] = useState("");
    const [moduleCredit, setModuleCredit] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!moduleName) return;

        try {
            setIsSubmitting(true);
            setError("");

            // Create the form data
            const formData = new FormData();
            formData.append("yearId", yearId);
            formData.append("yearNumber", yearNumber);
            formData.append("moduleName", moduleName);
            if (moduleCredit) formData.append("moduleCredit", moduleCredit);

            // Call the server action
            const result = await addModuleAction(formData);

            if (result.error) {
                setError(result.error);
                return;
            }

            // Clear the form
            setModuleName("");
            setModuleCredit("");

            // Refresh the page to show the new module
            router.refresh();

            // Call onSuccess callback if provided
            if (onSuccess) {
                onSuccess();
            }

        } catch (error) {
            console.error("Error adding module:", error);
            setError("Failed to add module. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="p-3 bg-red-100 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            <div>
                <label htmlFor="moduleName" className="block text-sm font-medium text-gray-700 mb-1">
                    Module Name*
                </label>
                <input
                    type="text"
                    id="moduleName"
                    value={moduleName}
                    onChange={(e) => setModuleName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="e.g., Mathematics, Physics, Computer Science"
                    required
                />
            </div>

            <div>
                <label htmlFor="moduleCredit" className="block text-sm font-medium text-gray-700 mb-1">
                    Module Credits (Optional)
                </label>
                <input
                    type="number"
                    id="moduleCredit"
                    value={moduleCredit}
                    onChange={(e) => setModuleCredit(e.target.value)}
                    min="1"
                    max="100"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="e.g., 15, 20, 30"
                />
            </div>

            <div>
                <button
                    type="submit"
                    className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Adding...' : 'Add Module'}
                </button>
            </div>
        </form>
    );
}