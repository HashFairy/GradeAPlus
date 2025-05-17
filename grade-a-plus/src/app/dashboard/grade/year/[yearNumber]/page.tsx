// /app/dashboard/grade/year/[yearNumber]/layout.tsx

import { createClient } from "@/app/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";

export default async function YearPage({ params }: { params: { yearNumber: string } }) {
    const {yearNumber} = await params;

    // Convert yearNumber to integer if it's a number
    const yearNum = parseInt(yearNumber);

    // Ensure yearNumber is a valid number
    if (isNaN(yearNum)) {
        return <div>Invalid year number</div>;
    }

    // Fetch data from Supabase
    const supabase = await createClient();

    // Authenticate the user
    const {data: {user}} = await supabase.auth.getUser();
    if (!user) {
        return <div>Please log in to view this year</div>;
    }

    // Fetch year details by year_number
    const {data: year, error} = await supabase
        .from("years")
        .select("*")
        .eq("year_number", yearNum)
        .eq("user_id", user.id)
        .single();

    if (error || !year) {
        console.error("Error fetching year:", error);

        // If the year doesn't exist, redirect to the years list
        // Or you could show a message and offer to create it
        return (
            <div className="container mx-auto p-6">
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <h1 className="text-2xl font-bold mb-4">Year {yearNumber} Not Found</h1>
                    <p className="mb-4">This year doesn't exist in your account.</p>
                    <div className="flex justify-center gap-4">
                        <Link
                            href="/dashboard/grade"
                            className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
                        >
                            Back to Dashboard
                        </Link>
                        <Link
                            href="/dashboard/grade/year/add"
                            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                        >
                            Create Year {yearNumber}
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Redirect to the module listing page for this year
    redirect(`/dashboard/grade/year/${yearNumber}/module`);
}