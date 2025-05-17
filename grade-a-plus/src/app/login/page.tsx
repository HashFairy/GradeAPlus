import { headers } from "next/headers";
import { createClient } from "@/app/utils/supabase/server";
import { redirect } from "next/navigation";
import GoogleSignInButton from "./GoogleSignInButton";


export default async function Login({
                                        searchParams,
                                    }: {
    searchParams: { message: string; next: string };
}) {
    const headersList = headers();
    const supabase = await createClient();

    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (session) {
        // If user is already logged in, redirect to dashboard
        const redirectTo = searchParams.next || "/dashboard";
        return redirect(redirectTo);
    }

    const signIn = async (formData: FormData) => {
        "use server";

        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const supabase = await createClient();

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return redirect("/login?message=Could not authenticate user");
        }

        const redirectTo = formData.get("next") as string;
        return redirect(redirectTo || "/dashboard");
    };

    const signUp = async (formData: FormData) => {
        "use server";

        const origin = (await headersList).get("origin");
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const supabase = await createClient();

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${origin}/auth/callback`,
            },
        });

        if (error) {
            return redirect("/login?message=Could not authenticate user");
        }

        return redirect("/login?message=Check your email to confirm your sign up");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <div className="flex flex-col w-full px-8 max-w-md gap-2">
                <h2 className="text-2xl font-bold text-center mb-6">Sign in to your account</h2>

                <form className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
                    <div>
                        <label className="text-md" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="w-full px-4 py-2 rounded-md border"
                            name="email"
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-md" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="w-full px-4 py-2 rounded-md border"
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {/* Hidden field for next URL */}
                    <input type="hidden" name="next" value={searchParams.next || ''} />

                    <div className="flex flex-col gap-4 mt-4">
                        <button
                            formAction={signIn}
                            className="bg-blue-700 rounded-md px-4 py-2 text-white"
                        >
                            Sign In
                        </button>
                        <button
                            formAction={signUp}
                            className="border border-gray-300 rounded-md px-4 py-2"
                        >
                            Sign Up
                        </button>
                    </div>
                </form>

                {/* Divider */}
                <div className="relative flex items-center justify-center my-4">
                    <div className="border-t border-gray-300 flex-grow"></div>
                    <span className="mx-4 text-gray-500">or</span>
                    <div className="border-t border-gray-300 flex-grow"></div>
                </div>

                {/* Social Login */}
                <div className="w-full">
                    <GoogleSignInButton />
                </div>

                {/* Error message */}
                {searchParams?.message && (
                    <p className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
                        {searchParams.message}
                    </p>
                )}
            </div>
        </div>
    );
}