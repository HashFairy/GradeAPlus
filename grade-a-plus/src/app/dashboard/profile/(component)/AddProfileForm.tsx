'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { Database } from '../../../utils/supabase/types';
import { upsertProfile } from '../(actions)/addProfileAction';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AddProfileFormProps {
    profile: Profile | null;
    UK_UNIVERSITIES: string[];
    COMMON_SOCIETIES: string[];
    FIELDS_OF_STUDY: string[];
    COMMON_INTERESTS: string[];
}

export default function AddProfileForm({
                                           profile,
                                           UK_UNIVERSITIES,
                                           COMMON_SOCIETIES,
                                           FIELDS_OF_STUDY,
                                           COMMON_INTERESTS
                                       }: AddProfileFormProps) {
    // Form state
    const [formState, setFormState] = useState({
        university: profile?.university || '',
        field_of_study: profile?.field_of_study || '',
        year_of_study: profile?.year_of_study || 1,
        graduation_year: profile?.graduation_year,
        first_name: profile?.first_name || '',
        last_name: profile?.last_name || '',
        gender: profile?.gender || 'prefer_not_to_say',
        gender_other: '',
        age: profile?.age || 18,
        bio: profile?.bio || '',
        student_societies: profile?.student_societies || [],
        interests: profile?.interests || []
    });

    // UI state
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [newSociety, setNewSociety] = useState('');
    const [newInterest, setNewInterest] = useState('');
    const [otherFieldOfStudy, setOtherFieldOfStudy] = useState('');

    // Sync incoming profile
    useEffect(() => {
        if (profile) {
            setFormState({
                university: profile.university || '',
                field_of_study: profile.field_of_study || '',
                year_of_study: profile.year_of_study || 1,
                graduation_year: profile.graduation_year,
                first_name: profile.first_name || '',
                last_name: profile.last_name || '',
                gender: profile.gender || 'prefer_not_to_say',
                gender_other: '',
                age: profile.age || 18,
                bio: profile.bio || '',
                student_societies: profile.student_societies || [],
                interests: profile.interests || []
            });
        }
    }, [profile]);

    // Submit handler
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        const form = e.currentTarget;
        const formData = new FormData(form);
        formData.set('student_societies_json', JSON.stringify(formState.student_societies));
        formData.set('interests_json', JSON.stringify(formState.interests));

        startTransition(async () => {
            const result = await upsertProfile(formData);
            if (result.error) {
                setError(result.error);
                window.scrollTo(0, 0);
            } else {
                setSuccess(true);
                window.scrollTo(0, 0);
                setTimeout(() => setSuccess(false), 5000);
            }
        });
    };

    // Societies
    const handleAddSociety = () => {
        if (newSociety && !formState.student_societies.includes(newSociety)) {
            setFormState(f => ({
                ...f,
                student_societies: [...f.student_societies, newSociety]
            }));
            setNewSociety('');
        }
    };

    const handleRemoveSociety = (s: string) =>
        setFormState(f => ({
            ...f,
            student_societies: f.student_societies.filter(x => x !== s)
        }));

    // Interests
    const handleAddInterest = () => {
        if (newInterest && !formState.interests.includes(newInterest)) {
            setFormState(f => ({ ...f, interests: [...f.interests, newInterest] }));
            setNewInterest('');
        }
    };

    const handleRemoveInterest = (i: string) =>
        setFormState(f => ({ ...f, interests: f.interests.filter(x => x !== i) }));

    // Field of study "Other" logic
    const handleFieldOfStudyChange = (v: string) => {
        if (v === 'Other') {
            setFormState(f => ({ ...f, field_of_study: '' }));
        } else {
            setFormState(f => ({ ...f, field_of_study: v }));
            setOtherFieldOfStudy('');
        }
    };

    return (
        <>
            {error && !success && (
                <div className="mb-6 rounded-md bg-red-50 p-4">
                    <div className="flex">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                            />
                        </svg>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">{error}</h3>
                        </div>
                    </div>
                </div>
            )}

            {success && (
                <div className="mb-6 rounded-md bg-green-50 p-4">
                    <div className="flex">
                        <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                            />
                        </svg>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-green-800">
                                Your profile has been saved successfully!
                            </h3>
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {/* Academic Information */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                            Academic Information
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            Share details about your university and studies
                        </p>
                    </div>

                    <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                            {/* University */}
                            <div className="sm:col-span-3">
                                <label htmlFor="university" className="block text-sm font-medium text-gray-700">
                                    University
                                </label>
                                <div className="mt-1">
                                    <select
                                        id="university"
                                        name="university"
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        value={formState.university}
                                        onChange={e => setFormState(f => ({ ...f, university: e.target.value }))}
                                        required
                                    >
                                        <option value="">Select your university</option>
                                        {UK_UNIVERSITIES.map(u => (
                                            <option key={u} value={u}>{u}</option>
                                        ))}
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                {formState.university === 'Other' && (
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            name="university"
                                            id="university-other"
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            placeholder="Enter your university name"
                                            value={formState.university === 'Other' ? '' : formState.university}
                                            onChange={e => setFormState(f => ({ ...f, university: e.target.value }))}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Field of Study */}
                            <div className="sm:col-span-3">
                                <label htmlFor="field_of_study" className="block text-sm font-medium text-gray-700">
                                    Field of Study
                                </label>
                                <div className="mt-1">
                                    <select
                                        id="field_of_study"
                                        name="field_of_study"
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        value={FIELDS_OF_STUDY.includes(formState.field_of_study) ? formState.field_of_study : 'Other'}
                                        onChange={e => handleFieldOfStudyChange(e.target.value)}
                                        required
                                    >
                                        <option value="">Select your field of study</option>
                                        {FIELDS_OF_STUDY.map(f => (
                                            <option key={f} value={f}>{f}</option>
                                        ))}
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                {(formState.field_of_study === 'Other' || (!FIELDS_OF_STUDY.includes(formState.field_of_study) && formState.field_of_study)) && (
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            name="field_of_study"
                                            id="field-of-study-other"
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            placeholder="Enter your field of study"
                                            value={otherFieldOfStudy || formState.field_of_study}
                                            onChange={e => {
                                                setOtherFieldOfStudy(e.target.value);
                                                setFormState(f => ({ ...f, field_of_study: e.target.value }));
                                            }}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Year of Study */}
                            <div className="sm:col-span-3">
                                <label htmlFor="year_of_study" className="block text-sm font-medium text-gray-700">
                                    Year of Study
                                </label>
                                <div className="mt-1">
                                    <select
                                        id="year_of_study"
                                        name="year_of_study"
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        value={formState.year_of_study}
                                        onChange={e => setFormState(f => ({ ...f, year_of_study: parseInt(e.target.value, 10) }))}
                                        required
                                    >
                                        <option value="1">First Year</option>
                                        <option value="2">Second Year</option>
                                        <option value="3">Third Year</option>
                                        <option value="4">Fourth Year</option>
                                        <option value="5">Fifth Year</option>
                                        <option value="6">Sixth Year or Higher</option>
                                    </select>
                                </div>
                            </div>

                            {/* Graduation Year */}
                            <div className="sm:col-span-3">
                                <label htmlFor="graduation_year" className="block text-sm font-medium text-gray-700">
                                    Expected Graduation Year
                                </label>
                                <div className="mt-1">
                                    <select
                                        id="graduation_year"
                                        name="graduation_year"
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        value={formState.graduation_year || ''}
                                        onChange={e => setFormState(f => ({ ...f, graduation_year: e.target.value ? parseInt(e.target.value, 10) : undefined }))}
                                    >
                                        <option value="">Select graduation year</option>
                                        {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Personal Information */}
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Personal Information</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">Tell us a bit about yourself</p>
                    </div>

                    <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                            {/* First Name */}
                            <div className="sm:col-span-3">
                                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                                    First name
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        name="first_name"
                                        id="first_name"
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        value={formState.first_name}
                                        onChange={e => setFormState(f => ({ ...f, first_name: e.target.value }))}
                                    />
                                </div>
                            </div>

                            {/* Last Name */}
                            <div className="sm:col-span-3">
                                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                                    Last name
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        name="last_name"
                                        id="last_name"
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        value={formState.last_name}
                                        onChange={e => setFormState(f => ({ ...f, last_name: e.target.value }))}
                                    />
                                </div>
                            </div>

                            {/* Gender */}
                            <div className="sm:col-span-3">
                                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                                    Gender
                                </label>
                                <div className="mt-1">
                                    <select
                                        id="gender"
                                        name="gender"
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        value={formState.gender}
                                        onChange={e => setFormState(f => ({ ...f, gender: e.target.value, gender_other: e.target.value !== 'other' ? '' : f.gender_other }))}
                                        required
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="non-binary">Non-binary</option>
                                        <option value="prefer_not_to_say">Prefer not to say</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                {formState.gender === 'other' && (
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            name="gender_other"
                                            id="gender_other"
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            placeholder="Please specify"
                                            value={formState.gender_other}
                                            onChange={e => setFormState(f => ({ ...f, gender_other: e.target.value }))}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Age */}
                            <div className="sm:col-span-3">
                                <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                                    Age
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="number"
                                        name="age"
                                        id="age"
                                        min={16}
                                        max={100}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        value={formState.age}
                                        onChange={e => setFormState(f => ({ ...f, age: parseInt(e.target.value, 10) }))}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Bio */}
                            <div className="sm:col-span-6">
                                <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                                    Bio
                                </label>
                                <div className="mt-1">
                                    <textarea
                                        id="bio"
                                        name="bio"
                                        rows={3}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        placeholder="Share a bit about yourself, your academic interests, or what you're hoping to achieve"
                                        value={formState.bio}
                                        onChange={e => setFormState(f => ({ ...f, bio: e.target.value }))}
                                    />
                                </div>
                                <p className="mt-2 text-sm text-gray-500">
                                    Brief description for your profile.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Student Activities */}
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Student Activities</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            Share societies you're part of and your interests
                        </p>
                    </div>

                    <div className="border-t border-gray-200 px-4 py-5 sm:p-6 space-y-6">
                        {/* Societies */}
                        <div>
                            <label htmlFor="student_societies" className="block text-sm font-medium text-gray-700">
                                Student Societies
                            </label>
                            <p className="mt-1 text-sm text-gray-500">
                                Select any societies, clubs, or groups you're part of at university.
                            </p>
                            <div className="mt-2 space-y-2">
                                <div className="flex">
                                    <select
                                        id="society_select"
                                        className="block w-full rounded-l-md border-r-0 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        value={newSociety}
                                        onChange={e => setNewSociety(e.target.value)}
                                    >
                                        <option value="">Select a society</option>
                                        {COMMON_SOCIETIES.filter(s => !formState.student_societies.includes(s)).map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                        <option value="Other">Other</option>
                                    </select>
                                    <button
                                        type="button"
                                        className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                        onClick={handleAddSociety}
                                    >
                                        Add
                                    </button>
                                </div>
                                {newSociety === 'Other' && (
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            id="society_other"
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            placeholder="Enter society name"
                                            value=""
                                            onChange={e => setNewSociety(e.target.value)}
                                        />
                                    </div>
                                )}
                                <div className="mt-2">
                                    {formState.student_societies.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {formState.student_societies.map(s => (
                                                <span
                                                    key={s}
                                                    className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-0.5 text-sm font-medium text-indigo-800"
                                                >
                                                    {s}
                                                    <button
                                                        type="button"
                                                        className="ml-1.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:bg-indigo-500 focus:text-white focus:outline-none"
                                                        onClick={() => handleRemoveSociety(s)}
                                                    >
                                                        <span className="sr-only">Remove {s}</span>
                                                        <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                                                            <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                                                        </svg>
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm italic text-gray-500">No societies added yet</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Interests */}
                        <div>
                            <label htmlFor="interests" className="block text-sm font-medium text-gray-700">
                                Interests
                            </label>
                            <p className="mt-1 text-sm text-gray-500">
                                Add some of your personal interests to help find like-minded people.
                            </p>
                            <div className="mt-2 space-y-2">
                                <div className="flex">
                                    <select
                                        id="interest_select"
                                        className="block w-full rounded-l-md border-r-0 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        value={newInterest}
                                        onChange={e => setNewInterest(e.target.value)}
                                    >
                                        <option value="">Select an interest</option>
                                        {COMMON_INTERESTS.filter(i => !formState.interests.includes(i)).map(i => (
                                            <option key={i} value={i}>{i}</option>
                                        ))}
                                        <option value="Other">Other</option>
                                    </select>
                                    <button
                                        type="button"
                                        className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                        onClick={handleAddInterest}
                                    >
                                        Add
                                    </button>
                                </div>
                                {newInterest === 'Other' && (
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            id="interest_other"
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            placeholder="Enter interest"
                                            value=""
                                            onChange={e => setNewInterest(e.target.value)}
                                        />
                                    </div>
                                )}
                                <div className="mt-2">
                                    {formState.interests.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {formState.interests.map(i => (
                                                <span
                                                    key={i}
                                                    className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800"
                                                >
                                                    {i}
                                                    <button
                                                        type="button"
                                                        className="ml-1.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-green-400 hover:bg-green-200 hover:text-green-500 focus:bg-green-500 focus:text-white focus:outline-none"
                                                        onClick={() => handleRemoveInterest(i)}
                                                    >
                                                        <span className="sr-only">Remove {i}</span>
                                                        <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                                                            <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                                                        </svg>
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm italic text-gray-500">No interests added yet</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="pt-5">
                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            onClick={() => (window.location.href = '/dashboard')}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Saving...
                                </>
                            ) : (
                                'Save Profile'
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </>
    );
}