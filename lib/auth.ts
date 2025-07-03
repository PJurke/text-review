import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";

import { getMongoClient } from "@/app/lib/mongo/mongodb";

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: MongoDBAdapter(getMongoClient()),
    providers: [Google]
});