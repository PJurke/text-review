import { z } from 'zod';
import "@/lib/zod/extensions"

export const UserSchema = z.object({
    _id: z.string().oid(),
    role: z.enum(['user', 'admin']).optional(),
});

export type User = z.infer<typeof UserSchema>;