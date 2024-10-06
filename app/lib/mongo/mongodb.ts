// app/lib/mongo/mongodb.ts
import { env } from 'node:process'
import { MongoClient, MongoClientOptions } from 'mongodb'

if (!env.MONGODB_URI) {
    throw new Error('Please add the MONGODB_URI variable to your environmental variables.')
}

const uri: string = env.MONGODB_URI
const options: MongoClientOptions = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!('_mongoClientPromise' in globalThis)) {
        client = new MongoClient(uri, options);
        globalThis._mongoClientPromise = client.connect()
    }
    clientPromise = globalThis._mongoClientPromise as Promise<MongoClient>;
} else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise
