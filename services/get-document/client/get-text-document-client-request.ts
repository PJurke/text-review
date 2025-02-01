import { gql } from '@apollo/client';

export const GET_TEXT_DOCUMENT = gql`
    query getTextDocument($textDocumentId: ID!) {
        textDocument(id: $textDocumentId) {
            id
            title
            author
            paragraphs {
                id
                text
                highlights {
                    id
                    start
                    end
                }
            }
        }
    }
`