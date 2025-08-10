/**
 * A dedicated section to explain the "Why" of the Golden Circle.
 * It features a large background text for visual emphasis and uses an inline SVG icon.
 */
export function WhySection(): JSX.Element {
    return (

        <section className="relative overflow-hidden bg-white py-20 md:py-28">
            <div className="container mx-auto px-6 md:px-8">
                <div className="relative">
                {/* Background Text */}
                <span className="absolute -left-1/4 -top-1/4 z-0 select-none text-[20rem] font-extrabold text-gray-200 md:left-0">
                    Why
                </span>

                {/* Content */}
                <div className="relative z-10 mx-auto max-w-4xl text-center">
                    <p className="text-2xl font-light leading-relaxed text-gray-700 md:text-3xl">
                    We believe that clear and well-structured texts are the foundation of successful communication. Our goal is to provide a tool that empowers everyone to express their thoughts with clarity and impact.
                    </p>
                </div>
                </div>
            </div>
        </section>
    );
}
