// /dashboard/grade/[yearNumber]/page.tsx
import { createClient } from "../../../utils/supabase/server";

export default async function YearPage({ params }: { params: { yearNumber: string } }) {
    const yearNumber = parseInt(params.yearNumber);
    const supabase = await createClient();

    const { data: yearData } = await supabase
        .from("years")
        .select("id, year_credit")
        .eq("year_number", yearNumber)
        .single();

    const yearId = yearData?.id;

    const { data: modules } = await supabase
        .from("modules")
        .select("id, module_name, module_credit")
        .eq("year_id", yearId);

    return (
        <div>
            <h1>Year {yearNumber}</h1>
            <p>Total Credits: {yearData?.year_credit}</p>

            <h2>Modules</h2>
            <ul>
                {modules?.map((m) => (
                    <li key={m.id}>
                        {m.module_name} ({m.module_credit} credits)
                    </li>
                ))}
            </ul>
        </div>
    );
}
