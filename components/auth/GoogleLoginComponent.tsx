import { signIn } from "@/lib/auth";

export default function GoogleLoginComponent(): JSX.Element {
    return (

        <form action={async () => {
            "use server"
            await signIn("google")}}
        >
            <button type="submit">Signin with Google</button>
        </form>

    );
}