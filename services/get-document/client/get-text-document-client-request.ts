import { gql } from '@apollo/client';

export const GET_TEXT_DOCUMENT = gql`
    query getTextDocument($id: ID!) {
        textDocument(id: $id) {
            id
            title
            author
            paragraphs {
                id
                text
            }
        }
    }
`