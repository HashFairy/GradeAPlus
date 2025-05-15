import Link from "next/link";
import { createClient } from "../../utils/supabase/server";

// client-only form
import AddYearForm from "./(component)/AddYearForm";

// server actions
import { addYearAction } from "./(actions)/addYearAction";

export default async function GradeOverview() {
    const supabase = await createClient();
    const { data: years, error } = await supabase
        .from("years")
        .select("id, year_number")
        .order("year_number", { ascending: true });

    if (error) {
        console.error("Error fetching years:", error.message);
        return <div>Error loading years.</div>;
    }

    return (
        <div style={{ padding: 20 }}>
            <h1>Grade Overview </h1>

            {/* create new year */}
            <AddYearForm addYearAction={addYearAction} />

            <ul>
                {years.map((y) => (
                    <li key={y.id} style={{ margin: "8px 0" }}>
                        <Link href={`/dashboard/grade/year/${y.year_number}`}>Year {y.year_number}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

