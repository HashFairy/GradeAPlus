"use server";

import { createClient } from '../../../utils/supabase/server';
import { revalidatePath } from 'next/cache';

export const addModuleAction = async (formData: FormData) => {
    console.log("Starting addModuleAction...");

    // Extract and validate form data
    const moduleName = formData.get("moduleName")?.toString().trim();
    const moduleCreditStr = formData.get("moduleCredit")?.toString();
    const yearId = formData.get("yearId")?.toString();

    // Log the raw form data for debugging
    console.log("Raw formData entries:");
    for (const [key, value] of formData.entries()) {
        console.log(`  ${key}: ${value}`);
    }

    console.log("Parsed formData:");
    console.log("  Module Name:", moduleName);
    console.log("  Module Credit:", moduleCreditStr);
    console.log("  YearId:", yearId);

    // Validate inputs
    if (!moduleName) throw new Error("Module name cannot be empty.");

    const moduleCredit = moduleCreditStr ? parseInt(moduleCreditStr) : NaN;
    if (!Number.isInteger(moduleCredit) || moduleCredit <= 0 || moduleCredit > 120)
        throw new Error("Module credit must be a valid number between 1 and 120.");

    if (!yearId) throw new Error("Year ID is missing!");

    // Initialize Supabase client
    const supabase = await createClient();

    // Authenticate user
    const {
        data: {user},
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) throw new Error("User authentication is required.");

    // Insert module into database
    const {error} = await supabase.from("modules").insert({
        module_name: moduleName,
        module_credit: moduleCredit,
        year_id: yearId,
        user_id: user.id,
    });

    if (error) {
        console.error("Supabase insert error:", error);
        throw new Error(`Failed to add module: ${error.message}`);
    }

    // Revalidate the path to refresh the UI
    revalidatePath('/dashboard/grade/year/[yearNumber]', 'page');

    return {success: true};
}