import { gql } from '@apollo/client';

export const ADD_HIGHLIGHT = gql`
  mutation AddHighlight($textDocumentId: ID!, $start: Int!, $end: Int!) {
    addHighlight(textDocumentId: $textDocumentId, start: $start, end: $end) {
      id
      start
      end
      __typename
    }
  }
`;