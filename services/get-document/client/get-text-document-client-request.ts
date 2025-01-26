import { gql } from '@apollo/client';

export const GET_TEXT_DOCUMENT = gql`
    query getTextDocument($textDocumentId: ID!) {
        textDocument(id: $textDocumentId) {
            id
            title
            author
            highlights {
                id
                paragraphId
                start
                end
            }
            paragraphs {
                id
                text
            }
        }
    }
`