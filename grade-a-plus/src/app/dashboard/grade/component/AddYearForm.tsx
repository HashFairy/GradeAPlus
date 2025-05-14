// /dashboard/grade/(component)/AddYearForm.tsx
"use client";
import React from "react";

export default function AddYearForm({ addYearAction }: { addYearAction: (formData: FormData) => Promise<void> }) {
    return (
        <form action={addYearAction}>
            <input type="number" name="YearNumber" placeholder="Year Number" required />
            <input type="number" name="YearCredit" placeholder="Year Credit" required />
            <input type="number" step="0.01" name="YearWeight" placeholder="Year Weight" required />
            <button type="submit">Add Year</button>
        </form>
    );
}
