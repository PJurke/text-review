import { z } from "zod";

export interface User {
    email: string;
    password: string;
}

export const UserSchema = z.object({
    email: z.string().email(),
    password: z.string()
});