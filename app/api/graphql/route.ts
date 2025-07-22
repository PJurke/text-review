import path from "path";
import { readFileSync } from "fs";

import { NextRequest, NextResponse } from "next/server";
import { ApolloServer } from "@apollo/server";
import { resolvers } from "./graphql-resolver-hub";
import { startServerAndCreateNextHandler } from "@as-integrations/next";

import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

import logger from '@/lib/logger';

const originsFromEnv = process.env.ALLOWED_ORIGINS || '';
const allowedOriginsPatterns = originsFromEnv.split(',').map(o => o.trim()).filter(Boolean);

// In development mode, a special identifier is added for later regex checking.
if (process.env.NODE_ENV !== 'production') {
    allowedOriginsPatterns.push('DEV_LOCALHOST_REGEX');
    logger.info("Development mode: Allowing all localhost origins via regex.");
}

logger.debug(`Effective allowed origins patterns loaded: ${allowedOriginsPatterns.join(', ')}`);



let typeDefs: string;

/* --- Load schema --- */

try {

    typeDefs = readFileSync(
        path.join(process.cwd(), "app", "api", "graphql", "graphql-schema.gql"), "utf8"
    );
    logger.info("Schema loaded successfully");

    } catch (error) {
    logger.error("Error loading schema:", error);
    throw error;
}

/* --- Create Apollo Server --- */

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
        process.env.NODE_ENV === 'production'
            ? ApolloServerPluginLandingPageDisabled()
            : ApolloServerPluginLandingPageLocalDefault({ embed: true })
    ],
    introspection: process.env.NODE_ENV !== 'production',
});

/* --- Create Next Handler --- */

const handler = startServerAndCreateNextHandler<NextRequest>(apolloServer, {
    context: async (req) => ({ req }),
});

/* --- Helper Functions --- */

/**
 * Checks whether an origin is allowed. Supports exact matches and wildcards (*.example.com).
 * In development mode, localhost is always allowed.
 * @param origin - The origin header of the request.
 * @returns The allowed origin or null.
 */
const getAllowedOrigin = (origin: string | null): string | null => {

    if (!origin)
        return null; // No Origin header present

    for (const pattern of allowedOriginsPatterns) {

        // Special check for development mode
        if (pattern === 'DEV_LOCALHOST_REGEX' && /^http:\/\/localhost(:\d+)?$/.test(origin))
            return origin;

        // Wildcard check
        if (pattern.startsWith('*.')) {
            // If the origin ends with the domain after the wildcard
            if (origin.endsWith(pattern.substring(1))) {
                return origin;
            }
        }

        // Exact match
        if (pattern === origin)
            return origin;

    }

    logger.warn(`Blocked origin: ${origin}`);
    return null;

};

// Sets CORS headers in the response if the origin exists
const setCORSHeaders = (response: Response, origin: string | null) => {
    if (origin) {
        response.headers.set("Access-Control-Allow-Origin", origin);
        response.headers.set("Access-Control-Allow-Credentials", "true");
    }
};

// Handles OPTIONS requests
const handleOptionsRequest = (origin: string | null, allowedOrigin: string | null): NextResponse => {
    if (allowedOrigin) {
        return new NextResponse(null, {
            status: 204,
            headers: {
                "Access-Control-Allow-Origin": allowedOrigin,
                "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
                "Access-Control-Max-Age": "86400", // 24 hours in seconds
            },
        });
    }

    logger.warn("OPTIONS request forbidden for origin:", origin);
    return new NextResponse(null, { status: 403 }); // Forbidden
};

// Common GET and POST request handling
const handleGraphQLRequest = async (req: NextRequest, allowedOrigin: string | null): Promise<Response> => {
    try {
        const response = await handler(req);
        setCORSHeaders(response, allowedOrigin);
        return response;
    } catch (error) {
        logger.error(`Error processing ${req.method} request:`, error);
        throw error;
    }
};

// Main handler for GET and POST requests
const handleGetAndPostRequest = async (req: NextRequest) => {

    if (allowedOriginsPatterns.length === 0 && process.env.NODE_ENV === 'production') {
        logger.error('FATAL: ALLOWED_ORIGINS is not configured at runtime.');
        return new NextResponse(
            JSON.stringify({ message: 'Server configuration incomplete.' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const origin = req.headers.get("origin");
    const allowedOrigin = getAllowedOrigin(origin);
  
    // Process OPTIONS-Preflight
    if (req.method === "OPTIONS")
      return handleOptionsRequest(origin, allowedOrigin);
  
    // React to naked GET requests
    if (req.method === "GET" && process.env.NODE_ENV === 'production') {
        const url = new URL(req.url);

        // Check if GraphQL-specific parameters are missing (e.g. browser vs actual GQL request)
        if (!url.searchParams.has('query') && !url.searchParams.has('operationName')) {
            const errorResponsePayload = {
                errors: [{
                    message: "This is a GraphQL API endpoint. Please use a GraphQL client to interact.",
                    extensions: { code: "BAD_REQUEST" }
                }]
            };
            const response = NextResponse.json(errorResponsePayload, { status: 400 });
            setCORSHeaders(response, allowedOrigin);
            return response;
        }
    }

    // Process GET/POST requests
    return handleGraphQLRequest(req, allowedOrigin);
};

export const GET = handleGetAndPostRequest;
export const POST = handleGetAndPostRequest;