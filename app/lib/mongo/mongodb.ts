import { Db, MongoClient, MongoClientOptions } from 'mongodb'
import logger from '@/lib/logger';

declare global {

    // eslint-disable-next-line no-var
    var _mongoClientInstance: MongoClient | undefined;

    // eslint-disable-next-line no-var
    var _mongoClientConnectPromise: Promise<MongoClient> | undefined;

}

const { MONGODB_URI, MONGODB_DATABASE_NAME } = process.env;

if (!MONGODB_URI) {
    logger.error('MONGODB_URI environment variable is not set');
    throw new Error('Please add the MONGODB_URI variable to your environmental variables.');
}

if (!MONGODB_DATABASE_NAME) {
    logger.error('MONGODB_DATABASE_NAME environment variable is not set');
    throw new Error('Please add the MONGODB_DATABASE_NAME variable to your environmental variables.');
}

const defaultOptions: MongoClientOptions = {
    // Try db connection for 5s only. After that, stop it.
    serverSelectionTimeoutMS: 5000
};

const uri: string = MONGODB_URI;

async function connectToDatabase(): Promise<MongoClient> {

    // If a connected instance already exists, return it
    if (globalThis._mongoClientInstance) {
        logger.debug('Reusing existing MongoDB client instance promise');
        return globalThis._mongoClientInstance;
    }

    // If a connection promise already exists, wait for it
    if (globalThis._mongoClientConnectPromise) {
        logger.debug('Waiting for in-progress MongoDB connection');
        return globalThis._mongoClientConnectPromise;
    }

    // Create and save a new connection promise
    logger.info('Attempting to establish new MongoDB connection...');
    const client = new MongoClient(uri, defaultOptions);

    globalThis._mongoClientConnectPromise = client.connect()
        .then(connectedClient => {
            logger.info('Successfully connected to MongoDB.');
            globalThis._mongoClientInstance = connectedClient; // Save connected instance for later reuse
            return connectedClient;
        })
        .catch(err => {
            logger.error('MongoDB connection failed during connect attempt:', { error: err });
            // Reset Promise so that a new attempt can be started
            globalThis._mongoClientConnectPromise = undefined;
            globalThis._mongoClientInstance = undefined;
            throw err;
        });

    return globalThis._mongoClientConnectPromise;

}

export async function getDb(): Promise<Db> {
    const client = await connectToDatabase();
    return client.db(MONGODB_DATABASE_NAME);
}

// This function exports the Promise that leads to the MongoClient.
// It is the equivalent of the previously exposed "clientPromise".
// The call to connectToDatabase() ensures that the connection (lazy) is initiated.
const clientPromise: Promise<MongoClient> = connectToDatabase();
export default clientPromise;

// Graceful shutdown
const gracefulShutdown = async () => {
    if (globalThis._mongoClientInstance) {
        try {
            await globalThis._mongoClientInstance.close();
            logger.info('MongoDB connection closed gracefully.');
            globalThis._mongoClientInstance = undefined;
            globalThis._mongoClientConnectPromise = undefined;
        } catch (error) {
            logger.error('Error during MongoDB graceful shutdown:', { error });
        }
    }
};

// Graceful shutdown when application is terminated
process.once('SIGINT', gracefulShutdown);
process.once('SIGTERM', gracefulShutdown);