import FeatureCard, { FeatureCardData } from "./FeatureCard";

export default function FeatureSection(): JSX.Element {

    const features: Array<FeatureCardData & { id: string }> = [
        {
            id: "official-texts",
            image: { alt: "Official Documents Icon", src: "/hamburger-icon.svg" },
            title: "Official Texts",
            description: "We get texts from official sources and collect them here."
        },
        {
            id: "highlighting",
            image: { alt: "Text Highlighting Icon", src: "/hamburger-icon.svg" },
            title: "Highlighting",
            description: "Highlight the passages that are important to you."
        },
        {
            id: "commenting",
            image: { alt: "Comments Icon", src: "/hamburger-icon.svg" },
            title: "Commenting",
            description: "Comment on passages in the text to record your thoughts."
        }
    ];

    return (
        <section className="px-4 py-20">
            <h2 className="text-center text-3xl">Features</h2>
            <ul className="flex flex-col md:flex-row gap-8 md:gap-6 lg:gap-8 justify-center mt-12">

                {features.map((feature) => (
                    <li key={feature.id} className="grow">
                        <FeatureCard image={feature.image} title={feature.title} description={feature.description} />
                    </li>
                ))}

            </ul>
        </section>
    );
}