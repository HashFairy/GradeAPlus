'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    TransitionChild,
} from '@headlessui/react'
import {
    Bars3Icon,
    BellIcon,
    XMarkIcon,
    Cog6ToothIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: () => (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="size-6 shrink-0">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h2a1 1 0 001-1v-6.5" />
            </svg>
) },
{ name: 'Tasks', href: '/dashboard/tasks', icon: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="size-6 shrink-0">
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
) },
{ name: 'Grades', href: '/dashboard/grade', icon: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="size-6 shrink-0">
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 14l9-5-9-5-9 5 9 5z" />
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
    </svg>
) },
{ name: 'Calendar', href: '/dashboard/calendar', icon: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="size-6 shrink-0">
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
) },
{ name: 'Profile', href: '/dashboard/profile', icon: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="size-6 shrink-0">
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
) },
]

const userNavigation = [
    { name: 'Your profile', href: '/dashboard/profile' },
    { name: 'Settings', href: '/dashboard/settings' },
    { name: 'Sign out', href: '#' },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function DashboardLayout({ children, user }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const pathname = usePathname()

    // Create a version of navigation with current route highlighted
    const navigationWithCurrent = navigation.map(item => ({
        ...item,
        current: pathname === item.href || pathname.startsWith(`${item.href}/`)
    }))

    return (
        <div className="min-h-screen bg-gray-50">
        <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
        <DialogBackdrop
            transition
    className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-closed:opacity-0"
    />

    <div className="fixed inset-0 flex">
        <DialogPanel
            transition
    className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-closed:-translate-x-full"
    >
    <TransitionChild>
        <div className="absolute top-0 left-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-closed:opacity-0">
    <button type="button" onClick={() => setSidebarOpen(false)} className="-m-2.5 p-2.5">
    <span className="sr-only">Close sidebar</span>
    <XMarkIcon aria-hidden="true" className="size-6 text-white" />
        </button>
        </div>
        </TransitionChild>
    {/* Sidebar component for mobile */}
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-indigo-600 px-6 pb-4">
    <div className="flex h-16 shrink-0 items-center">
    <span className="text-white text-xl font-bold">Student Portal</span>
    </div>
    <nav className="flex flex-1 flex-col">
    <ul role="list" className="flex flex-1 flex-col gap-y-7">
    <li>
        <ul role="list" className="-mx-2 space-y-1">
        {navigationWithCurrent.map((item) => (
                <li key={item.name}>
                <Link
                    href={item.href}
            className={classNames(
                    item.current
                    ? 'bg-indigo-700 text-white'
                    : 'text-white hover:bg-indigo-700 hover:text-white',
                'group flex gap-x-3 rounded-md p-2 text-sm font-semibold',
)}
>
    <item.icon />
    {item.name}
    </Link>
    </li>
))}
    </ul>
    </li>
    <li className="mt-auto">
    <Link
        href="/dashboard/settings"
    className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold text-white hover:bg-indigo-700 hover:text-white"
    >
    <Cog6ToothIcon
        aria-hidden="true"
    className="size-6 shrink-0 text-white group-hover:text-white"
        />
        Settings
        </Link>
        </li>
        </ul>
        </nav>
        </div>
        </DialogPanel>
        </div>
        </Dialog>

    {/* Static sidebar for desktop */}
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72">
    <div className="flex grow flex-col bg-indigo-600">
    <div className="flex h-16 shrink-0 items-center justify-center border-b border-indigo-700">
    <span className="text-white text-xl font-bold">Student Portal</span>
    </div>
    <div className="flex flex-grow flex-col overflow-y-auto">
    <nav className="flex-1 px-4 py-4">
    <ul role="list" className="flex flex-1 flex-col gap-y-7">
    <li>
        <ul role="list" className="-mx-2 space-y-1">
        {navigationWithCurrent.map((item) => (
                <li key={item.name}>
                <Link
                    href={item.href}
            className={classNames(
                    item.current
                    ? 'bg-indigo-700 text-white'
                    : 'text-white hover:bg-indigo-700 hover:text-white',
                'group flex gap-x-3 rounded-md p-2 text-sm font-semibold',
)}
>
    <item.icon />
    {item.name}
    </Link>
    </li>
))}
    </ul>
    </li>
    </ul>
    </nav>
    <div className="mt-auto border-t border-indigo-700 p-4">
    <Link
        href="/dashboard/settings"
    className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold text-white hover:bg-indigo-700 hover:text-white"
    >
    <Cog6ToothIcon
        aria-hidden="true"
    className="size-6 shrink-0 text-white group-hover:text-white"
        />
        Settings
        </Link>
        </div>
        </div>
        </div>
        </div>

        <div className="lg:pl-72">
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
    <button type="button" onClick={() => setSidebarOpen(true)} className="-m-2.5 p-2.5 text-gray-700 lg:hidden">
    <span className="sr-only">Open sidebar</span>
    <Bars3Icon aria-hidden="true" className="size-6" />
        </button>

    {/* Separator */}
    <div aria-hidden="true" className="h-6 w-px bg-gray-900/10 lg:hidden" />

    <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
    <form action="#" method="GET" className="flex flex-1 items-center">
    <label htmlFor="search-field" className="sr-only">
        Search
        </label>
        <div className="relative w-full">
    <MagnifyingGlassIcon
        className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
    aria-hidden="true"
    />
    <input
        id="search-field"
    className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
    placeholder="Search..."
    type="search"
    name="search"
        />
        </div>
        </form>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
    <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
    <span className="sr-only">View notifications</span>
    <BellIcon className="h-6 w-6" aria-hidden="true" />
        </button>

    {/* Profile dropdown */}
    <Menu as="div" className="relative">
    <MenuButton className="-m-1.5 flex items-center p-1.5">
    <span className="sr-only">Open user menu</span>
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white">
        {user?.email?.charAt(0).toUpperCase() || 'U'}
    </div>
    <span className="hidden lg:flex lg:items-center">
    <span className="ml-4 text-sm font-semibold leading-6 text-gray-900" aria-hidden="true">
        {user?.email || 'User'}
    </span>
    <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
        </span>
        </MenuButton>
        <MenuItems
    transition
    className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none"
        >
        {userNavigation.map((item) => (
                <MenuItem key={item.name}>
                    {({ active }) => (
        <Link
            href={item.href}
    className={classNames(
            active ? 'bg-gray-50' : '',
        'block px-3 py-1 text-sm leading-6 text-gray-900'
)}
>
    {item.name}
    </Link>
)}
    </MenuItem>
))}
    </MenuItems>
    </Menu>
    </div>
    </div>
    </div>

    <main className="py-10">
    <div className="px-4 sm:px-6 lg:px-8">
        {children}
        </div>
        </main>
        </div>
        </div>
)
}