import Highlight from './Highlight'
import Paragraph from "./Paragraph"

export default interface TextDocument {
    id: string
    title: string
    paragraphs: Paragraph[]
    highlights: Highlight[]
}