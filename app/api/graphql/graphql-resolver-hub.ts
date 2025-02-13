import { IResolvers } from '@graphql-tools/utils';

import getTextAnalysisResolver from '@/services/get-text-analysis/graphql/get-text-analysis-resolver';
import addHighlightResolver from "@/services/add-highlight/graphql/add-highlight-resolver";
import removeHighlightResolver from "@/services/remove-highlight/graphql/remove-highlight-resolver";

export const resolvers: IResolvers = {
    Query: {
        textAnalysis: getTextAnalysisResolver,
    },
    Mutation: {
        addHighlight: addHighlightResolver,
        removeHighlight: removeHighlightResolver,
    }
}