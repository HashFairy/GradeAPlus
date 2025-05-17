"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addYearAction } from "../(actions)/addYearAction"; // Import the server action directly

export default function AddYearForm() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [yearNumber, setYearNumber] = useState("");
    const [yearCredit, setYearCredit] = useState("");
    const [yearWeight, setYearWeight] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!yearNumber) return;

        try {
            setIsSubmitting(true);
            setError("");

            // Create the form data
            const formData = new FormData();
            formData.append("yearNumber", yearNumber);
            if (yearCredit) formData.append("yearCredit", yearCredit);
            if (yearWeight) formData.append("yearWeight", yearWeight);

            // Call the server action directly
            const result = await addYearAction(formData);

            if (result.error) {
                setError(result.error);
                return;
            }

            // Clear the form
            setYearNumber("");
            setYearCredit("");
            setYearWeight("");

            // No need to manually refresh as the server action includes revalidatePath
            // But we can still do it for good measure
            router.refresh();

        } catch (error) {
            console.error("Error adding year:", error);
            setError("Failed to add year. Please try again.");
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
                <label htmlFor="yearNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Year Number*
                </label>
                <input
                    type="number"
                    id="yearNumber"
                    value={yearNumber}
                    onChange={(e) => setYearNumber(e.target.value)}
                    min="1"
                    max="10"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="e.g., 1, 2, 3, 4"
                    required
                />
            </div>

            <div>
                <label htmlFor="yearCredit" className="block text-sm font-medium text-gray-700 mb-1">
                    Year Total Credits (Optional)
                </label>
                <input
                    type="number"
                    id="yearCredit"
                    value={yearCredit}
                    onChange={(e) => setYearCredit(e.target.value)}
                    min="1"
                    max="200"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="e.g., 120"
                />
            </div>

            <div>
                <label htmlFor="yearWeight" className="block text-sm font-medium text-gray-700 mb-1">
                    Year Weight % (Optional)
                </label>
                <input
                    type="number"
                    id="yearWeight"
                    value={yearWeight}
                    onChange={(e) => setYearWeight(e.target.value)}
                    min="0"
                    max="100"
                    step="0.1"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="e.g., 20 for 20%"
                />
            </div>

            <div>
                <button
                    type="submit"
                    className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Adding...' : 'Add Year'}
                </button>
            </div>
        </form>
    );
}