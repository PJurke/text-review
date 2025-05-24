import FeatureCard, { FeatureCardData } from "./FeatureCard";

export default function FeatureSection(): JSX.Element {

    const features: Array<FeatureCardData & { id: string }> = [
        {
            id: "text-hub",
            image: { alt: "Hub for Texts", src: "/centralization-icon.svg" },
            title: "Central Place",
            description: "We collect varied texts in one place."
        },
        {
            id: "official-texts",
            image: { alt: "Official Documents Icon", src: "/official-icon.svg" },
            title: "Official Texts",
            description: "We get texts from official sources and collect them here."
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
        <section className="px-4 py-20">
            <h2 className="text-center text-3xl">Features</h2>
            <ul className="flex flex-col md:flex-row gap-y-16 justify-evenly mt-12">

                {features.map((feature) => (
                    <li key={feature.id}>
                        <FeatureCard image={feature.image} title={feature.title} description={feature.description} />
                    </li>
                ))}

            </ul>
        </section>
    );
}