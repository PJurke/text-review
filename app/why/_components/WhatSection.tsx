export default function WhatSection(): JSX.Element {
    return (
        <section className="relative overflow-hidden bg-white py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-8">
            <div className="relative">
            {/* Background Text */}
            <span className="absolute -left-1/4 -top-1/4 z-0 select-none text-[20rem] font-extrabold text-gray-200 md:left-0">
                What
            </span>

            {/* Content */}
            <div className="relative z-10 mx-auto max-w-4xl text-center">
                <p className="text-2xl font-light leading-relaxed text-gray-700 md:text-3xl">
                Text Review is a web application that helps you analyze, structure, and refine your texts. It offers features for collaborative feedback, highlighting key passages, and organizing your content effectively.
                </p>
            </div>
            </div>
        </div>
        </section>
    );
}