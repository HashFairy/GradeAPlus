// /dashboard/grade/(component)/AddModuleForm.tsx
"use client";

import React from "react";

interface AddModuleFormProps {
    yearId: string;
    addModuleAction: (formData: FormData) => Promise<any>;
}

export default function AddModuleForm({ yearId, addModuleAction }: AddModuleFormProps) {
    // Create a wrapper function that ensures yearId is included
    const handleAction = async (formData: FormData) => {
        // Make sure yearId is set in the formData
        formData.set("yearId", yearId);
        return addModuleAction(formData);
    };

    return (
        <form action={handleAction} className="p-6">
            <h2 className="text-xl font-semibold mb-4">Add a New Module</h2>

            {/* Hidden field for yearId */}
            <input type="hidden" name="yearId" value={yearId} />

            <div className="space-y-4">
                <div>
                    <label htmlFor="moduleName" className="block text-sm font-medium text-gray-700 mb-1">
                        Module Name
                    </label>
                    <input
                        type="text"
                        id="moduleName"
                        name="moduleName"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="moduleCredit" className="block text-sm font-medium text-gray-700 mb-1">
                        Module Credit
                    </label>
                    <input
                        type="number"
                        id="moduleCredit"
                        name="moduleCredit"
                        min="1"
                        max="120"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Add Module
                </button>
            </div>
        </form>
    );
}