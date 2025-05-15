// /dashboard/grade/year/[yearNumber]/module/page.tsx
import { createClient } from "../../../../../utils/supabase/server";
import { addModuleAction } from "../../../(actions)/addModuleAction";
import AddModuleForm from "../../../(component)/AddModuleForm";

// Make this a Server Component to fetch data
export default async function ModulePage({ params }: { params: { yearNumber: string } }) {
    const yearNumber = params.yearNumber;

    // Server-side data fetching to get the yearId
    const supabase = await createClient();

    // Fetch the user first
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        // Handle unauthenticated users
        return <div>Please log in to access this page</div>;
    }

    // Then fetch the year data using the year number
    const { data: yearData, error } = await supabase
        .from("years")
        .select("id")
        .eq("year_number", yearNumber)
        .eq("user_id", user.id)
        .single();

    if (error || !yearData) {
        return <div>Year not found or error loading data</div>;
    }

    const yearId = yearData.id;

    return (
        <div className="container mx-auto p-6">
            {/* This is where you pass your AddModuleForm component as a "prop" to your page */}
            <div className="bg-white rounded-lg shadow-md">
                <AddModuleForm
                    yearId={yearId}
                    addModuleAction={addModuleAction}
                />
            </div>

            {/* You can add additional UI elements to your page */}
            <div className="mt-8">
                {/* Add your module listing or other UI elements here */}
            </div>
        </div>
    );
}