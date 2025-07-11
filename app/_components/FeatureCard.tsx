import Image from "next/image";

export interface FeatureCardData {
    description: string;
    image: {
        alt: string;
        src: string;
    }
    title: string;
}

export default function FeatureCard({ description, image, title }: FeatureCardData): JSX.Element {

    return (
        <article className="flex flex-col items-center max-w-xs">
            <Image alt={image.alt} className="mb-4" height={75} src={image.src} width={75} />
            <div className="mb-1 text-gray-900 text-xl">{title}</div>
            <p className="leading-relaxed text-gray-600">{description}</p>
        </article>
    );
}