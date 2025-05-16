// app/dashboard/(component)/SignOutButton.tsx
"use client";

import { createClient } from '@/app/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface SignOutButtonProps {
    className?: string;
    scope?: 'global' | 'local' | 'others';
}

export default function SignOutButton({
                                          className = "bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded",
                                          scope = 'global'
                                      }: SignOutButtonProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const supabase = createClient();

    const handleSignOut = async () => {
        try {
            setIsLoading(true);

            // Call the Supabase sign out method with the specified scope
            const { error } = await supabase.auth.signOut({ scope });

            if (error) {
                throw error;
            }

            // Redirect to login page after successful sign out
            router.push('/login');
            router.refresh(); // Refresh the page to ensure auth state is updated

        } catch (error) {
            console.error('Error signing out:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleSignOut}
            disabled={isLoading}
            className={className}
        >
            {isLoading ? 'Signing out...' : 'Sign out'}
        </button>
    );
}