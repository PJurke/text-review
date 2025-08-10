

export default function HowSection(): JSX.Element {
    return (
        <section className="relative overflow-hidden bg-gray-50 py-20 md:py-28">
            <div className="container mx-auto px-6 md:px-8">
                <div className="relative">
                {/* Background Text */}
                <span className="absolute -right-1/4 -top-1/4 z-0 select-none text-[20rem] font-extrabold text-gray-300 md:right-0">
                    How
                </span>

                {/* Content */}
                <div className="relative z-10 mx-auto max-w-4xl text-center">
                    <p className="text-2xl font-light leading-relaxed text-gray-700 md:text-3xl">
                    By combining user-centric design with intelligent analysis, we create an intuitive platform. We focus on providing actionable feedback and a seamless review process for individuals and teams.
                    </p>
                </div>
                </div>
            </div>
        </section>
    );
}