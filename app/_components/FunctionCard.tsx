import Image from "next/image";

interface FunctionCardProps {
    image: {
        alt: string;
        src: string;
    }
    title: string;
    description: string;
}

export default function FunctionCard({ image, title, description }: FunctionCardProps): JSX.Element {
    return (
        <div>
            <Image alt={image.alt} height={100} src={image.src} width={100} />
            <div>{title}</div>
            <div>{description}</div>
        </div>
    );
}