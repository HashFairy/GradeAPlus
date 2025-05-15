// /dashboard/grade/((component))/AddYearForm.tsx

"use client";

import React from "react";

export default function AddYearForm({addYearAction,}: {
    addYearAction: (formData: FormData) => Promise<{ success: boolean; message: string }>;
}) {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        console.log("Adding year with:", Array.from(formData.entries()));

        addYearAction(formData)
            .then((res) => {
                console.log("addYearAction resolved:", res);
                alert(res.message);
            })
            .catch((err) => {
                console.error("addYearAction failed:", err);
                alert("Error: " + err.message);
            });
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: 24, padding: 20, border: "1px solid #ddd" }}>
            <h2>Add a Year</h2>
            <label>
                Year Number:
                <input type="number" name="YearNumber" required />
            </label>
            <br />
            <label>
                Year Credit:
                <input type="number" name="YearCredit" min={1} max={120} required />
            </label>
            <br />
            <label>
                Year Weight (%):
                <input type="number" step="0.01" name="YearWeight" min={0} max={100} required />
            </label>
            <br />
            <button type="submit" style={{ marginTop: 12 }}>
                Create Year
            </button>
        </form>
    );
}
