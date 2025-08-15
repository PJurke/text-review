import Image from 'next/image';

/*
    GERMAN VERSION
    Evolutionsweise

    Wünsche, Anforderungen und Ziele verändern sich mit der Zeit. Deswegen entwickelt
    sich auch Text Review kontinuierlich weiter.

    Statt auf große, disruptive Änderungen zu warten, glauben wir an die Stärke der kleinen,
    aber kontinuierlichen Schritte. So wird Text Review nicht nur Stück für Stück stabiler,
    sondern passt sich auch organisch an die sich verändernden Bedürfnisse an.

    Dafür brauchen wir Dich. Wir möchten Deine Perspektive kennenlernen und
    Dein Feedback nutzen, um den Weg von Text Review stückweise anzupassen.
    Lass uns Text Review gemeinsam zu dem bestmöglichen Werkzeug für uns machen.
*/

export default function EvolutionaryApproachSection(): JSX.Element {
    return (
        <section className="py-12 md:py-20 bg-gray-50">
            <div className="container mx-auto px-6 md:px-8">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    
                    {/* Textual content */}
                    <div className="order-2 md:order-1">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                            An Evolutionary Approach
                        </h2>
                        <p className="text-lg text-gray-600 mb-6">
                            Wishes, requirements, and goals change over time. That's why Text Review is constantly evolving.
                        </p>
                        <p className="text-lg text-gray-600 mb-6">
                            Instead of waiting for big, disruptive changes,
                            we believe in the power of small but continuous steps.
                            This not only makes Text Review more stable bit by bit,
                            but also allows it to adapt organically to changing needs.
                        </p>
                        <p className="text-lg text-gray-600">
                            That's why we need you. We want to hear your perspective and
                            use your feedback to gradually adapt Text Review.
                            Let's work together to make Text Review the best possible tool for us.
                        </p>
                    </div>

                    {/* Visual representation of the evolutionary approach */}
                    <div className="order-1 md:order-2 flex justify-center">
                        <Image
                            alt="Illustration of the Evolutionary Approach"
                            className="rounded-lg shadow-lg"
                            height={500}
                            src="/evolutionary-approach.svg"
                            width={500}
                        />
                    </div>
                    
                </div>
            </div>
        </section>
    );
}