// src/app/dashboard/page.tsx (or update existing)
import Link from "next/link";
import { createClient } from "@/app/utils/supabase/server";
import { redirect } from "next/navigation";
import SignOutButton from "../dashboard/grade/(component)/SignOutButton";

export default async function Dashboard() {
    const supabase = await createClient();

    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        // Redirect to login if not authenticated
        redirect("/login");
    }

    // Get counts for dashboard summary
    const { count: tasksCount } = await supabase
        .from("task")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

    const { count: pendingCount } = await supabase
        .from("task")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("status", "pending");

    const { count: completedCount } = await supabase
        .from("task")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("status", "completed");

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <div className="flex items-center space-x-4">
          <span className="text-gray-600">
            {user.email}
          </span>
                    <SignOutButton />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold mb-3">Task Management</h2>
                    <p className="text-gray-600 mb-4">
                        Create and manage your tasks efficiently with our task management system.
                    </p>
                    <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                        <span>Total Tasks: {tasksCount || 0}</span>
                        <span>Pending: {pendingCount || 0}</span>
                        <span>Completed: {completedCount || 0}</span>
                    </div>
                    <Link
                        href="/dashboard/tasks"
                        className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                    >
                        Go to Tasks
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold mb-3">Grade Management</h2>
                    <p className="text-gray-600 mb-4">
                        Track your academic performance with our grade management system.
                    </p>
                    <Link
                        href="/dashboard/grade"
                        className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                    >
                        Go to Grades
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold mb-3">Profile</h2>
                    <p className="text-gray-600 mb-4">
                        Update your profile settings and preferences.
                    </p>
                    <Link
                        href="/dashboard/profile"
                        className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                    >
                        View Profile
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
                <p className="text-gray-600">
                    Your recent activity will appear here. Start by adding tasks or grades to see your progress.
                </p>
            </div>
        </div>
    );
}