"use client";

import { PlusCircle } from "lucide-react";

interface AddTaskButtonProps {
    onClickAction: () => void; // Renamed from onClick to onClickAction
}

export default function AddTaskButton({ onClickAction }: AddTaskButtonProps) {
    return (
        <button
            onClick={onClickAction}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
            <PlusCircle className="h-5 w-5" />
            <span>Add Task</span>
        </button>
    );
}