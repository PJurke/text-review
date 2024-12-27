import { gql } from '@apollo/client';

export const REMOVE_HIGHLIGHT = gql`
  mutation RemoveHighlight($textDocumentId: ID!, $highlightId: ID!) {
    removeHighlight(textDocumentId: $textDocumentId, highlightId: $highlightId) {
      success
      message
    }
  }
`;
