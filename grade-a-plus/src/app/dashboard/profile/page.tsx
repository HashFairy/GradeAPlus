'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { createClient } from '@/app/utils/supabase/client';
import { Database } from '@/app/utils/supabase/types';

const UK_UNIVERSITIES = [
    'University of Oxford', 'University of Cambridge', 'Imperial College London',
    'University College London', 'University of Edinburgh', 'University of Manchester',
    "King's College London", 'London School of Economics', 'University of Bristol',
    'University of Warwick', 'University of Birmingham', 'University of Glasgow',
    'University of Leeds', 'University of Southampton', 'University of Sheffield',
    'University of Nottingham', 'Queen Mary University of London', 'University of Liverpool',
    'University of York', 'Newcastle University', 'Durham University', 'University of Exeter',
    'Cardiff University', 'University of Aberdeen', 'University of St Andrews',
    "Queen's University Belfast", 'University of Bath', 'University of Reading',
    'University of Sussex', 'University of Leicester'
];

const FIELDS_OF_STUDY = [
    'Accounting & Finance', 'Computer Science', 'Engineering', 'Medicine', 'Law',
    'Business & Management', 'Psychology', 'Economics', 'Art & Design', 'Other'
];

const COMMON_SOCIETIES = [
    'Student Union', 'Sports Club', 'Tech Society', 'Drama Society', 'Music Society',
    'Gaming Society', 'Volunteering Society', 'Other'
];

const COMMON_INTERESTS = [
    'Reading', 'Sports', 'Music', 'Gaming', 'Technology', 'Art', 'Travel', 'Cooking', 'Other'
];

export default function StudentProfilePage() {
    const supabase = createClient();

    const [profile, setProfile] = useState({
        university: '',
        field_of_study: '',
        year_of_study: 1,
        graduation_year: null,
        first_name: '',
        last_name: '',
        gender: 'prefer_not_to_say',
        age: 18,
        bio: '',
        student_societies: [],
        interests: []
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (error && error.code !== 'PGRST116') throw error;

            if (data) {
                setProfile({
                    university: data.university || '',
                    field_of_study: data.field_of_study || '',
                    year_of_study: data.year_of_study || 1,
                    graduation_year: data.graduation_year,
                    first_name: data.first_name || '',
                    last_name: data.last_name || '',
                    gender: data.gender || 'prefer_not_to_say',
                    age: data.age || 18,
                    bio: data.bio || '',
                    student_societies: data.student_societies || [],
                    interests: data.interests || []
                });
            }
        } catch (error) {
            console.error('Error loading profile:', error);
            setMessage('Error loading profile');
        } finally {
            setLoading(false);
        }
    };

    const saveProfile = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { error } = await supabase
                .from('profiles')
                .upsert({
                    user_id: user.id,
                    ...profile,
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;
            setMessage('Profile saved successfully!');
        } catch (error) {
            console.error('Error saving profile:', error);
            setMessage('Error saving profile: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    const addToArray = (field, value) => {
        if (value && !profile[field].includes(value)) {
            setProfile({
                ...profile,
                [field]: [...profile[field], value]
            });
        }
    };

    const removeFromArray = (field, value) => {
        setProfile({
            ...profile,
            [field]: profile[field].filter(item => item !== value)
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center">
                            <Link href="/dashboard" className="flex items-center text-gray-900 hover:text-gray-600">
                                <ChevronLeftIcon className="h-5 w-5 mr-1" />
                                <span className="text-sm font-medium">Back to Dashboard</span>
                            </Link>
                        </div>
                        <h1 className="text-lg font-semibold text-gray-900">Student Profile</h1>
                        <div className="w-20"></div>
                    </div>
                </div>
            </header>

            <main className="py-10">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    {message && (
                        <div className={`mb-6 rounded-md p-4 ${message.includes('Error') ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={saveProfile} className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Academic Information</h3>
                        </div>

                        <div className="px-6 py-4 space-y-6">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">University</label>
                                    <select
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={profile.university}
                                        onChange={(e) => setProfile({...profile, university: e.target.value})}
                                        required
                                    >
                                        <option value="">Select your university</option>
                                        {UK_UNIVERSITIES.map((uni) => (
                                            <option key={uni} value={uni}>{uni}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Field of Study</label>
                                    <select
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={profile.field_of_study}
                                        onChange={(e) => setProfile({...profile, field_of_study: e.target.value})}
                                        required
                                    >
                                        <option value="">Select your field</option>
                                        {FIELDS_OF_STUDY.map((field) => (
                                            <option key={field} value={field}>{field}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Year of Study</label>
                                    <select
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={profile.year_of_study}
                                        onChange={(e) => setProfile({...profile, year_of_study: parseInt(e.target.value)})}
                                        required
                                    >
                                        <option value="1">First Year</option>
                                        <option value="2">Second Year</option>
                                        <option value="3">Third Year</option>
                                        <option value="4">Fourth Year</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Age</label>
                                    <input
                                        type="number"
                                        min="16"
                                        max="100"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={profile.age}
                                        onChange={(e) => setProfile({...profile, age: parseInt(e.target.value)})}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                                    <input
                                        type="text"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={profile.first_name}
                                        onChange={(e) => setProfile({...profile, first_name: e.target.value})}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                    <input
                                        type="text"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={profile.last_name}
                                        onChange={(e) => setProfile({...profile, last_name: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Bio</label>
                                <textarea
                                    rows={3}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    placeholder="Tell us about yourself..."
                                    value={profile.bio}
                                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Societies</label>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {profile.student_societies.map((society) => (
                                        <span
                                            key={society}
                                            className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-sm text-indigo-800"
                                        >
                                            {society}
                                            <button
                                                type="button"
                                                className="ml-2 text-indigo-600 hover:text-indigo-800"
                                                onClick={() => removeFromArray('student_societies', society)}
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <select
                                    className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    onChange={(e) => {
                                        if (e.target.value) {
                                            addToArray('student_societies', e.target.value);
                                            e.target.value = '';
                                        }
                                    }}
                                >
                                    <option value="">Add a society</option>
                                    {COMMON_SOCIETIES.filter(s => !profile.student_societies.includes(s)).map((society) => (
                                        <option key={society} value={society}>{society}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Interests</label>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {profile.interests.map((interest) => (
                                        <span
                                            key={interest}
                                            className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm text-green-800"
                                        >
                                            {interest}
                                            <button
                                                type="button"
                                                className="ml-2 text-green-600 hover:text-green-800"
                                                onClick={() => removeFromArray('interests', interest)}
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <select
                                    className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    onChange={(e) => {
                                        if (e.target.value) {
                                            addToArray('interests', e.target.value);
                                            e.target.value = '';
                                        }
                                    }}
                                >
                                    <option value="">Add an interest</option>
                                    {COMMON_INTERESTS.filter(i => !profile.interests.includes(i)).map((interest) => (
                                        <option key={interest} value={interest}>{interest}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
                            <Link
                                href="/dashboard"
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {saving ? 'Saving...' : 'Save Profile'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}