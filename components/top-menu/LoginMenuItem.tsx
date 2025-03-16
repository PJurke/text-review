import Link from "next/link";
import { auth } from "@/lib/auth";

export default async function LoginMenuItem() {
    
    const session = await auth();

    if (!session?.user) {
        return (
            <Link className="block p-3" href="/login">Log in</Link>
        );
    }

    return (
        <Link className="block p-3" href="/user">{ session.user.name || 'Account' }</Link>
    );
}