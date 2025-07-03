import { signIn } from "@/lib/auth";

export default function SignInPage(): JSX.Element {

    const signInWithGoogle = async() => {
        'use server';
        await signIn('google', { redirectTo: '/' });
    };

    return (

        <section className="flex h-full items-center justify-center w-full">
            <form action={signInWithGoogle} className="text-center">
                <h1 className="text-3xl">Sign up</h1>
                <button className="cursor-pointer mt-4" type="submit">Sign in with Google</button>
            </form>
        </section>

    );
}