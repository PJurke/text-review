import { NextRequest } from "next/server";
import { ApolloServer } from "@apollo/server";
import { readFileSync } from "fs";
import { resolvers } from "./resolvers";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import path from "path";

let typeDefs: string;

try {
    typeDefs = readFileSync(path.join(process.cwd(), 'app', 'api', 'graphql', 'type-definitions.gql'), "utf8");
    console.log("Schema loaded successfully");
} catch (error) {
    console.error("Error loading schema:", error);
    throw error;
}

const apolloServer = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers
});

const handler = startServerAndCreateNextHandler<NextRequest>(apolloServer, {
    context: async req => ({ req }),
});

export { handler as GET, handler as POST };