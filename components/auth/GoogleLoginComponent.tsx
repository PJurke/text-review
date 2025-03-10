import { signIn } from "@/lib/auth";

export default function GoogleLoginComponent(): JSX.Element {

    const signInWithGoogle = async () => {
        "use server"
        await signIn("google", { redirectTo: "/user"})
    }

    return (

        <form action={signInWithGoogle} className="flex justify-center select-none">
            <button className="bg-blue-600 hover:bg-blue-700 cursor-pointer font-bold mt-8 px-4 py-2 rounded text-white w-full max-w-xs" type="submit">
                Sign in with Google
            </button>
        </form>

    );
}