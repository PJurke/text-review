import clientPromise from "@/app/lib/mongo/mongodb";
import UserEntity from "@/entities/UserEntity";
import logger from "@/lib/logger";
import { DatabaseError } from "@/services/shared/errors/DatabaseError";
import { ValidationError } from "@/services/shared/errors/ValidationError";
import { WrongCredentialsError } from "@/services/shared/errors/WrongCredentialsError";
import { User, UserSchema } from "@/types/User";
import { MongoError } from "mongodb";
import { env } from "process";
import { z } from "zod";
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET

if (!SECRET_KEY)
    throw new Error("JWT_SECRET is not defined. Please check your environment variables.");

interface Credentials extends Pick<User, 'email' | 'password'> {}
const CredentialSchema = z.object({
    email: UserSchema.shape.email,
    password: UserSchema.shape.password
});

export default async function login(credential: Credentials): Promise<string> {

    // 1. Validate arguments

    const validationResult = CredentialSchema.safeParse(credential);
    
    if (!validationResult.success)
        throw new ValidationError('Invalid input', validationResult.error.issues.map(issue => issue.path.join('.')).join(', '));

    try {

        // 1. Establish database connection

        const client = await clientPromise;
        const db = client.db(env.DB_NAME || 'text-review-db');

        // 2. Get all text documents
        
        const user = await db
            .collection<UserEntity>('users')
            .findOne({
                email: credential.email,
                password: credential.password
            });

        if (!user)
            throw new WrongCredentialsError('Email or password are wrong');

        // Create JWT

        const token = jwt.sign({ id: user._id }, SECRET_KEY!, { expiresIn: '1d' });

        // Return token

        return token;

    } catch(error: unknown) {

        if (error instanceof MongoError) {
            logger.error('login-logic.ts: Database error ', error);
            throw new DatabaseError('An internal server error occurred');
        } else if (error instanceof Error) {
            logger.error('login-logic.ts: ', {
                message: error.message,
                stack: error.stack
            });
            throw error;
        } else {
            logger.error('login-logic.ts: Unknown error ', error);
            throw new Error('An unknown error occurred');
        }

    }

}