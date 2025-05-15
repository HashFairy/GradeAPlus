"use server"


import { createClient } from "../../../utils/supabase/server";
// ——— Add Year ———
export const addYearAction = async (
    formData: FormData
): Promise<{ success: boolean; message: string }> => {
    console.log("addYearAction received:", Array.from(formData.entries()));

    const yearNumber = parseInt(formData.get("YearNumber")?.toString() || "0", 10);
    const yearCredit = parseInt(formData.get("YearCredit")?.toString() || "0", 10);
    const yearWeight = parseFloat(formData.get("YearWeight")?.toString() || "0");

    console.log({ yearNumber, yearCredit, yearWeight });

    if (isNaN(yearNumber) || isNaN(yearCredit) || isNaN(yearWeight)) {
        throw new Error("Please enter valid numbers for year fields.");
    }

    const supabase = await createClient();
    const {
        data: { user },
        error: authErr,
    } = await supabase.auth.getUser();

    if (authErr || !user) {
        console.error("Auth error:", authErr?.message);
        throw new Error("You must be signed in to create a year.");
    }
    console.log("Authenticated as", user.id);

    const { error } = await supabase.from("years").insert({
        year_number: yearNumber,
        year_credit: yearCredit,
        year_weight: yearWeight,
        user_id: user.id,
    });

    if (error) {
        console.error("Insert year failed:", error.message);
        throw new Error("Failed to add year");
    }

    console.log("Year inserted!");
    return { success: true, message: "Year added successfully!" };
};