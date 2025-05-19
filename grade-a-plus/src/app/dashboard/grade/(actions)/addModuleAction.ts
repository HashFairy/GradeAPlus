"use server";

import { createClient } from "@/app/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function addModuleAction(formData: FormData) {
    // Extract and validate form data
    const yearId = formData.get("yearId")?.toString();
    const yearNumber = formData.get("yearNumber")?.toString();
    const moduleName = formData.get("moduleName")?.toString();
    const moduleCreditStr = formData.get("moduleCredit")?.toString();

    // Validate inputs
    if (!yearId) {
        return {error: "Year ID cannot be empty."};
    }

    if (!moduleName || moduleName.trim() === '') {
        return {error: "Module name cannot be empty."};
    }

    // Parse optional fields
    let moduleCredit = null;
    if (moduleCreditStr && moduleCreditStr.trim() !== '') {
        moduleCredit = parseInt(moduleCreditStr);
        if (isNaN(moduleCredit) || moduleCredit < 1 || moduleCredit > 100) {
            return {error: "Module credit must be a valid number between 1 and 100."};
        }
    }

    // Initialize Supabase client
    const supabase = await createClient();

    // Get authenticated user
    const {data: {user}} = await supabase.auth.getUser();
    if (!user) {
        return {error: "User authentication is required."};
    }

    // Verify the year exists and belongs to the user
    const {data: year, error: yearError} = await supabase
        .from("years")
        .select("id")
        .eq("id", yearId)
        .eq("user_id", user.id)
        .single();

    if (yearError || !year) {
        return {error: "Invalid year selected."};
    }

    // Check if a module with this name already exists for the year
    const {data: existingModule} = await supabase
        .from("modules")
        .select("id")
        .eq("module_name", moduleName)
        .eq("year_id", yearId)
        .eq("user_id", user.id)
        .single();

    if (existingModule) {
        return {error: `Module "${moduleName}" already exists for this year.`};
    }

    // Insert module into database
    const {data: newModule, error} = await supabase
        .from("modules")
        .insert({
            module_name: moduleName,
            module_credit: moduleCredit,
            year_id: yearId,
            user_id: user.id,
        })
        .select()
        .single();

    if (error) {
        console.error("Supabase insert error:", error);
        return {error: `Failed to add module: ${error.message}`};
    }



    // Revalidate paths to update UI
    // Make sure we're using the correct path format
    if (yearNumber) {
        revalidatePath(`/dashboard/grade/year/${yearNumber}/module`);
    }
    revalidatePath('/dashboard/grade');

    // Return success
    return {success: true, module: newModule};
}