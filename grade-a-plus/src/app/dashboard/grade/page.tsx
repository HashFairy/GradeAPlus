// /app/dashboard/grade/layout.tsx

import Link from "next/link";
import { createClient } from "../../utils/supabase/server";
import AddYearForm from "./(component)/AddYearForm";

export default async function GradeOverview() {
    const supabase = await createClient();

    // Get the authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return <div>Please log in to view your years.</div>;
    }

    // Query the correct table name "years" and filter by user_id
    const { data: years, error } = await supabase
        .from("years")
        .select("id, year_number, year_credit, year_weight")
        .eq("user_id", user.id)
        .order("year_number", { ascending: true });

    if (error) {
        console.error("Error fetching years:", error.message);
        return <div>Error loading years.</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Grade Overview</h1>
            </div>

            {/* Display years in a grid */}
            {years.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-6 text-center mb-8">
                    <p className="text-gray-600 mb-4">You haven't added any academic years yet.</p>
                    <p className="text-sm text-gray-500 mb-6">Add your first academic year to start tracking your modules and grades.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {years.map((year) => (
                        <Link
                            key={year.id}
                            href={`/dashboard/grade/year/${year.year_number}/module`}
                        >
                            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                                <h2 className="text-2xl font-semibold mb-2">Year {year.year_number}</h2>
                                {year.year_credit && (
                                    <p className="text-gray-600 mb-2">Total Credits: {year.year_credit}</p>
                                )}
                                {year.year_weight && (
                                    <p className="text-gray-600">Weight: {year.year_weight}%</p>
                                )}
                                <div className="mt-4 py-2 px-3 bg-blue-50 text-blue-700 text-sm rounded-md inline-block">
                                    View Modules
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Add Year Form in a card */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Add New Academic Year</h2>
                <AddYearForm />
            </div>
        </div>
    );
}

