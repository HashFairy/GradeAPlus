import { createClient } from "@/app/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function layout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient();

    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        // If no session exists, redirect to log in
        redirect("/login");
    }



    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold">Dashboard</h1>
                </div>
            </header>

            {/* Main content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {children}
            </main>
        </div>
    );
}
