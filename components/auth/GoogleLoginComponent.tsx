import { signIn } from "@/lib/auth";

export default function GoogleLoginComponent(): JSX.Element {
    return (

        <form action={async () => {
            "use server"
            await signIn("google", { redirectTo: "/user"})}}
        >
            <button className="cursor-pointer" type="submit">Signin with Google</button>
        </form>

    );
}