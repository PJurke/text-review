import { Metadata } from "next";
import { auth, signIn } from "@/lib/auth";
import { redirect } from "next/navigation";

import logger from "@/lib/logger";

export const metadata: Metadata = {
    title: 'Sign in'
};

function GoogleIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
            <path d="M1 1h22v22H1z" fill="none"></path>
        </svg>
    );
}

export default async function SignInPage(): Promise<JSX.Element> {

    logger.info(`Sign In Page: Page invoked`);

    const session = await auth()

    if (session?.user) redirect('/user');

    const signInWithGoogle = async() => {
        'use server';
        await signIn('google', { redirectTo: '/user' });
    };

    return (

        <section className="max-w-[50ch] md:max-w-[75ch] mx-auto px-4 py-4 w-full">
            <form action={signInWithGoogle}>
                <h1 className="text-3xl mb-4">Sign in</h1>

                <button className="border-2 cursor-pointer flex gap-2 items-center justify-center p-2 rounded text-center w-full" type="submit">
                    <GoogleIcon />
                    <span>Sign in with Google</span>
                </button>
            </form>
        </section>

    );
}