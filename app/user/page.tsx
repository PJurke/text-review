import { auth } from "@/lib/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'User'
};

export default async function UserPage(): Promise<JSX.Element> {

    const session = await auth();

    if (!session?.user) return <></>;

    return (
        <section className="max-w-[50ch] md:max-w-[75ch] mx-auto p-4 text-wrap transition-[max-width]">
            <h1 className="mb-4 text-3xl">User</h1>

            <div className="flex flex-col items-center">
                <img className="border-2 border-gray-400 p-1 mb-2 rounded-full" src={session.user.image!} alt="User Avatar" />
                <h2 className="text-xl">{session.user.name}</h2>
            </div>
        </section>
    );
}