// src/app/dashboard/page.tsx
import { createClient } from "@/app/utils/supabase/server";
import Link from "next/link";
import SimpleGradeCharts from "@/components/GradeCharts";
import {
    PlusCircle,
    CheckCircleIcon,
    ClockIcon,
    BookOpen,
    GraduationCap,
    CalendarIcon
} from "lucide-react";

export default async function Dashboard() {
    const supabase = await createClient();

    // Get user data
    const { data: { user } } = await supabase.auth.getUser();

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

    // Get recent tasks
    const { data: recentTasks } = await supabase
        .from("task")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);

    // TEMPORARY: Use mock grade data for testing the visualizations
    const gradeData = {
        byModule: [
            { subject: 'Mathematics', grade: 78.5, classification: 'First Class', credits: 20 },
            { subject: 'Computer Science', grade: 85.2, classification: 'First Class', credits: 20 },
            { subject: 'Physics', grade: 62.0, classification: 'Upper Second Class', credits: 15 },
            { subject: 'English Literature', grade: 68.5, classification: 'Upper Second Class', credits: 10 },
            { subject: 'History', grade: 55.5, classification: 'Lower Second Class', credits: 15 },
            { subject: 'Art & Design', grade: 72.0, classification: 'First Class', credits: 10 },
        ],
        byYear: [
            { term: 'Year 1', grade: 76.8, classification: 'First Class', credits: 120 },
            { term: 'Year 2', grade: 69.4, classification: 'Upper Second Class', credits: 120 },
            { term: 'Year 3', grade: 72.1, classification: 'First Class', credits: 120 },
        ],
        gradeDistribution: [
            { name: 'First', count: 8, shortName: '1st' },
            { name: 'Upper Second', count: 10, shortName: '2:1' },
            { name: 'Lower Second', count: 4, shortName: '2:2' },
            { name: 'Third', count: 2, shortName: '3rd' },
            { name: 'Fail', count: 1, shortName: 'Fail' },
        ],
        assessmentScores: [
            { name: 'Final Exam', score: 88, classification: 'First Class', module: 'Computer Science', date: '2023-05-15' },
            { name: 'Research Paper', score: 62, classification: 'Upper Second Class', module: 'English Literature', date: '2023-05-10' },
            { name: 'Lab Test', score: 55, classification: 'Lower Second Class', module: 'Physics', date: '2023-05-05' },
            { name: 'Project Presentation', score: 72, classification: 'First Class', module: 'Art & Design', date: '2023-04-28' },
            { name: 'Midterm Quiz', score: 48, classification: 'Third Class', module: 'Mathematics', date: '2023-04-20' },
        ],
        yearProgress: [
            { year: 'Year 1', progress: 100 },
            { year: 'Year 2', progress: 100 },
            { year: 'Year 3', progress: 75 },
        ]
    };

    // When service module is working correctly, uncomment this line:
    // const gradeData = await getGradeVisualizationData(supabase, user.id);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-sm text-muted-foreground">Welcome to your student portal</p>
                </div>
            </div>

            {/* Task Overview Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white rounded-lg shadow p-3">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-medium text-gray-500">Total Tasks</p>
                            <h3 className="text-xl font-bold">{tasksCount || 0}</h3>
                        </div>
                        <div className="bg-indigo-100 p-1.5 rounded-full">
                            <BookOpen className="h-4 w-4 text-indigo-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-3">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-medium text-gray-500">Pending Tasks</p>
                            <h3 className="text-xl font-bold">{pendingCount || 0}</h3>
                        </div>
                        <div className="bg-amber-100 p-1.5 rounded-full">
                            <ClockIcon className="h-4 w-4 text-amber-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-3">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-medium text-gray-500">Completed Tasks</p>
                            <h3 className="text-xl font-bold">{completedCount || 0}</h3>
                        </div>
                        <div className="bg-green-100 p-1.5 rounded-full">
                            <CheckCircleIcon className="h-4 w-4 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-3">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-medium text-gray-500">Academic Year</p>
                            <h3 className="text-xl font-bold">Year {gradeData.byYear.length}</h3>
                        </div>
                        <div className="bg-blue-100 p-1.5 rounded-full">
                            <GraduationCap className="h-4 w-4 text-blue-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Academic Performance */}
            <div>
                <SimpleGradeCharts gradeData={gradeData} />
            </div>

            {/* Quick Actions and Recent Tasks */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-white rounded-lg shadow p-3">
                    <h3 className="text-sm font-medium mb-2">Quick Actions</h3>
                    <div className="flex flex-col gap-1.5">
                        <Link href="/dashboard/tasks/new" className="flex items-center gap-2 text-xs rounded px-2 py-1.5 text-indigo-600 bg-indigo-50 hover:bg-indigo-100">
                            <PlusCircle className="h-3.5 w-3.5" />
                            Create New Task
                        </Link>
                        <Link href="/dashboard/grade/new" className="flex items-center gap-2 text-xs rounded px-2 py-1.5 text-indigo-600 bg-indigo-50 hover:bg-indigo-100">
                            <PlusCircle className="h-3.5 w-3.5" />
                            Add New Assessment
                        </Link>
                        <Link href="/dashboard/calendar" className="flex items-center gap-2 text-xs rounded px-2 py-1.5 text-indigo-600 bg-indigo-50 hover:bg-indigo-100">
                            <CalendarIcon className="h-3.5 w-3.5" />
                            View Calendar
                        </Link>
                    </div>
                </div>

                {/* Recent Tasks */}
                <div className="bg-white rounded-lg shadow overflow-hidden md:col-span-2">
                    <div className="px-3 py-2 border-b border-gray-200">
                        <h3 className="text-sm font-medium">Recent Tasks</h3>
                    </div>
                    {recentTasks && recentTasks.length > 0 ? (
                        <div className="divide-y divide-gray-200">
                            {recentTasks.slice(0, 3).map((task) => (
                                <Link key={task.id} href={`/dashboard/tasks/${task.id}`} className="block hover:bg-gray-50">
                                    <div className="px-3 py-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                {task.status === "completed" ? (
                                                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100">
                                                        <CheckCircleIcon className="h-3.5 w-3.5 text-green-600" />
                                                    </div>
                                                ) : (
                                                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-amber-100">
                                                        <ClockIcon className="h-3.5 w-3.5 text-amber-600" />
                                                    </div>
                                                )}
                                                <div className="ml-3">
                                                    <div className="text-xs font-medium text-gray-900">{task.title}</div>
                                                    <div className="text-[10px] text-gray-500">
                                                        Due: {new Date(task.due_date).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                            <span
                                                className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium ${
                                                    task.status === 'completed'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-amber-100 text-amber-800'
                                                }`}
                                            >
                        {task.status === 'completed' ? 'Completed' : 'Pending'}
                      </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="p-3 text-center">
                            <p className="text-xs text-gray-500">No recent tasks found.</p>
                        </div>
                    )}
                    {recentTasks && recentTasks.length > 0 && (
                        <div className="bg-gray-50 px-3 py-1.5 text-right">
                            <Link href="/dashboard/tasks" className="text-xs font-medium text-indigo-600 hover:text-indigo-900">
                                View all tasks →
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}