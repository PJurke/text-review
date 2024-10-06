// app/lib/global.d.ts
import type { MongoClient } from 'mongodb';

declare global {
    var _mongoClientPromise: Promise<MongoClient> | undefined;  //eslint-disable-line no-var
}

export { }