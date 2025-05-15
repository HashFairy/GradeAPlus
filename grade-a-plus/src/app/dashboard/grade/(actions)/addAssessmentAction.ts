import { createClient } from '../../../utils/supabase/server'

export const addAssessmentAction = async (formData: FormData) => {
    // Parse form data
    const assessmentName = formData.get("assessmentName")?.toString();
    const assessmentWeight = parseFloat(formData.get("assessmentWeight")?.toString() || "");
    const assessmentGrade = parseFloat(formData.get("assessmentGrade")?.toString() || "");
    const moduleName = formData.get("moduleName")?.toString(); // Use moduleName

    // Initialize Supabase client
    const supabase = await createClient();

    // Fetch authenticated user
    const {
        data: {user},
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        console.error("User authentication failed:", authError?.message || "No user found");
        throw new Error("User authentication is required");
    }

    console.log("Authenticated user:", user);

    // Validate inputs
    if (
        !assessmentName ||
        !moduleName || // Ensure moduleName is provided
        assessmentWeight < 0 ||
        assessmentWeight > 100 ||
        assessmentGrade < 0 ||
        assessmentGrade > 100
    ) {
        console.error("Validation Error: Invalid assessment data", {
            assessmentName,
            moduleName,
            assessmentWeight,
            assessmentGrade,
        });
        throw new Error("Invalid assessment data. Please check the inputs.");
    }

    // Resolve moduleId from moduleName
    console.log("Resolving module ID for moduleName:", moduleName);
    const {data: moduleData, error: moduleError} = await supabase
        .from("modules")
        .select("id")
        .eq("module_name", moduleName) // Match by module name
        .eq("user_id", user.id) // Ensure the module belongs to the authenticated user
        .single();

    if (moduleError || !moduleData) {
        console.error("Module verification failed:", moduleError?.message || "No matching module found");
        throw new Error("You do not have access to this module or it does not exist");
    }

    const moduleId = moduleData.id;
    console.log("Resolved module ID:", moduleId);

    // Insert the assessment into the 'assessments' table
    console.log("Inserting assessment into the 'assessments' table...");
    const {error: insertError} = await supabase.from("assessments").insert({
        assessment_name: assessmentName,
        assessment_weight: assessmentWeight,
        assessment_grade: assessmentGrade,
        module_id: moduleId, // Use the resolved moduleId
        user_id: user.id,
    });

    if (insertError) {
        console.error("Error adding assessment:", insertError.message);
        throw new Error("Failed to add assessment");
    }

    console.log("Assessment added successfully!");
};

