'use client';

import { useState } from 'react';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import {
    BellIcon,
    UserCircleIcon,
    ShieldCheckIcon,
    KeyIcon,
    CreditCardIcon,
    Cog8ToothIcon,
    SwatchIcon,
    LanguageIcon,
    MoonIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';

// Types
type SettingsNavItem = {
    id: string;
    name: string;
    icon: React.ElementType;
    current: boolean;
};

type ColorScheme = 'light' | 'dark' | 'system';
type NotificationType = 'all' | 'mentions' | 'none';
type Language = 'en' | 'fr' | 'es' | 'de' | 'zh';

// Settings state interface
interface SettingsState {
    colorScheme: ColorScheme;
    emailNotifications: boolean;
    pushNotifications: boolean;
    notificationType: NotificationType;
    twoFactorEnabled: boolean;
    language: Language;
    autoSave: boolean;
}

export default function Settings() {
    // Settings navigation state
    const [activeSection, setActiveSection] = useState<string>('profile');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

    // Settings state
    const [settings, setSettings] = useState<SettingsState>({
        colorScheme: 'system',
        emailNotifications: true,
        pushNotifications: true,
        notificationType: 'mentions',
        twoFactorEnabled: false,
        language: 'en',
        autoSave: true,
    });

    // User profile state
    const [profile, setProfile] = useState({
        name: 'Alex Johnson',
        email: 'alex.johnson@example.com',
        avatar: '/api/placeholder/400/400',
        role: 'Software Engineer',
    });

    // Navigation items
    const navigationItems: SettingsNavItem[] = [
        { id: 'profile', name: 'Profile', icon: UserCircleIcon, current: activeSection === 'profile' },
        { id: 'appearance', name: 'Appearance', icon: SwatchIcon, current: activeSection === 'appearance' },
        { id: 'notifications', name: 'Notifications', icon: BellIcon, current: activeSection === 'notifications' },
        { id: 'security', name: 'Security', icon: ShieldCheckIcon, current: activeSection === 'security' },
        { id: 'password', name: 'Password', icon: KeyIcon, current: activeSection === 'password' },
        { id: 'billing', name: 'Billing', icon: CreditCardIcon, current: activeSection === 'billing' },
        { id: 'language', name: 'Language', icon: LanguageIcon, current: activeSection === 'language' },
        { id: 'preferences', name: 'Preferences', icon: Cog8ToothIcon, current: activeSection === 'preferences' },
    ];

    // Helper functions
    const setNavSection = (sectionId: string) => {
        setActiveSection(sectionId);
        setIsMobileMenuOpen(false);
    };

    const updateSetting = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
        setSettings({
            ...settings,
            [key]: value,
        });
    };

    // Toggle component
    const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => {
        return (
            <button
                type="button"
                className={`${
                    enabled ? 'bg-indigo-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2`}
                role="switch"
                aria-checked={enabled}
                onClick={onChange}
            >
                <span className="sr-only">Toggle</span>
                <span
                    aria-hidden="true"
                    className={`${
                        enabled ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
            </button>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center">
                            <Link href="/dashboard" className="flex items-center text-gray-900 hover:text-gray-600">
                                <ChevronLeftIcon className="h-5 w-5 mr-1" />
                                <span className="text-sm font-medium">Back to Dashboard</span>
                            </Link>
                        </div>
                        <h1 className="text-lg font-semibold text-gray-900">Account Settings</h1>
                        <div className="flex items-center">
                            <div className="relative ml-3">
                                <div>
                                    <button
                                        type="button"
                                        className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                        id="user-menu-button"
                                    >
                                        <span className="sr-only">Open user menu</span>
                                        <Image
                                            className="h-8 w-8 rounded-full"
                                            src={profile.avatar}
                                            alt=""
                                            width={32}
                                            height={32}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
                    {/* Mobile menu button */}
                    <div className="mb-4 lg:hidden">
                        <button
                            type="button"
                            className="flex w-full items-center justify-between rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <span>{navigationItems.find(item => item.id === activeSection)?.name || 'Settings'}</span>
                            <svg
                                className={`h-5 w-5 text-gray-500 transition-transform ${
                                    isMobileMenuOpen ? 'rotate-180' : ''
                                }`}
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                            </svg>
                        </button>

                        {isMobileMenuOpen && (
                            <div className="mt-2 rounded-md bg-white shadow-lg">
                                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                    {navigationItems.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => setNavSection(item.id)}
                                            className={`block w-full px-4 py-2 text-left text-sm ${
                                                item.current
                                                    ? 'bg-gray-100 text-gray-900'
                                                    : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                            role="menuitem"
                                        >
                                            <div className="flex items-center">
                                                <item.icon
                                                    className={`mr-3 h-5 w-5 ${
                                                        item.current ? 'text-indigo-600' : 'text-gray-400'
                                                    }`}
                                                    aria-hidden="true"
                                                />
                                                {item.name}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar (desktop) */}
                    <aside className="hidden lg:col-span-3 lg:block">
                        <nav className="space-y-1">
                            {navigationItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setNavSection(item.id)}
                                    className={`${
                                        item.current
                                            ? 'bg-gray-50 text-indigo-600'
                                            : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                                    } group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium`}
                                    aria-current={item.current ? 'page' : undefined}
                                >
                                    <item.icon
                                        className={`${
                                            item.current
                                                ? 'text-indigo-600'
                                                : 'text-gray-400 group-hover:text-indigo-600'
                                        } mr-3 h-6 w-6 flex-shrink-0`}
                                        aria-hidden="true"
                                    />
                                    {item.name}
                                </button>
                            ))}
                        </nav>
                    </aside>

                    {/* Main content */}
                    <main className="lg:col-span-9">
                        <div className="bg-white shadow sm:rounded-lg">
                            {/* Profile Section */}
                            {activeSection === 'profile' && (
                                <div className="px-4 py-5 sm:p-6">
                                    <h2 className="text-base font-semibold leading-6 text-gray-900">Profile Information</h2>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Update your personal information and how it appears across the platform.
                                    </p>

                                    <div className="mt-6 flex items-center">
                                        <div className="flex-shrink-0">
                                            <Image
                                                className="h-20 w-20 rounded-full"
                                                src={profile.avatar}
                                                alt=""
                                                width={80}
                                                height={80}
                                            />
                                        </div>
                                        <div className="ml-5">
                                            <button
                                                type="button"
                                                className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                            >
                                                Change avatar
                                            </button>
                                            <button
                                                type="button"
                                                className="ml-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                        <div className="sm:col-span-3">
                                            <label htmlFor="full-name" className="block text-sm font-medium leading-6 text-gray-900">
                                                Full name
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    type="text"
                                                    name="full-name"
                                                    id="full-name"
                                                    defaultValue={profile.name}
                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>

                                        <div className="sm:col-span-3">
                                            <label htmlFor="role" className="block text-sm font-medium leading-6 text-gray-900">
                                                Role
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    type="text"
                                                    name="role"
                                                    id="role"
                                                    defaultValue={profile.role}
                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>

                                        <div className="sm:col-span-4">
                                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                                Email address
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    defaultValue={profile.email}
                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex justify-end gap-x-3">
                                        <button
                                            type="button"
                                            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Appearance Section */}
                            {activeSection === 'appearance' && (
                                <div className="px-4 py-5 sm:p-6">
                                    <h2 className="text-base font-semibold leading-6 text-gray-900">Appearance</h2>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Customize the look and feel of the application interface.
                                    </p>

                                    <div className="mt-6 space-y-6">
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-900">Color scheme</h3>
                                            <div className="mt-2 space-y-4">
                                                {[
                                                    { id: 'light', name: 'Light' },
                                                    { id: 'dark', name: 'Dark' },
                                                    { id: 'system', name: 'System preference' },
                                                ].map((option) => (
                                                    <div key={option.id} className="flex items-center">
                                                        <input
                                                            id={`color-scheme-${option.id}`}
                                                            name="color-scheme"
                                                            type="radio"
                                                            checked={settings.colorScheme === option.id}
                                                            onChange={() =>
                                                                updateSetting('colorScheme', option.id as ColorScheme)
                                                            }
                                                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                        />
                                                        <label
                                                            htmlFor={`color-scheme-${option.id}`}
                                                            className="ml-3 block text-sm font-medium leading-6 text-gray-900"
                                                        >
                                                            {option.name}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="sm:flex sm:items-center sm:justify-between pt-4 border-t border-gray-200">
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-900">Dark mode preview</h3>
                                                <p className="text-sm text-gray-500">Preview the dark mode appearance.</p>
                                            </div>
                                            <div className="mt-2 sm:mt-0">
                                                <div className="bg-gray-800 rounded-md p-4 sm:w-64">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="h-3 w-24 bg-gray-700 rounded"></div>
                                                        <div className="h-3 w-8 bg-indigo-500 rounded"></div>
                                                    </div>
                                                    <div className="h-4 w-full bg-gray-700 rounded mb-3"></div>
                                                    <div className="h-10 w-full bg-gray-700 rounded"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex justify-end gap-x-3">
                                        <button
                                            type="button"
                                            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                        >
                                            Reset to defaults
                                        </button>
                                        <button
                                            type="submit"
                                            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Notifications Section */}
                            {activeSection === 'notifications' && (
                                <div className="px-4 py-5 sm:p-6">
                                    <h2 className="text-base font-semibold leading-6 text-gray-900">Notification Settings</h2>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Manage how you receive notifications from the platform.
                                    </p>

                                    <div className="mt-6 space-y-6">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-900">Email notifications</h3>
                                                <p className="text-sm text-gray-500">Receive notifications via email</p>
                                            </div>
                                            <Toggle
                                                enabled={settings.emailNotifications}
                                                onChange={() =>
                                                    updateSetting('emailNotifications', !settings.emailNotifications)
                                                }
                                            />
                                        </div>

                                        <div className="border-t border-gray-200 pt-6">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="text-sm font-medium text-gray-900">Push notifications</h3>
                                                    <p className="text-sm text-gray-500">Receive push notifications in your browser</p>
                                                </div>
                                                <Toggle
                                                    enabled={settings.pushNotifications}
                                                    onChange={() =>
                                                        updateSetting('pushNotifications', !settings.pushNotifications)
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-200 pt-6">
                                            <h3 className="text-sm font-medium text-gray-900">Notification frequency</h3>
                                            <p className="mt-1 text-sm text-gray-500">Choose when to receive notifications</p>
                                            <div className="mt-4 space-y-4">
                                                {[
                                                    { id: 'all', name: 'All notifications' },
                                                    { id: 'mentions', name: 'Only mentions and direct messages' },
                                                    { id: 'none', name: 'No notifications' },
                                                ].map((option) => (
                                                    <div key={option.id} className="flex items-center">
                                                        <input
                                                            id={`notification-${option.id}`}
                                                            name="notification-type"
                                                            type="radio"
                                                            checked={settings.notificationType === option.id}
                                                            onChange={() =>
                                                                updateSetting('notificationType', option.id as NotificationType)
                                                            }
                                                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                        />
                                                        <label
                                                            htmlFor={`notification-${option.id}`}
                                                            className="ml-3 block text-sm font-medium leading-6 text-gray-900"
                                                        >
                                                            {option.name}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex justify-end gap-x-3">
                                        <button
                                            type="submit"
                                            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        >
                                            Save preferences
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Security Section */}
                            {activeSection === 'security' && (
                                <div className="px-4 py-5 sm:p-6">
                                    <h2 className="text-base font-semibold leading-6 text-gray-900">Security Settings</h2>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Manage your account security and access settings.
                                    </p>

                                    <div className="mt-6 space-y-6">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-900">Two-factor authentication</h3>
                                                <p className="text-sm text-gray-500">
                                                    Add an extra layer of security to your account
                                                </p>
                                            </div>
                                            <Toggle
                                                enabled={settings.twoFactorEnabled}
                                                onChange={() =>
                                                    updateSetting('twoFactorEnabled', !settings.twoFactorEnabled)
                                                }
                                            />
                                        </div>

                                        {settings.twoFactorEnabled && (
                                            <div className="ml-6 mt-2 rounded-md bg-gray-50 p-4">
                                                <div className="flex">
                                                    <div className="flex-shrink-0">
                                                        <svg
                                                            className="h-5 w-5 text-blue-400"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                            aria-hidden="true"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-3 flex-1 md:flex md:justify-between">
                                                        <p className="text-sm text-blue-700">
                                                            Two-factor authentication is now enabled. You'll receive a verification code each time you log in.
                                                        </p>
                                                        <p className="mt-3 text-sm md:ml-6 md:mt-0">
                                                            <a href="#" className="whitespace-nowrap font-medium text-blue-700 hover:text-blue-600">
                                                                Setup &rarr;
                                                            </a>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="border-t border-gray-200 pt-6">
                                            <h3 className="text-sm font-medium text-gray-900">Login sessions</h3>
                                            <p className="mt-1 text-sm text-gray-500">
                                                Manage your active sessions and devices
                                            </p>

                                            <ul role="list" className="mt-4 divide-y divide-gray-100 border-t border-gray-200">
                                                <li className="flex items-center justify-between py-4">
                                                    <div className="flex min-w-0 flex-1 items-center">
                                                        <div className="flex-shrink-0">
                                                            <svg
                                                                className="h-12 w-12 text-gray-400"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={1}
                                                                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                                />
                                                            </svg>
                                                        </div>
                                                        <div className="min-w-0 flex-1 px-4">
                                                            <p className="truncate text-sm font-medium text-gray-900">MacBook Pro</p>
                                                            <p className="mt-1 truncate text-sm text-gray-500">Chrome • New York, USA</p>
                                                            <p className="mt-1 text-xs text-green-500">Current session</p>
                                                        </div>
                                                    </div>
                                                    <div className="ml-4 flex-shrink-0">
                                                        <button className="rounded bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                                            Log out
                                                        </button>
                                                    </div>
                                                </li>

                                                <li className="flex items-center justify-between py-4">
                                                    <div className="flex min-w-0 flex-1 items-center">
                                                        <div className="flex-shrink-0">
                                                            <svg
                                                                className="h-12 w-12 text-gray-400"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={1}
                                                                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                                                                />
                                                            </svg>
                                                        </div>
                                                        <div className="min-w-0 flex-1 px-4">
                                                            <p className="truncate text-sm font-medium text-gray-900">iPhone 12</p>
                                                            <p className="mt-1 truncate text-sm text-gray-500">Safari • Boston, USA</p>
                                                            <p className="mt-1 text-xs text-gray-500">Last active 2 days ago</p>
                                                        </div>
                                                    </div>
                                                    <div className="ml-4 flex-shrink-0">
                                                        <button className="rounded bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                                            Log out
                                                        </button>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="mt-6 border-t border-gray-200 pt-6">
                                        <h3 className="text-base font-semibold leading-6 text-red-600">Danger zone</h3>
                                        <div className="mt-4">
                                            <button
                                                type="button"
                                                className="rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 shadow-sm hover:bg-red-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                                            >
                                                Delete account
                                            </button>
                                        </div>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Once you delete your account, it cannot be recovered.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Language Section */}
                            {activeSection === 'language' && (
                                <div className="px-4 py-5 sm:p-6">
                                    <h2 className="text-base font-semibold leading-6 text-gray-900">Language & Region</h2>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Choose your preferred language and date format.
                                    </p>

                                    <div className="mt-6">
                                        <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                                            Language
                                        </label>
                                        <select
                                            id="language"
                                            name="language"
                                            value={settings.language}
                                            onChange={(e) => updateSetting('language', e.target.value as Language)}
                                            className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                                        >
                                            <option value="en">English</option>
                                            <option value="fr">Français</option>
                                            <option value="es">Español</option>
                                            <option value="de">Deutsch</option>
                                            <option value="zh">中文</option>
                                        </select>
                                    </div>

                                    <div className="mt-6">
                                        <label htmlFor="date-format" className="block text-sm font-medium text-gray-700">
                                            Date format
                                        </label>
                                        <select
                                            id="date-format"
                                            name="date-format"
                                            className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                                        >
                                            <option>MM/DD/YYYY</option>
                                            <option>DD/MM/YYYY</option>
                                            <option>YYYY-MM-DD</option>
                                        </select>
                                    </div>

                                    <div className="mt-6">
                                        <label htmlFor="time-format" className="block text-sm font-medium text-gray-700">
                                            Time format
                                        </label>
                                        <select
                                            id="time-format"
                                            name="time-format"
                                            className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                                        >
                                            <option>12-hour (1:30 PM)</option>
                                            <option>24-hour (13:30)</option>
                                        </select>
                                    </div>

                                    <div className="mt-6 flex justify-end gap-x-3">
                                        <button
                                            type="submit"
                                            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        >
                                            Save preferences
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Preferences Section */}
                            {activeSection === 'preferences' && (
                                <div className="px-4 py-5 sm:p-6">
                                    <h2 className="text-base font-semibold leading-6 text-gray-900">Application Preferences</h2>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Customize general application behavior.
                                    </p>

                                    <div className="mt-6 space-y-6">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-900">Auto-save documents</h3>
                                                <p className="text-sm text-gray-500">Automatically save changes as you work</p>
                                            </div>
                                            <Toggle
                                                enabled={settings.autoSave}
                                                onChange={() =>
                                                    updateSetting('autoSave', !settings.autoSave)
                                                }
                                            />
                                        </div>

                                        <div className="border-t border-gray-200 pt-6">
                                            <h3 className="text-sm font-medium text-gray-900">Default view</h3>
                                            <p className="mt-1 text-sm text-gray-500">Choose your preferred initial view</p>
                                            <div className="mt-4 space-y-4">
                                                {[
                                                    { id: 'list', name: 'List view' },
                                                    { id: 'grid', name: 'Grid view' },
                                                    { id: 'calendar', name: 'Calendar view' },
                                                ].map((option) => (
                                                    <div key={option.id} className="flex items-center">
                                                        <input
                                                            id={`view-${option.id}`}
                                                            name="default-view"
                                                            type="radio"
                                                            defaultChecked={option.id === 'list'}
                                                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                        />
                                                        <label
                                                            htmlFor={`view-${option.id}`}
                                                            className="ml-3 block text-sm font-medium leading-6 text-gray-900"
                                                        >
                                                            {option.name}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex justify-end gap-x-3">
                                        <button
                                            type="button"
                                            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                        >
                                            Reset to defaults
                                        </button>
                                        <button
                                            type="submit"
                                            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Other sections would go here */}
                            {activeSection === 'password' && (
                                <div className="px-4 py-5 sm:p-6">
                                    <h2 className="text-base font-semibold leading-6 text-gray-900">Change Password</h2>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Update your password for enhanced security.
                                    </p>

                                    <div className="mt-6 space-y-4">
                                        <div>
                                            <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                                                Current password
                                            </label>
                                            <div className="mt-1">
                                                <input
                                                    type="password"
                                                    name="current-password"
                                                    id="current-password"
                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                                                New password
                                            </label>
                                            <div className="mt-1">
                                                <input
                                                    type="password"
                                                    name="new-password"
                                                    id="new-password"
                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                                                Confirm new password
                                            </label>
                                            <div className="mt-1">
                                                <input
                                                    type="password"
                                                    name="confirm-password"
                                                    id="confirm-password"
                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex justify-end gap-x-3">
                                        <button
                                            type="button"
                                            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        >
                                            Update password
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeSection === 'billing' && (
                                <div className="px-4 py-5 sm:p-6">
                                    <h2 className="text-base font-semibold leading-6 text-gray-900">Billing & Subscription</h2>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Manage your subscription and payment methods.
                                    </p>

                                    <div className="mt-6">
                                        <div className="rounded-md bg-blue-50 p-4">
                                            <div className="flex">
                                                <div className="flex-shrink-0">
                                                    <svg
                                                        className="h-5 w-5 text-blue-400"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </div>
                                                <div className="ml-3 flex-1">
                                                    <h3 className="text-sm font-medium text-blue-800">Pro Plan - $15/month</h3>
                                                    <div className="mt-2 text-sm text-blue-700">
                                                        <p>Your subscription renews on May 31, 2025.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-6">
                                            <h3 className="text-sm font-medium text-gray-900">Payment method</h3>
                                            <div className="mt-4 flex items-center justify-between border-t border-b border-gray-200 py-4">
                                                <div className="flex items-center">
                                                    <svg
                                                        className="h-8 w-8 text-gray-400"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={1.5}
                                                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                                        />
                                                    </svg>
                                                    <div className="ml-4">
                                                        <p className="text-sm font-medium text-gray-900">Visa ending in 4242</p>
                                                        <p className="text-sm text-gray-500">Expires 12/2024</p>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    className="rounded bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                                >
                                                    Update
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mt-6">
                                            <h3 className="text-sm font-medium text-gray-900">Billing history</h3>
                                            <div className="mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                                                <table className="min-w-full divide-y divide-gray-300">
                                                    <thead className="bg-gray-50">
                                                    <tr>
                                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                            Date
                                                        </th>
                                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                            Amount
                                                        </th>
                                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                            Status
                                                        </th>
                                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                            <span className="sr-only">View</span>
                                                        </th>
                                                    </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-200 bg-white">
                                                    <tr>
                                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6">
                                                            April 21, 2025
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">$15.00</td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                  Paid
                                </span>
                                                        </td>
                                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                            <a href="#" className="text-indigo-600 hover:text-indigo-900">
                                                                View<span className="sr-only">, invoice from April 21, 2025</span>
                                                            </a>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6">
                                                            March 21, 2025
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">$15.00</td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                  Paid
                                </span>
                                                        </td>
                                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                            <a href="#" className="text-indigo-600 hover:text-indigo-900">
                                                                View<span className="sr-only">, invoice from March 21, 2025</span>
                                                            </a>
                                                        </td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 border-t border-gray-200 pt-6">
                                        <div className="flex justify-between">
                                            <button
                                                type="button"
                                                className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
                                            >
                                                Change plan
                                            </button>
                                            <button
                                                type="button"
                                                className="text-sm font-semibold text-gray-700 hover:text-gray-500"
                                            >
                                                Cancel subscription
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}