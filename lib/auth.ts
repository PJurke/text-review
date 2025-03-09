// Import node modules
import { env } from "process";

// Import 3rd party modules
import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import Google from "next-auth/providers/google";

// Import custom modules
import clientPromise from "@/app/lib/mongo/mongodb";

// Get the local MongoDB Client

const client = await clientPromise;

// Set up auth: Google
// Store it in local database

export const { handlers, signIn, signOut, auth } = NextAuth({

    adapter: MongoDBAdapter(client, { databaseName: env.DB_NAME || 'text-review-db' }),
    providers: [Google]

});