import { gql } from '@apollo/client';

export const GET_TEXT_ANALYSIS = gql`
    query TextAnalysis($id: ID!) {
        textAnalysis(id: $id) {
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