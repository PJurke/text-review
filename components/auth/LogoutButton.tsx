import { signOut } from "@/lib/auth";

interface LogoutButtonProps {
    className?: string;
}

export default function LogoutButton({ className }: LogoutButtonProps): JSX.Element {

    const logOut = async () => {
        "use server"
        await signOut({ redirectTo: '/'})
    }

    return (

        <form action={logOut} className={`flex justify-center ${className}`}>
            <button className="cursor-pointer text-red-800" type="submit">Sign Out</button>
        </form>

    );
}