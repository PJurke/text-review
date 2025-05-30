import path from "path";
import { readFileSync } from "fs";

import { NextRequest, NextResponse } from "next/server";
import { ApolloServer } from "@apollo/server";
import { resolvers } from "./graphql-resolver-hub";
import { startServerAndCreateNextHandler } from "@as-integrations/next";

import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

import logger from '@/lib/logger';

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS;

logger.debug('route.ts: Allowed Origins: ' + ALLOWED_ORIGINS);

if (!ALLOWED_ORIGINS) {
    logger.error('ALLOWED_ORIGINS environment variable is not set');
    throw new Error('Please add the ALLOWED_ORIGINS variable to your environmental variables.');
}

const allowedOrigins = new Set(ALLOWED_ORIGINS.split(','));;

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

// Returns the origin if it is allowed, otherwise null
const getAllowedOrigin = (origin: string | null): string | null => {

    if (origin && allowedOrigins.has(origin))
      return origin;

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
    } else {
        logger.warn("OPTIONS request forbidden for origin:", origin);
        return new NextResponse(null, { status: 403 }); // Forbidden
    }
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
    const origin = req.headers.get("origin");
    const allowedOrigin = getAllowedOrigin(origin);
  
    // Process OPTIONS-Preflight
    if (req.method === "OPTIONS")
      return handleOptionsRequest(origin, allowedOrigin);
  
    // React to naked GET requests
    if (req.method === "GET" && process.env.NODE_ENV === 'production') {
        const url = new URL(req.url);

        // If in production, differentiate whether the request is done by browser or an actual GraphQL request
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