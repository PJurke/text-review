import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {}
            },
            authorize: async (credentials) => {
                
                let user: User | null = null;

                // Todo: Add salting and hashing logic
                const hashedPassword = credentials.password;

                // Todo: Check against database
                user = {
                    id: "0",
                    name: "John Doe",
                    email: "john.doe@example.com",
                    image: "https://example.com/johndoe.jpg"
                };

                // Todo: Good error message
                // Todo: Potentially for user registration
                if (!user) {
                    throw new Error("Invalid credentials.")
                }

                return user;

            },
        })
    ]
});