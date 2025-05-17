// /app/dashboard/grade/(actions)/addYearAction.ts
"use server";

import { cookies } from "next/headers";
import { createClient } from "@/app/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function addYearAction(formData: FormData) {
    // Extract and validate form data
    const yearNumberStr = formData.get("yearNumber")?.toString();
    const yearCreditStr = formData.get("yearCredit")?.toString();
    const yearWeightStr = formData.get("yearWeight")?.toString();

    // Validate inputs
    if (!yearNumberStr) {
        return { error: "Year number cannot be empty." };
    }

    const yearNumber = parseInt(yearNumberStr);
    if (!Number.isInteger(yearNumber) || yearNumber < 1 || yearNumber > 10) {
        return { error: "Year number must be a valid number between 1 and 10." };
    }

    // Parse optional fields
    let yearCredit = null;
    if (yearCreditStr && yearCreditStr.trim() !== '') {
        yearCredit = parseInt(yearCreditStr);
        if (isNaN(yearCredit) || yearCredit < 1 || yearCredit > 200) {
            return { error: "Year credit must be a valid number between 1 and 200." };
        }
    }

    let yearWeight = null;
    if (yearWeightStr && yearWeightStr.trim() !== '') {
        yearWeight = parseFloat(yearWeightStr);
        if (isNaN(yearWeight) || yearWeight < 0 || yearWeight > 100) {
            return { error: "Year weight must be a valid number between 0 and 100." };
        }
    }

    // Initialize Supabase client
    const cookieStore = cookies();
    const supabase = await createClient();

    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: "User authentication is required." };
    }

    // Check if a year with this number already exists for the user
    const { data: existingYear } = await supabase
        .from("years")
        .select("id")
        .eq("year_number", yearNumber)
        .eq("user_id", user.id)
        .single();

    if (existingYear) {
        return { error: `Year ${yearNumber} already exists.` };
    }

    // Insert year into database
    const { data: newYear, error } = await supabase
        .from("years")
        .insert({
            year_number: yearNumber,
            year_credit: yearCredit,
            year_weight: yearWeight,
            user_id: user.id,
        })
        .select()
        .single();

    if (error) {
        console.error("Supabase insert error:", error);
        return { error: `Failed to add year: ${error.message}` };
    }

    // Revalidate paths to update UI
    revalidatePath('/dashboard/grade');

    // Return success
    return { success: true, year: newYear };
}