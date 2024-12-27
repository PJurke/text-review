import { gql } from '@apollo/client';

export const ADD_HIGHLIGHT = gql`
  mutation AddHighlight($textDocumentId: ID!, $paragraphId: ID!, $start: Int!, $end: Int!) {
    addHighlight(textDocumentId: $textDocumentId, paragraphId: $paragraphId, start: $start, end: $end) {
      success
      message
      highlight {
        id
        paragraphId
        start
        end
      }
    }
  }
`;
