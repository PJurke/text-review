export default interface TextDocument {
    id: string
    title: string
    paragraphs: Paragraph[]
}

export interface Paragraph {
    id: string
    text: string
    highlights: Highlight[]
}

export interface Highlight {
    id: string
    start: number
    end: number
}