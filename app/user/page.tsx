import { auth } from "@/lib/auth";
import LogoutComponent from "@/components/auth/LogoutComponent";

export default async function Page(): Promise<JSX.Element> {

    const session = await auth();

    if (!session) return <></>;
    if (!session?.user) return <></>;

    return (
        <main className="max-w-[50ch] md:max-w-[75ch] mx-auto p-4 text-wrap transition-[max-width]">
            <h1 className="text-3xl">User</h1>
            
            {session.user.image &&
                <img alt="User Avatar" className="rounded-md" src={session.user.image} />
            }
            
            <div>Name: {session.user.name!}</div>
            <div>Email: {session.user.email}</div>

            <LogoutComponent />
        </main>
    );

}