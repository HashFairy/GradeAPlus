'use client'

import React from 'react';

export default function AcademicStats({ gradeData }) {
    // Calculate overall statistics
    const calculateStats = () => {
        if (!gradeData || !gradeData.byModule || !gradeData.byYear) {
            return {
                overallAverage: 0,
                currentClassification: 'N/A',
                topModule: { name: 'N/A', grade: 0 },
                totalCredits: 0,
                completionRate: 0
            };
        }

        // Overall average from all modules
        const modulesWithGrades = gradeData.byModule.filter(m => m.grade > 0);
        const overallAverage = modulesWithGrades.length
            ? modulesWithGrades.reduce((sum, mod) => sum + (mod.grade * mod.credits), 0) /
            modulesWithGrades.reduce((sum, mod) => sum + mod.credits, 0)
            : 0;

        // Current classification (most recent year)
        const sortedYears = [...gradeData.byYear].sort((a, b) => {
            const yearA = parseInt(a.term.replace('Year ', ''));
            const yearB = parseInt(b.term.replace('Year ', ''));
            return yearB - yearA;
        });
        const currentClassification = sortedYears.length > 0 ? sortedYears[0].classification : 'N/A';

        // Top performing module
        const topModule = [...gradeData.byModule].sort((a, b) => b.grade - a.grade)[0] || { subject: 'N/A', grade: 0 };

        // Total credits completed
        const totalCredits = gradeData.byYear.reduce((sum, year) => sum + year.credits, 0);

        // Overall completion rate
        const completionRate = gradeData.yearProgress
            ? gradeData.yearProgress.reduce((sum, yr) => sum + yr.progress, 0) / gradeData.yearProgress.length
            : 0;

        return {
            overallAverage: Math.round(overallAverage * 10) / 10,
            currentClassification,
            topModule,
            totalCredits,
            completionRate: Math.round(completionRate)
        };
    };

    const stats = calculateStats();

    // Determine classification color based on value
    const getClassColor = (classification) => {
        switch(classification) {
            case 'First Class':
                return 'text-emerald-600';
            case 'Upper Second Class':
                return 'text-sky-600';
            case 'Lower Second Class':
                return 'text-amber-600';
            case 'Third Class':
                return 'text-orange-600';
            case 'Fail':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

    // Get short classification (e.g., "1st" instead of "First Class")
    const getShortClass = (classification) => {
        switch(classification) {
            case 'First Class':
                return '1st';
            case 'Upper Second Class':
                return '2:1';
            case 'Lower Second Class':
                return '2:2';
            case 'Third Class':
                return '3rd';
            case 'Fail':
                return 'Fail';
            default:
                return classification;
        }
    };

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
                <div className="flex flex-col">
                    <dt className="text-sm font-medium text-gray-500 truncate">Overall Average</dt>
                    <dd className="mt-1 text-2xl font-semibold text-gray-900">{stats.overallAverage}%</dd>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
                <div className="flex flex-col">
                    <dt className="text-sm font-medium text-gray-500 truncate">Classification</dt>
                    <dd className={`mt-1 text-xl font-semibold ${getClassColor(stats.currentClassification)}`}>
                        {getShortClass(stats.currentClassification)}
                    </dd>
                    <dd className="text-xs text-gray-500">
                        {stats.currentClassification}
                    </dd>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
                <div className="flex flex-col">
                    <dt className="text-sm font-medium text-gray-500 truncate">Top Module</dt>
                    <dd className="mt-1 text-lg font-semibold text-gray-900 truncate">{stats.topModule.subject}</dd>
                    <dd className="text-sm text-gray-600">{stats.topModule.grade}%</dd>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
                <div className="flex flex-col">
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Credits</dt>
                    <dd className="mt-1 text-2xl font-semibold text-gray-900">{stats.totalCredits}</dd>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
                <div className="flex flex-col">
                    <dt className="text-sm font-medium text-gray-500 truncate">Completion</dt>
                    <dd className="mt-1 text-2xl font-semibold text-gray-900">{stats.completionRate}%</dd>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                            className="bg-indigo-600 h-2 rounded-full"
                            style={{ width: `${stats.completionRate}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
}