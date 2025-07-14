import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { UserRole } from "@/services/users/user-role.model.ts";

declare module "next-auth" {

    interface Session {
        user: {
            id: string
            role: UserRole
        } & DefaultSession["user"]
    }

    interface User {
        role: UserRole;
    } & DefaultSession["user"];

}