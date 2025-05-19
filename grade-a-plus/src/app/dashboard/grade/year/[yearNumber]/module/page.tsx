import { createClient } from "@/app/utils/supabase/server";
import Link from "next/link";
import ModulesClient from "../../../(component)/ModulesClient";

export default async function ModulesListPage({
                                                  params
                                              }: {
    params: { yearNumber: string }
}) {
    const { yearNumber } = params;

    // Convert yearNumber to integer
    const yearNum = parseInt(yearNumber);

    if (isNaN(yearNum)) {
        return <div>Invalid year number</div>;
    }

    // Fetch data from Supabase
    const supabase = await createClient();

    // Authenticate the user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return <div>Please log in to view modules</div>;
    }

    // Fetch year details
    const { data: year, error: yearError } = await supabase
        .from("years")
        .select("*")
        .eq("year_number", yearNum)
        .eq("user_id", user.id)
        .single();

    if (yearError || !year) {
        console.error("Error fetching year:", yearError);
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

    // Fetch modules for this year
    const { data: modules, error: modulesError } = await supabase
        .from("modules")
        .select("*")
        .eq("year_id", year.id)
        .eq("user_id", user.id);

    if (modulesError) {
        console.error("Error fetching modules:", modulesError);
        return <div>Error loading modules</div>;
    }


    return (
        <div className="container mx-auto p-6">
            <ModulesClient
                modules={modules || []}
                yearId={year.id}
                yearNumber={yearNumber}
            />
        </div>
    );
}
