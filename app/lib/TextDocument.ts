export default interface TextDocument {
    id: string
    title: string
    paragraphs: Paragraph[]
    highlights: Highlight[]
}

export interface Paragraph {
    id: string
    text: string
}

export interface Highlight {
    id: string
    paragraphId: string
    start: number
    end: number
}