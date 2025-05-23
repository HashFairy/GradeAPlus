import { createClient } from "@/app/utils/supabase/server";
import TasksList from "./(component)/TasksList";

export default async function TasksPage() {
    // Initialize Supabase client
    const supabase = await createClient();

    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return <div>Please log in to view tasks</div>;
    }

    // Fetch tasks for the user
    const { data: tasks, error } = await supabase
        .from("task")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching tasks:", error);
        return <div>Error loading tasks</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <TasksList tasks={tasks || []} />
        </div>
    );
}
