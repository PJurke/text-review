import FeatureCard, { FeatureCardData } from "./FeatureCard";

export default function FeatureSection(): JSX.Element {

    const features: Array<FeatureCardData & { id: string }> = [
        {
            id: "text-hub",
            image: { alt: "Hub for Texts", src: "/centralization-icon.svg" },
            title: "Central Place",
            description: "I collect various texts in this place."
        },
        {
            id: "official-texts",
            image: { alt: "Official Documents Icon", src: "/official-icon.svg" },
            title: "Official Texts",
            description: "The texts are from official sources."
        },
        /*{
            id: "highlighting",
            image: { alt: "Text Highlighting Icon", src: "/highlighting-icon.svg" },
            title: "Highlighting",
            description: "Highlight the passages that are important to you."
        },
        {
            id: "commenting",
            image: { alt: "Comments Icon", src: "/commenting-icon.svg" },
            title: "Commenting",
            description: "Comment on passages in the text to record your thoughts."
        }*/
    ];

    return (
        <section className="px-4 py-16">
            <h2 className="mb-8 text-center text-3xl">Features</h2>
            <ul className="flex flex-col md:flex-row items-center md:items-start gap-8 gap-x-16 justify-center">

                {features.map((feature) => (
                    <li key={feature.id}>
                        <FeatureCard image={feature.image} title={feature.title} description={feature.description} />
                    </li>
                ))}

            </ul>
        </section>
    );
}