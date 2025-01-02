import { env } from 'node:process'
import { MongoClient, MongoClientOptions } from 'mongodb'
import logger from '@/lib/logger';

if (!env.MONGODB_URI) {
    logger.error('MONGODB_URI environment variable is not set.');
    throw new Error('Please add the MONGODB_URI variable to your environmental variables.')
}

const uri: string = env.MONGODB_URI
const options: MongoClientOptions = {
    // Try db connection for 5s only. After that, stop it. Functions on Vercel have a limit of 10s.
    serverSelectionTimeoutMS: 5000
}

if (!globalThis._mongoClientPromise) {
    const client = new MongoClient(uri, options);

    globalThis._mongoClientPromise = client.connect()
    .then((client) => {
        logger.info('Successfully connected to MongoDB.');
        return client;
    })
    .catch((error) => {
        logger.error('MongoDB connection error.', { error });
        throw error;
    })
}

const clientPromise = globalThis._mongoClientPromise

export default clientPromise
