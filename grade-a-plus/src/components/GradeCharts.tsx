'use client'

import { useState } from 'react'
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine
} from 'recharts'

// Define types for our data
interface GradeData {
    byModule: {
        subject: string;
        grade: number;
        classification: string;
        credits: number;
    }[];
    byYear: {
        term: string;
        grade: number;
        classification: string;
        credits: number;
    }[];
    gradeDistribution: {
        name: string;
        count: number;
        shortName: string;
    }[];
    assessmentScores: {
        name: string;
        score: number;
        module: string;
        classification: string;
        date: string;
    }[];
    yearProgress: {
        year: string;
        progress: number;
    }[];
}

// Define colors for classification levels
const COLORS = {
    'First': '#10b981', // emerald-500
    'Upper Second': '#3b82f6', // blue-500
    'Lower Second': '#f59e0b', // amber-500
    'Third': '#f97316', // orange-500
    'Fail': '#ef4444', // red-500
};

const CHART_TYPES = ['modules', 'years', 'distribution', 'assessments'] as const;
type ChartType = typeof CHART_TYPES[number];

export default function GradeCharts({ gradeData }: { gradeData: GradeData }) {
    const [activeChart, setActiveChart] = useState<ChartType>('modules');

    // Helper function to get color based on grade
    function getColorForGrade(grade: number): string {
        if (grade >= 70) return COLORS['First'];
        if (grade >= 60) return COLORS['Upper Second'];
        if (grade >= 50) return COLORS['Lower Second'];
        if (grade >= 40) return COLORS['Third'];
        return COLORS['Fail'];
    }

    // Format module data
    const moduleChartData = gradeData?.byModule?.map(module => ({
        name: module.subject,
        grade: module.grade,
        fill: getColorForGrade(module.grade)
    })) || [];

    // Format year data
    const yearChartData = gradeData?.byYear?.map(year => ({
        name: year.term,
        grade: year.grade
    })) || [];

    // Format distribution data
    const distributionChartData = gradeData?.gradeDistribution || [];

    // Format assessment data
    const assessmentChartData = gradeData?.assessmentScores?.map(item => ({
        name: item.name.length > 12 ? item.name.substring(0, 10) + '...' : item.name,
        score: item.score,
        fill: getColorForGrade(item.score)
    })) || [];

    // Custom tooltip
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            if (activeChart === 'distribution') {
                return (
                    <div className="bg-white shadow-md p-2 text-xs border border-gray-200 rounded">
                        <p className="font-semibold">{payload[0].name}</p>
                        <p>{payload[0].value} assessments</p>
                    </div>
                );
            }

            // For module and assessment charts
            const data = payload[0].payload;
            return (
                <div className="bg-white shadow-md p-2 text-xs border border-gray-200 rounded">
                    <p className="font-semibold">{label}</p>
                    <p>Grade: {payload[0].value}%</p>
                    {data.classification && <p>{data.classification}</p>}
                </div>
            );
        }
        return null;
    };

    // Render the currently active chart
    const renderChart = () => {
        switch(activeChart) {
            case 'modules':
                return (
                    <div className="bg-white shadow-sm rounded-md p-3">
                        <h3 className="text-sm font-medium mb-2">Module Performance</h3>
                        <div className="h-40">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={moduleChartData}
                                    margin={{ top: -25, right: 15, bottom: -35, left: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fontSize: 10 }}
                                        angle={0}
                                        textAnchor="end"
                                        height={50}
                                    />
                                    <YAxis
                                        domain={[0, 100]}
                                        ticks={[0, 10, 20, 30, 40, 50, 60, 70, 100]}
                                        tick={{ fontSize: 10 }}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <ReferenceLine y={70} stroke={COLORS['First']} strokeDasharray="3 3" />
                                    <ReferenceLine y={60} stroke={COLORS['Upper Second']} strokeDasharray="3 3" />
                                    <ReferenceLine y={50} stroke={COLORS['Lower Second']} strokeDasharray="3 3" />
                                    <ReferenceLine y={40} stroke={COLORS['Third']} strokeDasharray="3 3" />
                                    <Bar
                                        dataKey="grade"
                                        fill="#8884d8"
                                        radius={[3, 3, 0, 0]}
                                        barSize={50}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                );

            case 'years':
                return (
                    <div className="bg-white shadow-sm rounded-md p-3">
                        <h3 className="text-sm font-medium mb-2">Academic Progress</h3>
                        <div className="h-40">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={yearChartData}
                                    margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fontSize: 10 }}
                                    />
                                    <YAxis
                                        domain={[0, 100]}
                                        ticks={[0, 40, 50, 60, 70, 100]}
                                        tick={{ fontSize: 10 }}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <ReferenceLine y={70} stroke={COLORS['First']} strokeDasharray="3 3" />
                                    <ReferenceLine y={60} stroke={COLORS['Upper Second']} strokeDasharray="3 3" />
                                    <ReferenceLine y={50} stroke={COLORS['Lower Second']} strokeDasharray="3 3" />
                                    <ReferenceLine y={40} stroke={COLORS['Third']} strokeDasharray="3 3" />
                                    <Line
                                        type="monotone"
                                        dataKey="grade"
                                        stroke="#8884d8"
                                        strokeWidth={2}
                                        dot={{ r: 3 }}
                                        activeDot={{ r: 5 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                );

            case 'distribution':
                return (
                    <div className="bg-white shadow-sm rounded-md p-3">
                        <h3 className="text-sm font-medium mb-2">Grade Distribution</h3>
                        <div className="h-40">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={distributionChartData}
                                        dataKey="count"
                                        nameKey="shortName"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={60}
                                        label={({ shortName, percent }) => `${shortName} ${(percent * 100).toFixed(0)}%`}
                                        labelLine={false}
                                    >
                                        {distributionChartData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[entry.name as keyof typeof COLORS] || '#8884d8'}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                );

            case 'assessments':
                return (
                    <div className="bg-white shadow-sm rounded-md p-3">
                        <h3 className="text-sm font-medium mb-2">Recent Assessments</h3>
                        <div className="h-40">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={assessmentChartData}
                                    margin={{ top: 5, right: 5, bottom: 15, left: 5 }}
                                    layout="vertical"
                                >
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                    <XAxis
                                        type="number"
                                        domain={[0, 100]}
                                        tick={{ fontSize: 10 }}
                                    />
                                    <YAxis
                                        dataKey="name"
                                        type="category"
                                        width={80}
                                        tick={{ fontSize: 10 }}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <ReferenceLine x={70} stroke={COLORS['First']} strokeDasharray="3 3" />
                                    <ReferenceLine x={60} stroke={COLORS['Upper Second']} strokeDasharray="3 3" />
                                    <ReferenceLine x={50} stroke={COLORS['Lower Second']} strokeDasharray="3 3" />
                                    <ReferenceLine x={40} stroke={COLORS['Third']} strokeDasharray="3 3" />
                                    <Bar
                                        dataKey="score"
                                        fill="#8884d8"
                                        radius={[0, 3, 3, 0]}
                                        barSize={12}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div>
            <div className="flex space-x-1 mb-2">
                {CHART_TYPES.map(chartType => (
                    <button
                        key={chartType}
                        onClick={() => setActiveChart(chartType)}
                        className={`px-3 py-1 text-xs rounded-md ${
                            activeChart === chartType
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                    >
                        {chartType.charAt(0).toUpperCase() + chartType.slice(1)}
                    </button>
                ))}
            </div>

            {renderChart()}

            {/* Simple legend */}
            <div className="flex flex-wrap gap-2 mt-2 text-[10px]">
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS['First'] }}></div>
                    <span>First (70%+)</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS['Upper Second'] }}></div>
                    <span>2:1 (60-69%)</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS['Lower Second'] }}></div>
                    <span>2:2 (50-59%)</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS['Third'] }}></div>
                    <span>3rd (40-49%)</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS['Fail'] }}></div>
                    <span>Fail (below 40%)</span>
                </div>
            </div>
        </div>
    )
}