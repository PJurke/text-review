import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import LogoutButton from "@/components/auth/LogoutButton";

export const metadata: Metadata = {
    title: 'Text Review | User'
}

export default async function Page(): Promise<JSX.Element> {

    const session = await auth();

    if (!session) redirect('/login');
    if (!session?.user) return <></>;

    return (

        <main className="max-w-[50ch] md:max-w-[75ch] mx-auto p-4">
            <h1 className="text-3xl">User</h1>

            { session.user.image &&
                <img alt="My Profile Picture" className="border-8 border-gray-200 mt-10 mx-auto rounded-xl w-40" src={session.user.image} />
            }

            <div aria-label="User Name" className="mt-4 text-center text-2xl">{session.user.name!}</div>

            <div aria-label="Email address" className="text-center text-gray-500">{session.user.email}</div>
            
            <LogoutButton className="mt-4" />
        </main>

    );

}