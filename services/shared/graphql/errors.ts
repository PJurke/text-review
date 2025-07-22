import { GraphQLError } from "graphql";

import logger from "@/lib/logger";

import { DatabaseError } from "../errors/DatabaseError";
import { TextDocumentNotFoundError } from "../errors/TextDocumentNotFoundError";
import { ValidationError } from "../errors/ValidationError";
import { HighlightNotFoundError } from "../errors/HighlightNotFoundError";
import { ParagraphNotFoundError } from "../errors/ParagraphNotFoundError";

const errorMap = new Map<any, { code: string}>([
    [DatabaseError, { code: 'INTERNAL_SERVER_ERROR'} ],
    [HighlightNotFoundError, { code: 'HIGHLIGHT_NOT_FOUND'} ],
    [ParagraphNotFoundError, { code: 'PARAGRAPH_NOT_FOUND'} ],
    [TextDocumentNotFoundError, { code: 'TEXT_DOCUMENT_NOT_FOUND'} ],
    [ValidationError, { code: 'BAD_USER_INPUT'} ],
])

export function createApiError(error: any): GraphQLError {
    const errorConfig = errorMap.get(error.constructor);

    if (errorConfig) {
        return new GraphQLError(error.message, {
            extensions: { code: errorConfig.code },
        });
    }

    logger.error({
        message: 'Unhandled API error',
        error: {
            name: error.name,
            message: error.message,
            stack: error.stack
        }
    });

    return new GraphQLError('An unexpected error occurred', {
        extensions: { code: 'INTERNAL_SERVER_ERROR' },
    });
}