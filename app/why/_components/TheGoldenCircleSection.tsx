import Image from "next/image";

export default function TheGoldenCircleSection(): JSX.Element {
    return (
        <section className="py-12 md:py-20 bg-white">
            <div className="container mx-auto px-6 md:px-8">
                <div className="grid md:grid-cols-2 gap-12 items-center">

                    {/* Visuelle Darstellung des "Golden Circle" Konzepts */}
                    <div className="flex justify-center order-1 md:order-1">
                        <Image
                            alt="The Golden Circle"
                            className="rounded-lg shadow-lg"
                            height={500}
                            src="/why-circle.svg"
                            width={500} />
                    </div>

                    {/* Textlicher Inhalt */}
                    <div className="order-2 md:order-2">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                            The Why
                        </h2>

                        <p className="leading-relaxed mb-8 text-lg">
                            I believe that everyone should have direct access to important information
                            and the opportunity to understand it in depth - regardless of language barriers.
                        </p>

                        <p className="leading-relaxed mb-8 text-lg">
                            That&apos;s why I centralize texts from various official sources in one place for you,
                            have them automatically translated into your language and provide you with
                            intuitive tools with which you can access the content in a focused and individual way.
                        </p>

                        <p className="leading-relaxed mb-8 text-lg">
                            With my application, I would like to enable you to gain clarity about a variety of texts,
                            to analyze them with focus and in peace, and thus to form your own well-founded opinion.
                            This is my contribution to a global and networked knowledge society.
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
}