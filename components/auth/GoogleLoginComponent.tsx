import { signIn } from "@/lib/auth";

export default function GoogleLoginComponent(): JSX.Element {

    const signInWithGoogle = async () => {
        "use server"
        await signIn("google", { redirectTo: "/user"})
    }

    return (

        <form action={signInWithGoogle} className="flex justify-center select-none">
            <button className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 cursor-pointer font-semibold p-3 rounded-lg text-white w-full" type="submit">
                Log in with Google
            </button>
        </form>

    );
}