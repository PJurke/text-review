import { auth } from "@/lib/auth";

export default async function LoginMenuItem() {
    
    const session = await auth();

    if (!session?.user) {
        return (
            <a className="block p-3" href="/login">Log in</a>
        );
    }

    return (
        <a className="block p-3" href="/user">{ session.user.name || 'Account' }</a>
    );
}