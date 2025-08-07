import { auth, signOut } from "@/lib/auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";

import logger from "@/lib/logger";

export const metadata: Metadata = {
    title: 'User'
};

export default async function UserPage(): Promise<JSX.Element> {

    logger.info(`User Page: Page invoked`);

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
                <p className="text-gray-600">
                    {session.user.role.charAt(0).toUpperCase() + session.user.role.slice(1).toLowerCase()}
                </p>
            </div>

            <form action={signout}>
                <button className="hover:bg-red-50 border-2 border-red-600 hover:text-red-800 cursor-pointer font-semibold p-2 rounded text-center text-red-700 transition-colors w-full" type="submit">Sign out</button>
            </form>
        </section>
    );
}