// /dashboard/grade/[yearNumber]/page.tsx
import { createClient } from "../../../../utils/supabase/server";

export default async function YearPage({ params }: { params: { yearNumber: string } }) {
    const yearNumber = await parseInt(params.yearNumber, 10);
    console.log("Parsed yearNumber:", yearNumber); // Debug log for yearNumber

    const supabase = await createClient();

    // Fetch year data
    const { data: yearData, error: yearError } = await supabase
        .from("years")
        .select("id, year_credit")
        .eq("year_number", yearNumber)
        .single();

    console.log("Year Data Fetch Result:", { yearData, yearError }); // Debug log for year data

    if (yearError || !yearData) {
        console.error("Year not found:", yearError?.message || "No data returned");
        return <div>Error: Year not found</div>;
    }

    const yearId = yearData.id;
    console.log("yearId being used for module query:", yearId); // Debug log for yearId

    // Fetch modules linked to year_id
    const { data: modules, error: moduleError } = await supabase
        .from("modules")
        .select("id, module_name, module_credit")
        .eq("year_id", yearId);

    console.log("Modules Query Result:", { modules, moduleError }); // Debug log for query result

    if (moduleError) {
        console.error("Error fetching modules:", moduleError.message);
        return <div>Error: Could not fetch modules</div>;
    }

    return (
        <div>
            <h1>Year {yearNumber}</h1>
            <div>
                <p>Details</p>
                <p>Total Credits: {yearData.year_credit}</p>
            </div>
            <h2>Modules</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
                {modules.map((module) => (
                    <div key={module.id} style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "16px" }}>
                        <h3>{module.module_name}</h3>
                        <p>{module.module_credit} Credits</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
