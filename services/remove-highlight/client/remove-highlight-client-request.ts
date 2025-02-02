import { gql } from '@apollo/client';

export const REMOVE_HIGHLIGHT = gql`
  mutation RemoveHighlight($textDocumentId: ID!, $paragraphId: ID!, $highlightId: ID!) {
    removeHighlight(textDocumentId: $textDocumentId, paragraphId: $paragraphId, highlightId: $highlightId) {
      success
      __typename
    }
  }
`;
