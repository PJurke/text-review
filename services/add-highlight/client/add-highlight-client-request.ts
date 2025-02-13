import { gql } from '@apollo/client';

export const ADD_HIGHLIGHT = gql`
  mutation AddHighlight($textAnalysisId: ID!, $paragraphId: ID!, $start: Int!, $end: Int!) {
    addHighlight(textAnalysisId: $textAnalysisId, paragraphId: $paragraphId, start: $start, end: $end) {
      id
      start
      end
      __typename
    }
  }
`;