import { gql } from '@apollo/client';

export const CREATE_TEXT_ANALYSIS = gql`
  mutation CreateTextAnalyis($textDocumentId: ID!) {
    createTextAnalyis(textDocumentId: $textDocumentId) {
      id
    }
  }
`;