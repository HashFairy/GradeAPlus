import { useState } from "react";

const AddAssessmentForm = ({ onSubmit }) => {
    const [assessmentName, setAssessmentName] = useState("");
    const [assessmentWeight, setAssessmentWeight] = useState("");
    const [assessmentGrade, setAssessmentGrade] = useState("");
    const [moduleName, setModuleName] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ assessmentName, assessmentWeight, assessmentGrade, moduleName });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Assessment Name"
                value={assessmentName}
                onChange={(e) => setAssessmentName(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Module Name"
                value={moduleName}
                onChange={(e) => setModuleName(e.target.value)}
                required
            />
            <input
                type="number"
                placeholder="Assessment Weight"
                value={assessmentWeight}
                onChange={(e) => setAssessmentWeight(e.target.value)}
                required
            />
            <input
                type="number"
                placeholder="Assessment Grade"
                value={assessmentGrade}
                onChange={(e) => setAssessmentGrade(e.target.value)}
                required
            />
            <button type="submit">Submit</button>
        </form>
    );
};

export default AddAssessmentForm;
