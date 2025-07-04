import { signIn } from "@/lib/auth";
import Link from "next/link";

export default function SignInPage(): JSX.Element {

    const signInWithGoogle = async() => {
        'use server';
        await signIn('google', { redirectTo: '/' });
    };

    return (

        <>

            { /* Hero Section */ }
            <section className="bg-gray-50 flex flex-col gap-4 items-center justify-center py-8 text-center text-gray-800">
                <h1 className="font-light text-3xl mb-1">Sign in</h1>
                <p>
                    Sign in with your account
                </p>
            </section>

            <section>
                <p>By signing in, you agree to our</p>
                <Link href="/" className="text-blue-500 hover:underline">Terms of Use</Link>
                <p>and</p>
                <Link href="/" className="text-blue-500 hover:underline">Privacy Policy.</Link>

                <p>Having trouble signing up?</p>
                <Link href="/" className="text-blue-500 hover:underline">Please contact me.</Link>
            </section>

            { /* Signin Section */ }
            <section className="flex h-full items-center justify-center w-full">
                <form action={signInWithGoogle} className="text-center">
                    <button className="cursor-pointer mt-4" type="submit">Sign in with Google</button>
                </form>
            </section>

        </>

    );
}