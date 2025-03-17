import { auth } from "@/lib/auth";
import TopMenuItem from "./TopMenuItem";

export default async function LoginMenuItem() {
    
    const session = await auth();

    if (!session?.user) {
        return (
            <TopMenuItem href="/login">Log in</TopMenuItem>
        );
    }

    return (
        <TopMenuItem href="/user">{ session.user.name || 'Account' }</TopMenuItem>
    );
}