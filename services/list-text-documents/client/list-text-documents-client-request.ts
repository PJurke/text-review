import { gql } from '@apollo/client';

export const LIST_TEXT_DOCUMENTS = gql`
    query TextDocuments {
        textDocuments {
            id,
            title,
            author
        }
    }
`