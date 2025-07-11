import { auth, signOut } from "@/lib/auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: 'User'
};

export default async function UserPage(): Promise<JSX.Element> {

    const session = await auth();
    const userIcon = session?.user?.image || '/user-icon.svg';

    if (!session?.user) redirect('/signin');

    const signout = async() => {
        'use server';
        await signOut({ redirectTo: '/signin' });
    };

    return (
        <section className="max-w-[50ch] md:max-w-[75ch] mx-auto p-4 text-wrap transition-[max-width]">
            <h1 className="mb-8 text-3xl">User</h1>

            <div className="flex flex-col items-center mb-8">
                <img alt="Your user picture" className="border-2 border-gray-400 p-1 mb-2 rounded-full" height={100} src={userIcon} width={100} />
                <h2 className="text-xl">{session.user.name}</h2>
            </div>

            <form action={signout}>
                <button className="border-2 border-red-600 cursor-pointer p-2 rounded-xl text-center text-red-800 w-full" type="submit">Sign out</button>
            </form>
        </section>
    );
}