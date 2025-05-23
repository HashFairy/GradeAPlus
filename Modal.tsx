"use client";

import { useState, useEffect } from "react";
import { XCircle } from "lucide-react";

interface ModalProps {
    isOpen: boolean;
    onCloseAction: () => void; // Renamed from onClose to onCloseAction
    title: string;
    children: React.ReactNode;
}

export default function Modal({ isOpen, onCloseAction, title, children }: ModalProps) {
    const [mounted, setMounted] = useState(false);

    // Handle ESC key press to close modal
    useEffect(() => {
        setMounted(true);

        const handleEscapeKey = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                onCloseAction();
            }
        };

        document.addEventListener("keydown", handleEscapeKey);

        // Prevent body scrolling when modal is open
        if (isOpen) {
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscapeKey);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onCloseAction]);

    // Don't render on server to avoid hydration mismatch
    if (!mounted) return null;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-gray-300 bg-opacity-30 backdrop-blur-sm"
                onClick={onCloseAction}
                aria-hidden="true"
            />

            {/* Modal */}
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 z-10 max-h-[90vh] flex flex-col">

                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-semibold">{title}</h2>
                    <button
                        onClick={onCloseAction}
                        className="text-gray-500 hover:text-gray-700"
                        aria-label="Close"
                    >
                        <XCircle className="h-6 w-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}