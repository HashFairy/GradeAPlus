// src/lib/services/gradeService.tsx

// Define TypeScript interfaces for the data structures
interface Year {
    id: number;
    year_number: number;
    year_credit: number;
    year_weight: number;
    user_id: string;
    created_at: string;
}

interface Module {
    id: number;
    module_name: string;
    module_credit: number;
    year_id: number;
    user_id: string;
    created_at: string;
    years?: Year; // Joined data from the years table
}

interface Assessment {
    id: number;
    assessment_name: string;
    assessment_weight: number;
    assessment_grade: number;
    module_id: number;
    user_id: string;
    created_at: string;
    modules?: Module; // Joined data from the modules table
}

interface GradesByModule {
    subject: string;
    grade: number;
    credits: number;
    classification: string;
}

interface GradesByYear {
    term: string;
    grade: number;
    classification: string;
    credits: number;
}

interface GradeDistribution {
    name: string;
    count: number;
    shortName: string;
}

interface AssessmentScore {
    name: string;
    score: number;
    module: string;
    date: string;
    classification: string;
}

interface YearProgress {
    year: string;
    progress: number;
}

interface GradeVisualizationData {
    byModule: GradesByModule[];
    byYear: GradesByYear[];
    gradeDistribution: GradeDistribution[];
    assessmentScores: AssessmentScore[];
    yearProgress: YearProgress[];
}

// We'll use a more generic type for Supabase client to avoid having to precisely model
// the entire chaining API structure
type SupabaseClient = any;

/**
 * Format grade data for visualization based on the UK grading system
 * Schema includes: years -> modules -> assessments
 */
export async function getGradeVisualizationData(
    supabase: SupabaseClient,
    userId: string
): Promise<GradeVisualizationData> {
    try {
        // Fetch all academic years for this user
        const { data: years, error: yearsError } = await supabase
            .from('years')
            .select('*')
            .eq('user_id', userId)
            .order('year_number', { ascending: true });

        if (yearsError) throw yearsError;

        // Fetch all modules with their year information
        const { data: modules, error: modulesError } = await supabase
            .from('modules')
            .select('*, years!inner(*)')
            .eq('user_id', userId);

        if (modulesError) throw modulesError;

        // Fetch all assessments with their module information
        const { data: assessments, error: assessmentsError } = await supabase
            .from('assessments')
            .select('*, modules!inner(*)')
            .eq('user_id', userId);

        if (assessmentsError) throw assessmentsError;

        // Format data for different chart types
        return {
            byModule: formatGradesByModule(modules as Module[], assessments as Assessment[]),
            byYear: formatGradesByYear(years as Year[], modules as Module[], assessments as Assessment[]),
            gradeDistribution: calculateGradeDistribution(assessments as Assessment[]),
            assessmentScores: getRecentAssessments(assessments as Assessment[]),
            yearProgress: calculateYearProgress(years as Year[], modules as Module[], assessments as Assessment[])
        };
    } catch (error) {
        console.error("Error fetching grade data:", error);
        // Return sample data as fallback
        return getSampleGradeData();
    }
}

// Helper functions to format data

function formatGradesByModule(modules: Module[], assessments: Assessment[]): GradesByModule[] {
    return modules.map(module => {
        const moduleAssessments = assessments.filter(
            assessment => assessment.module_id === module.id
        );

        let totalWeightedGrade = 0;
        let totalWeight = 0;

        moduleAssessments.forEach(assessment => {
            totalWeightedGrade += assessment.assessment_grade * assessment.assessment_weight;
            totalWeight += assessment.assessment_weight;
        });

        // Calculate weighted average or return 0 if no assessments
        const averageGrade = totalWeight > 0
            ? totalWeightedGrade / totalWeight
            : 0;

        return {
            subject: module.module_name,
            grade: Math.round(averageGrade * 10) / 10, // Round to 1 decimal place
            credits: module.module_credit,
            classification: getClassification(averageGrade)
        };
    });
}

