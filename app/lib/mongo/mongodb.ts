import { Db, MongoClient, MongoClientOptions } from 'mongodb'
import logger from '@/lib/logger';

// --- Step 1: Load environment variables

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DATABASE_NAME = process.env.MONGODB_DATABASE_NAME;

if (!MONGODB_URI) {
    const errorMessage = 'MONGODB_URI environment variable is not set. Please define it.';
    logger.error(errorMessage);
    throw new Error(errorMessage);
}

if (!MONGODB_DATABASE_NAME) {
    const errorMessage = 'MONGODB_DATABASE_NAME environment variable is not set. Please define it.';
    logger.error(errorMessage);
    throw new Error(errorMessage);
}

// --- Step 2: Global type extension for the caching of the client promise

declare global {

    // eslint-disable-next-line no-var
    var _mongoClientPromise: Promise<MongoClient> | undefined;

    // eslint-disable-next-line no-var
    var _mongoClientInstance: MongoClient | undefined;

}

// --- Step 3: Set options for the MongoDB connection

const defaultOptions: MongoClientOptions = {
    serverSelectionTimeoutMS: 5000      // Timeout after 5 seconds if no server is found
};

// --- Functions

/**
 * Connect to the MongoDB database using a singleton pattern.
 * This ensures that only one connection is created and reused.
 *
 * @returns {Promise<MongoClient>} The connected MongoClient instance.
 */
async function connectToDatabaseSingleton(): Promise<MongoClient> {

    // If a connected instance already exists, return it
    if (global._mongoClientInstance) {
        logger.debug(`Reusing existing resolved MongoDB client instance (NODE_ENV: ${process.env.NODE_ENV}).`);
        return global._mongoClientInstance;
    }

    // If a client promise already exists, return it
    if (global._mongoClientPromise) {
        logger.debug(`Awaiting in-progress MongoDB connection (NODE_ENV: ${process.env.NODE_ENV}).`);
        return global._mongoClientPromise;
    }

    // Establish a new connection - if none exists already
    logger.info(`Establishing new MongoDB connection (NODE_ENV: ${process.env.NODE_ENV})...`);
    const client = new MongoClient(MONGODB_URI!, defaultOptions);

    global._mongoClientPromise = client.connect()
        .then(connectedClient => {
            logger.info('Successfully connected to MongoDB.');
            global._mongoClientInstance = connectedClient;
            return connectedClient;
        })
        .catch(err => {
            logger.error('MongoDB connection failed during connect attempt:', { error: err });
            delete global._mongoClientPromise;
            delete global._mongoClientInstance;
            throw err;
        });

    return global._mongoClientPromise;

}

/**
 * Get the MongoDB client instance.
 * This function will either return an existing instance or create a new one if none exists.
 *
 * @returns {Promise<MongoClient>} The connected MongoClient instance.
 */
export async function getMongoClient(): Promise<MongoClient> {
    return connectToDatabaseSingleton();
}

/**
 * Get the MongoDB database instance.
 * This function will return the database instance for the specified database name.
 *
 * @returns {Promise<Db>} The connected Db instance.
 */
export async function getMongoDb(): Promise<Db> {
    const client = await getMongoClient();
    return client.db(MONGODB_DATABASE_NAME!);
}

/**
 * Gracefully close the MongoDB connection.
 * This function will be called on process termination signals (SIGINT, SIGTERM).
 *
 * @param {string} signal - The termination signal received.
 */
const gracefulShutdown = async (signal: string) => {

    logger.info(`${signal} received, attempting to close MongoDB connection...`);

    if (global._mongoClientInstance) {

        try {
            await global._mongoClientInstance.close();
            logger.info('MongoDB connection closed gracefully.');
        } catch (error) {
            logger.error('Error during MongoDB graceful shutdown (instance existed):', { error });
        } finally {
            delete global._mongoClientInstance;
            delete global._mongoClientPromise;
        }

    } else if (global._mongoClientPromise) {

        logger.debug('Shutdown: Connection was in progress or only promise existed, attempting to await and close.');

        try {
            const clientFromPromise = await global._mongoClientPromise;
            await clientFromPromise.close();
            logger.info('MongoDB connection (awaited during shutdown) closed gracefully.');
        } catch (error) {
            logger.warn('Error closing MongoDB connection that was in progress during shutdown:', { error });
        } finally {
            delete global._mongoClientInstance;
            delete global._mongoClientPromise;
        }

    } else {
        logger.info('No active MongoDB connection or promise to close.');
    }

};

process.once('SIGINT', () => gracefulShutdown('SIGINT'));
process.once('SIGTERM', () => gracefulShutdown('SIGTERM'));