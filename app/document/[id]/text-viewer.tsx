'use client'

interface TextViewerProps {
    paragraphs: string[]
}

export default function TextViewer({ paragraphs }: TextViewerProps) {
    return (
        <div className="font-normal leading-relaxed md:leading-9 mt-6 md:text-xl">
            {paragraphs.map((paragraph, index) => (
                // To do: Don't use index as key
                <p className="mt-10" key={index}>{paragraph}</p>
            ))}
        </div>
    )
}