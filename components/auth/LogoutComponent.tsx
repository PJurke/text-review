import { signOut } from "@/lib/auth";

export default function LogOut(): JSX.Element {
    return (

        <form action={async () => {
            "use server"
            await signOut({ redirectTo: '/'})
        }}>
            <button className="cursor-pointer" type="submit">Sign Out</button>
        </form>

    );
}