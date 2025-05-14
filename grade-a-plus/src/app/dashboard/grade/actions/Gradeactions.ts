// /dashboard/grade/(actions)/Gradeactions.ts
"use server";
import { createClient } from "../../../utils/supabase/server";

export async function addYearAction(formData: FormData) {
    const supabase = await createClient();
    const year_number = Number(formData.get("YearNumber"));
    const year_credit = Number(formData.get("YearCredit"));
    const year_weight = Number(formData.get("YearWeight"));

    const { data: userData } = await supabase.auth.getUser();
    const user_id = userData.user?.id;

    await supabase.from("years").insert({ year_number, year_credit, year_weight, user_id });
}

export async function addModuleAction(formData: FormData) {
    const supabase = await createClient();
    const module_name = formData.get("moduleName")?.toString();
    const module_credit = Number(formData.get("moduleCredit"));
    const year_id = formData.get("yearId")?.toString();

    const { data: userData } = await supabase.auth.getUser();
    const user_id = userData.user?.id;

    await supabase.from("modules").insert({ module_name, module_credit, year_id, user_id });
}
