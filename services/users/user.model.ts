import { ObjectId } from 'mongodb';
import { z } from 'zod';

export const UserSchema = z.object({
    _id: z.instanceof(ObjectId),
    role: z.enum(['user', 'admin']).optional(),
});

export type User = z.infer<typeof UserSchema>;