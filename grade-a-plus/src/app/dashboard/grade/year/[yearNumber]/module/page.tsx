"use client"

export default function AddModuleForm({ yearId }: { yearId: string }) {
    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        formData.append("yearId", yearId); // Add the yearId programmatically.

        fetch("/api/add-module", {
            method: "POST",
            body: formData,
        })
            .then((response) => {
                if (!response.ok) throw new Error("Failed to add module");
                return response.json();
            })
            .then(() => {
                alert("Module added successfully!");
            })
            .catch((error) => {
                console.error("Error adding module:", error.message);
                alert("Failed to add module. Please try again.");
            });
    };

    return (
        <form onSubmit={handleFormSubmit} style={{ padding: "20px" }}>
            <h2>Add a Module</h2>
            <label>
                Module Name:
                <input type="text" name="moduleName" required />
            </label>
            <br />
            <label>
                Module Credit:
                <input type="number" name="moduleCredit" min="1" max="120" required />
            </label>
            <br />
            <label>
                Module Weight (%):
                <input type="number" name="moduleWeight" step="0.1" min="0" max="100" required />
            </label>
            <br />
            <button type="submit">Add Module</button>
        </form>
    );
}
