import { auth } from "@/lib/auth";

export default async function LoginButton() {
    
    const session = await auth();

    if (!session?.user) {
        return (
            <a className="block p-3 hover:bg-gray-100" href="/login">Log in</a>
        );
    }

    return (
        <a className="block p-3 hover:bg-gray-100" href="/user">{ session.user.name || 'Account' }</a>
    );
}