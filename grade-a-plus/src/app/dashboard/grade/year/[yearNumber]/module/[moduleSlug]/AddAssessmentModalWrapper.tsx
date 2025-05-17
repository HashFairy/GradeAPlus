// /app/dashboard/grade/year/[yearNumber]/module/[moduleSlug]/AddAssessmentModalWrapper.tsx
"use client";

import { useState } from "react";
import AddAssessmentModal from "../../../../(component)/AddAssessmentModal";

interface AddAssessmentModalWrapperProps {
    moduleId: string;
    yearNumber: string;
    moduleSlug: string;
}

export default function AddAssessmentModalWrapper({
                                                      moduleId,
                                                      yearNumber,
                                                      moduleSlug
                                                  }: AddAssessmentModalWrapperProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
                Add Assessment
            </button>

            <AddAssessmentModal
                moduleId={moduleId}
                yearNumber={yearNumber}
                moduleSlug={moduleSlug}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}