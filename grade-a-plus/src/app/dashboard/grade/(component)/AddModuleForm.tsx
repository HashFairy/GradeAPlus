
// /dashboard/grade/(component)/AddModuleForm.tsx

import React, { useState } from "react";

export default function AddModuleForm({
                                          yearId,
                                          addModuleAction,
                                      }: {
    yearId: string;
    addModuleAction: (formData: FormData) => Promise<void>;
}) {
    const [name, setName] = useState("");
    const [credit, setCredit] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("moduleName", name);
        formData.append("moduleCredit", credit);
        formData.append("yearId", yearId);
        addModuleAction(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input placeholder="Module Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input placeholder="Module Credit" type="number" value={credit} onChange={(e) => setCredit(e.target.value)} />
            <button type="submit">Add Module</button>
        </form>
    );
}
