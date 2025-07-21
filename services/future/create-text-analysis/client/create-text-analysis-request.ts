import { gql } from '@apollo/client';

export const CREATE_TEXT_ANALYSIS = gql`
  mutation CreateTextAnalysis($textDocumentId: ID!) {
    createTextAnalysis(textDocumentId: $textDocumentId) {
      id
    }
  }
`;