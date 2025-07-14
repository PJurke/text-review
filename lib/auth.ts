import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { getMongoClient } from "@/app/lib/mongo/mongodb";
import type { UserRole } from "@/types/UserRole";

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: MongoDBAdapter(getMongoClient()),
    callbacks: {
        async session({ session, user }) {
            if (session.user) {
                session.user.id = user.id;
                session.user.role = user.role || "User" as UserRole;
            }
            return session;
        }
    },
    providers: [Google],
    session: { strategy: "database" },
});