import { gql } from '@apollo/client';

export const GET_TEXT_DOCUMENT = gql`
    query TextDocument($textDocumentId: ID!) {
        TextDocument(id: $textDocumentId) {
            id
            title
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