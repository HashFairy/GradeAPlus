// /dashboard/grade/page.tsx
import Link from "next/link";
import { createClient } from "../../utils/supabase/server";

export default async function GradePage() {
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
        <div>
            <h1>Grade Overview</h1>
            <ul>
                {years.map((year) => (
                    <li key={year.id}>
                        <Link href={`/dashboard/grade/${year.year_number}`}>
                            Year {year.year_number}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
