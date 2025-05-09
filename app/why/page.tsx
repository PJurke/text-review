import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Why'
};

export default function WhyPage(): JSX.Element {
    return (
        <section className="max-w-[50ch] md:max-w-[75ch] mx-auto p-4 text-wrap transition-[max-width]">
            <h1 className="text-3xl">Why</h1>

            <p className="leading-9 mt-8 text-lg">
                I firmly believe that everyone should have direct access to important information
                and the opportunity to understand it in depth - regardless of language barriers.
                This is my contribution to a global and networked knowledge society.
            </p>

            <p className="leading-9 mt-8 text-lg">
                That's why I centralize texts from various official sources in one place for you,
                have them automatically translated into your language and provide you with
                intuitive tools with which you can access the content in a focused and individual way.
            </p>

            <p className="leading-9 mt-8 text-lg">
                With my application, I would like to enable you to gain clarity about a variety of texts,
                to analyze them with focus and in peace, and thus to form your own well-founded opinion.
            </p>
        </section>
    );
}