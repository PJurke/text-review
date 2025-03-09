import { Db, MongoClient, MongoClientOptions } from 'mongodb'
import logger from '@/lib/logger';

declare global {
    // eslint-disable-next-line no-var
    var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const { MONGODB_URI, DB_NAME } = process.env;

if (!MONGODB_URI) {
    logger.error('MONGODB_URI environment variable is not set');
    throw new Error('Please add the MONGODB_URI variable to your environmental variables.');
}

if (!DB_NAME) {
    logger.error('DB_NAME environment variable is not set');
    throw new Error('Please add the DB_NAME variable to your environmental variables.');
}

const defaultOptions: MongoClientOptions = {
    // Try db connection for 5s only. After that, stop it. Functions on Vercel have a limit of 10s.
    serverSelectionTimeoutMS: 5000
};

const uri: string = MONGODB_URI;

const connectWithRetry = async (client: MongoClient, retries = 3, delay = 1000): Promise<MongoClient> => {
    try {
        await client.connect();
        logger.info('Successfully connected to MongoDB');
        return client;
    } catch (error) {
        if (retries === 0) {
            logger.error('MongoDB connection failed after multiple attempts: ', { error });
            throw error;
        }
        logger.warn(`MongoDB connection failed. Retrying in ${delay}ms`, { error, retries });
        await new Promise((res) => setTimeout(res, delay));
        return connectWithRetry(client, retries - 1, delay * 2);
    }
};

if (!globalThis._mongoClientPromise) {
    const client = new MongoClient(uri, defaultOptions);
    globalThis._mongoClientPromise = connectWithRetry(client).catch((error) => {
        // In case of an error, reset the global promise
        globalThis._mongoClientPromise = undefined;
        throw error;
    });
}

const clientPromise: Promise<MongoClient> = globalThis._mongoClientPromise;

export async function getDb(): Promise<Db> {
    const client = await clientPromise;
    return client.db(DB_NAME || 'text-review-db');
}

const gracefulShutdown = async () => {
    if (globalThis._mongoClientPromise) {
        try {
            const client = await globalThis._mongoClientPromise;
            await client.close();
            logger.info('MongoDB connection closed gracefully');
        } catch (error) {
            logger.error('Error during MongoDB graceful shutdown: ', { error });
        }
    }
};

// Graceful shutdown when application is terminated
process.once('SIGINT', gracefulShutdown);
process.once('SIGTERM', gracefulShutdown);

export default clientPromise;