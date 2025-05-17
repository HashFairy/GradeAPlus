"use client";

import { useState } from "react";
import Link from "next/link";
import AddModuleForm from "./AddModuleForm";
import Modal from "@/components/Modal";

interface ModuleData {
    id: string;
    module_name: string;
    module_credit: number | null;
}

interface ModulesClientProps {
    modules: ModuleData[];
    yearId: string;
    yearNumber: string;
}

export default function ModulesClient({ modules, yearId, yearNumber }: ModulesClientProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Function to generate a slug for a module
    const createModuleSlug = (module: ModuleData) => {
        // Convert module name to slug format and append ID
        const nameSlug = module.module_name
            .toLowerCase()
            .replace(/[^\w\s]/g, '')
            .replace(/\s+/g, '-');

        return `${nameSlug}-${module.id}`;
    };

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Modules for Year {yearNumber}</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                    Add New Module
                </button>
            </div>

            {modules.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <p className="text-gray-600">No modules added yet for Year {yearNumber}.</p>
                    <p className="text-sm text-gray-500 mt-2">Click the "Add New Module" button to get started.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {modules.map((module) => {
                        const moduleSlug = createModuleSlug(module);
                        return (
                            <Link
                                key={module.id}
                                href={`/dashboard/grade/year/${yearNumber}/module/${moduleSlug}`}
                            >
                                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                                    <h2 className="text-xl font-semibold mb-2">{module.module_name}</h2>
                                    {module.module_credit !== null && (
                                        <p className="text-gray-600">{module.module_credit} Credits</p>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={`Add New Module to Year ${yearNumber}`}
            >
                <AddModuleForm
                    yearId={yearId}
                    yearNumber={yearNumber}
                    onSuccess={() => setIsModalOpen(false)}
                />
            </Modal>
        </>
    );
}