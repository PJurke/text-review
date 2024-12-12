import TextDocument from "../../lib/TextDocument"

export const resolvers = {
    Query: {
        TextDocument: () => {
            const doc: TextDocument = {
                id: 'abc',
                title: 'test doc',
                paragraphs: [
                    { id: '1', text: 'Hello' }
                ],
                highlights: [
                    { id: 'a', paragraphId: '1', start: 1, end: 3 }
                ]
            }
            return doc;
        }
    }
}