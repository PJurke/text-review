import { env } from 'node:process'
import { MongoClient, MongoClientOptions } from 'mongodb'

if (!env.MONGODB_URI) {
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
        return client
    })
    .catch((error) => {
        console.error('mongodb.ts: Connection error.', error);
        throw error
    })
}

const clientPromise = globalThis._mongoClientPromise

export default clientPromise
