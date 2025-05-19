//app/dashboard/grade/year/[yearNumber]/module/[moduleSlug]/layout.tsx

import { createClient } from "@/app/utils/supabase/server";
import { notFound } from "next/navigation";
import AddAssessmentModalWrapper from './AddAssessmentModalWrapper';

export default async function ModuleDetailsPage({ params }: {
    params: {
        yearNumber: string;
        moduleSlug: string;
    }
}) {
    const { yearNumber, moduleSlug } = await params;

    // Parse the ID from the moduleSlug
    const moduleId = moduleSlug.split('-').pop(); // Extract the ID

    // Fetch module data from Supabase
    const supabase = await createClient();

    // Authenticate the user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return <div>Please log in to view this module</div>;
    }

    // Fetch module details without joining the years table
    const { data: module, error } = await supabase
        .from("modules")
        .select(`
          id,
          module_name,
          module_credit,
          created_at,
          year_id
        `)
        .eq("id", moduleId)
        .eq("user_id", user.id)
        .single();

    if (error || !module) {
        console.error("Error fetching module:", error);
        return notFound();
    }

    // Fetch assessments for this module
    const { data: assessments, error: assessmentsError } = await supabase
        .from("assessments")
        .select("*")
        .eq("module_id", moduleId)
        .eq("user_id", user.id)
        .order('assessment_weight', { ascending: false });

    if (assessmentsError) {
        console.error("Error fetching assessments:", assessmentsError);
        return <div>Error loading module assessments</div>;
    }

    // Function to create assessment slug
    const createAssessmentSlug = (assessment: any) => {
        const nameSlug = assessment.assessment_name
            .toLowerCase()
            .replace(/[^\w\s]/g, '') // Remove special characters
            .replace(/\s+/g, '-');    // Replace spaces with hyphens

        return `${nameSlug}-${assessment.id}`;
    };

    // Calculate module total achieved if grades exist
    let totalWeight = 0;
    let weightedTotal = 0;
    let moduleGrade = null;

    assessments.forEach(assessment => {
        if (assessment.assessment_grade !== null && assessment.assessment_weight) {
            totalWeight += assessment.assessment_weight;
            weightedTotal += (assessment.assessment_grade * assessment.assessment_weight);
        }
    });

    if (totalWeight > 0) {
        moduleGrade = (weightedTotal / totalWeight).toFixed(1);
    }

    return (
        <div className="container mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">{module.module_name}</h1>
                <div className="text-gray-600">
                    Year {yearNumber} • {module.module_credit} credits
                    {moduleGrade && <span className="ml-4 font-bold">Current Grade: {moduleGrade}%</span>}
                </div>
            </div>

            {/* Assessments Section */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Assessments</h2>
                    <AddAssessmentModalWrapper
                        moduleId={module.id}
                        yearNumber={yearNumber}
                        moduleSlug={moduleSlug}
                    />
                </div>

                {assessments.length === 0 ? (
                    <div className="text-center p-6 bg-gray-50 rounded-md">
                        <p className="text-gray-600">No assessments added yet.</p>
                        <p className="text-sm text-gray-500 mt-2">
                            Add assessments to track your grades for this module.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="py-3 px-4 text-left">Assessment</th>
                                <th className="py-3 px-4 text-left">Weight</th>
                                <th className="py-3 px-4 text-left">Grade</th>
                                <th className="py-3 px-4 text-left">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                            {assessments.map((assessment) => {
                                const assessmentSlug = createAssessmentSlug(assessment);
                                return (
                                    <tr key={assessment.id} className="hover:bg-gray-50">
                                        <td className="py-3 px-4">
                                            {assessment.assessment_name}
                                        </td>
                                        <td className="py-3 px-4">{assessment.assessment_weight}%</td>
                                        <td className="py-3 px-4">
                                            {assessment.assessment_grade !== null
                                                ? `${assessment.assessment_grade}%`
                                                : <span className="text-gray-400">Not graded</span>
                                            }
                                        </td>
                                        <td className="py-3 px-4">
                                            {/* We'll replace these with modal triggers later */}
                                            <button
                                                className="text-blue-600 hover:underline mr-3"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="text-red-600 hover:underline"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Module Summary Section */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Module Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-lg font-medium mb-2">Module Information</h3>
                        <div className="bg-gray-50 p-4 rounded-md">
                            <p className="mb-2"><span className="font-medium">Credits:</span> {module.module_credit}</p>
                            <p className="mb-2"><span className="font-medium">Year:</span> {yearNumber}</p>
                            <p><span className="font-medium">Added on:</span> {new Date(module.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-medium mb-2">Grade Summary</h3>
                        <div className="bg-gray-50 p-4 rounded-md">
                            <p className="mb-2">
                                <span className="font-medium">Total Assessments:</span> {assessments.length}
                            </p>
                            <p className="mb-2">
                                <span className="font-medium">Completed Assessments:</span> {assessments.filter(a => a.assessment_grade !== null).length}
                            </p>
                            <p>
                                <span className="font-medium">Current Grade:</span> {moduleGrade ? `${moduleGrade}%` : 'Not available'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