function formatGradesByYear(years: Year[], modules: Module[], assessments: Assessment[]): GradesByYear[] {
    return years.map(year => {
        // Get all modules for this year
        const yearModules = modules.filter(module => module.year_id === year.id);

        // Calculate overall grade for each module
        const moduleGrades = yearModules.map(module => {
            const moduleAssessments = assessments.filter(
                assessment => assessment.module_id === module.id
            );

            let totalWeightedGrade = 0;
            let totalWeight = 0;

            moduleAssessments.forEach(assessment => {
                totalWeightedGrade += assessment.assessment_grade * assessment.assessment_weight;
                totalWeight += assessment.assessment_weight;
            });

            return {
                moduleId: module.id,
                grade: totalWeight > 0 ? totalWeightedGrade / totalWeight : 0,
                credits: module.module_credit
            };
        });

        // Calculate weighted average for the year
        let totalCredits = 0;
        let totalWeightedGrade = 0;

        moduleGrades.forEach(module => {
            totalWeightedGrade += module.grade * module.credits;
            totalCredits += module.credits;
        });

        const yearGrade = totalCredits > 0
            ? totalWeightedGrade / totalCredits
            : 0;

        const roundedGrade = Math.round(yearGrade * 10) / 10;

        return {
            term: `Year ${year.year_number}`,
            grade: roundedGrade,
            classification: getClassification(roundedGrade),
            credits: year.year_credit
        };
    });
}

function calculateGradeDistribution(assessments: Assessment[]): GradeDistribution[] {
    // Define UK grade boundaries
    const gradeBoundaries: Record<string, number> = {
        'First': 70,
        'Upper Second': 60,
        'Lower Second': 50,
        'Third': 40,
        'Fail': 0
    };

    // Count assessments in each grade category
    const distribution: Record<string, number> = {
        'First': 0,
        'Upper Second': 0,
        'Lower Second': 0,
        'Third': 0,
        'Fail': 0
    };

    assessments.forEach(assessment => {
        const grade = assessment.assessment_grade;

        if (grade >= gradeBoundaries['First']) distribution['First']++;
        else if (grade >= gradeBoundaries['Upper Second']) distribution['Upper Second']++;
        else if (grade >= gradeBoundaries['Lower Second']) distribution['Lower Second']++;
        else if (grade >= gradeBoundaries['Third']) distribution['Third']++;
        else distribution['Fail']++;
    });

    return Object.entries(distribution).map(([name, count]) => ({
        name,
        count,
        shortName: getShortClassification(name)
    }));
}

function getRecentAssessments(assessments: Assessment[]): AssessmentScore[] {
    // Sort by date created and get 5 most recent
    return assessments
        .slice()
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5)
        .map(assessment => ({
            name: assessment.assessment_name,
            score: assessment.assessment_grade,
            module: assessment.modules?.module_name || 'Unknown Module',
            date: assessment.created_at,
            classification: getClassification(assessment.assessment_grade)
        }));
}

function calculateYearProgress(years: Year[], modules: Module[], assessments: Assessment[]): YearProgress[] {
    return years.map(year => {
        // Get all modules for this year
        const yearModules = modules.filter(module => module.year_id === year.id);

        // Count completed assessments vs total expected assessments
        let totalAssessments = 0;
        let completedAssessments = 0;

        yearModules.forEach(module => {
            const moduleAssessments = assessments.filter(
                assessment => assessment.module_id === module.id
            );

            totalAssessments += moduleAssessments.length;
            completedAssessments += moduleAssessments.filter(
                assessment => assessment.assessment_grade !== null
            ).length;
        });

        // Calculate progress percentage
        const progress = totalAssessments > 0
            ? (completedAssessments / totalAssessments) * 100
            : 0;

        return {
            year: `Year ${year.year_number}`,
            progress: Math.round(progress)
        };
    });
}

// Helper function to convert grade to UK classification
function getClassification(grade: number): string {
    if (grade >= 70) return 'First Class';
    if (grade >= 60) return 'Upper Second Class';
    if (grade >= 50) return 'Lower Second Class';
    if (grade >= 40) return 'Third Class';
    return 'Fail';
}

// Helper function to get short classification
function getShortClassification(classification: string): string {
    const classMap: Record<string, string> = {
        'First': '1st',
        'First Class': '1st',
        'Upper Second': '2:1',
        'Upper Second Class': '2:1',
        'Lower Second': '2:2',
        'Lower Second Class': '2:2',
        'Third': '3rd',
        'Third Class': '3rd',
        'Fail': 'Fail'
    };

    return classMap[classification] || classification;
}

// Sample data as fallback
function getSampleGradeData(): GradeVisualizationData {
    return {
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
}