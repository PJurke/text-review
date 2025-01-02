import { NextRequest, NextResponse } from "next/server";
import { ApolloServer } from "@apollo/server";
import { readFileSync } from "fs";
import { resolvers } from "./graphql-resolver-hub";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import path from "path";
import logger from '@/lib/logger';

let typeDefs: string;

try {
    typeDefs = readFileSync(path.join(process.cwd(), 'app', 'api', 'graphql', 'graphql-schema.gql'), "utf8");
    logger.info("Schema loaded successfully");
} catch (error) {
    logger.error("Error loading schema:", error);
    throw error;
}

const apolloServer = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers
});

const handler = startServerAndCreateNextHandler<NextRequest>(apolloServer, {
    context: async req => ({ req }),
});

const ALLOWED_ORIGINS = [
    'http://192.168.0.12:3000',
    'http://localhost:3000',
]

const getAllowedOrigin = (origin: string | null): string | null => {
    if (origin && ALLOWED_ORIGINS.includes(origin))
        return origin;

    logger.warn(`Blocked origin: ${origin}`);
    return null;
};

const setCORSHeaders = (response: Response, origin: string | null) => {
    if (origin) {
        response.headers.set('Access-Control-Allow-Origin', origin);
        response.headers.set('Access-Control-Allow-Credentials', 'true');
    }
};

export const GET = async (req: NextRequest) => {
    const origin = req.headers.get('origin');
    const allowedOrigin = getAllowedOrigin(origin);

    if (req.method === 'OPTIONS') {
        if (allowedOrigin) {
            return new NextResponse(null, {
                status: 204,
                headers: {
                    'Access-Control-Allow-Origin': allowedOrigin,
                    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                    'Access-Control-Max-Age': '86400', // 24 Stunden
                },
            });
        } else {
            logger.warn("OPTIONS request forbidden for origin:", origin);
            return new NextResponse(null, { status: 403 }); // Forbidden
        }
    }

    try {
        const response = await handler(req);
        setCORSHeaders(response, allowedOrigin);
        return response;
    } catch (error) {
        logger.error("Error processing GET request:", error);
        throw error;
    }
    
};

export const POST = async (req: NextRequest) => {
    const origin = req.headers.get('origin');
    const allowedOrigin = getAllowedOrigin(origin);

    if (req.method === 'OPTIONS') {
        if (allowedOrigin) {
            return new NextResponse(null, {
                status: 204,
                headers: {
                    'Access-Control-Allow-Origin': allowedOrigin,
                    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                    'Access-Control-Max-Age': '86400', // 24 Stunden
                },
            });
        } else {
            logger.warn("OPTIONS request forbidden for origin:", origin);
            return new NextResponse(null, { status: 403 }); // Forbidden
        }
    }

    try {
        const response = await handler(req);
        setCORSHeaders(response, allowedOrigin);
        return response;
    } catch (error) {
        logger.error("Error processing POST request:", error);
        throw error;
    }
    
};