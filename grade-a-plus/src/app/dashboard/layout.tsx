// src/app/dashboard/layout.tsx
import { createClient } from "@/app/utils/supabase/server";
import { redirect } from "next/navigation";
import DashboardLayout from "../dashboard/(components)/DashboardLayout"
;

export default async function DashboardRootLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient();

    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        // If no session exists, redirect to login
        redirect("/login");
    }

    // Get the user from the session for use in the layout
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <DashboardLayout user={user}>
            {children}
        </DashboardLayout>
    );
}

