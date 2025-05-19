"use server";

import { createClient } from '@/app/utils/supabase/server';
import { revalidatePath } from 'next/cache';

// Note: Modified to work with modals - no redirect, just revalidate
export const addAssessmentAction = async (formData: FormData) => {
    console.log("Starting addAssessmentAction...");

    // Extract and validate form data
    const assessmentName = formData.get("assessmentName")?.toString().trim();
    const assessmentWeightStr = formData.get("assessmentWeight")?.toString();
    const assessmentGradeStr = formData.get("assessmentGrade")?.toString();
    const moduleId = formData.get("moduleId")?.toString();
    const yearNumber = formData.get("yearNumber")?.toString();
    const moduleSlug = formData.get("moduleSlug")?.toString();

    for (const [key, value] of formData.entries()) {
        console.log(`  ${key}: ${value}`);
    }

    // Validate inputs
    if (!assessmentName) throw new Error("Assessment name cannot be empty.");
    if (!moduleId) throw new Error("Module ID is missing!");
    if (!yearNumber) throw new Error("Year number is missing!");
    if (!moduleSlug) throw new Error("Module slug is missing!");

    // Parse assessment weight
    const assessmentWeight = assessmentWeightStr ? parseInt(assessmentWeightStr) : NaN;
    if (!Number.isInteger(assessmentWeight) || assessmentWeight <= 0 || assessmentWeight > 100)
        throw new Error("Weight must be a valid number between 1 and 100.");

    // Parse assessment grade if provided
    let assessmentGrade = null;
    if (assessmentGradeStr && assessmentGradeStr.trim() !== '') {
        assessmentGrade = parseFloat(assessmentGradeStr);
        if (isNaN(assessmentGrade) || assessmentGrade < 0 || assessmentGrade > 100)
            throw new Error("Grade must be a valid number between 0 and 100.");
    }

    // Initialize Supabase client
    const supabase = await createClient();

    // Authenticate user
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) throw new Error("User authentication is required.");

    // Insert assessment into database
    const { data: newAssessment, error } = await supabase
        .from("assessments")
        .insert({
            assessment_name: assessmentName,
            assessment_weight: assessmentWeight,
            assessment_grade: assessmentGrade,
            module_id: moduleId,
            user_id: user.id,
        })
        .select()
        .single();

    if (error) {
        console.error("Supabase insert error:", error);
        throw new Error(`Failed to add assessment: ${error.message}`);
    }

    // Revalidate paths to update UI
    revalidatePath(`/dashboard/grade/year/${yearNumber}/module/${moduleSlug}`);

    // Return success - no redirect needed as modal will close itself
    return { success: true, assessment: newAssessment };
};