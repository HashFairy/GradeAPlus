import { createClient } from "../utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Dashboard() {
    const supabase = await createClient();

    // Fetch the logged-in user
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/sign-in");
    }

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h1>Hello, {user?.email}!</h1>
            <p>Welcome to the Grade A Plus Dashboard.</p>
            <p>
                Here, you can manage your tasks, view analytics, and track your
                progress to stay ahead of your academic goals!
            </p>
        </div>
    );
}
