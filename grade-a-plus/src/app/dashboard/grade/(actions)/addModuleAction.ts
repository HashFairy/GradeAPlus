"use server"

import { createClient } from '../../../utils/supabase/server'

export const addModuleAction = async (formData: FormData) => {
    console.log("Starting addModuleAction...");

    // Parse module data from the form
    const moduleName = formData.get("moduleName")?.toString().trim();
    const moduleCredit = parseInt(formData.get("moduleCredit")?.toString() || "");

    console.log("Parsed formData:");
    console.log("  Module Name:", moduleName);
    console.log("  Module Credit:", moduleCredit);

    // Validate inputs
    if (!moduleName) {
        console.error("Validation Error: Module name cannot be empty.");
        throw new Error("Module name cannot be empty.");
    }
    if (!Number.isInteger(moduleCredit) || moduleCredit <= 0 || moduleCredit > 120) {
        console.error("Validation Error: Module credit must be a valid number between 1 and 120.");
        throw new Error("Module credit must be a valid number between 1 and 120.");
    }

    // Initialize Supabase client
    console.log("Initializing Supabase client...");
    const supabase = await createClient();

    // Authenticate user
    console.log("Fetching authenticated user...");
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        console.error("Authentication Error:", authError?.message || "No user found.");
        throw new Error("User authentication is required.");
    }
    console.log("Authenticated user:", user);

    // Fetch yearId for the authenticated user
    console.log("Fetching yearId for the authenticated user...");
    const { data: yearData, error: yearError } = await supabase
        .from("year")
        .select("id")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }) // Get the most recent year
        .limit(1)
        .single();

    if (yearError || !yearData) {
        console.error("Error fetching year data:", yearError?.message || "No year found for the user.");
        throw new Error("Failed to fetch year data. Please create a year first.");
    }

    const yearId = yearData.id;
    console.log("Fetched yearId:", yearId);

    // Insert data into 'modules' table
    console.log("Inserting module into the 'modules' table...");
    const { error } = await supabase.from("modules").insert({
        module_name: moduleName,
        module_credit: moduleCredit,
        year_id: yearId,
        user_id: user.id,
    });

    if (error) {
        console.error("Error inserting module into the database:", error.message);
        throw new Error("Failed to add module. Please try again.");
    }

    console.log("Module added successfully!");
};
