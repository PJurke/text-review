import { gql } from '@apollo/client';

export const REMOVE_HIGHLIGHT = gql`
  mutation RemoveHighlight($textAnalysisId: ID!, $paragraphId: ID!, $highlightId: ID!) {
    removeHighlight(textAnalysisId: $textAnalysisId, paragraphId: $paragraphId, highlightId: $highlightId) {
      success
      __typename
    }
  }
`;
