import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'User'
};

export default function WhyPage(): JSX.Element {
    return (
        <section className="max-w-[50ch] md:max-w-[75ch] mx-auto p-4 text-wrap transition-[max-width]">
            <h1 className="text-3xl">User</h1>

            
        </section>
    );
}