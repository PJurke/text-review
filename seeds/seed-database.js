import fs from "fs";
import { MongoClient } from "mongodb";
import dotenv from 'dotenv';

import AbschiedsredeAlsBundeskanzlerin from "./text-documents/abschiedsrede-als-bundeskanzlerin.js";
import IchBinEinBerliner from "./text-documents/ich-bin-ein-berliner.js";
import IHaveADream from "./text-documents/i-have-a-dream.js";

// Differentiate by environment
if (fs.existsSync('.env.local')) {
    dotenv.config({ path: '.env.local' });
} else {
    dotenv.config();
}

async function seedDatabase() {

    const { MONGODB_URI, DB_NAME } = process.env;

    if (!MONGODB_URI || !DB_NAME) {
        console.error('MONGODB_URI and DB_NAME environment variables is not set');
        return;
    }

    const client = new MongoClient(MONGODB_URI);

    try {
        await client.connect();
        const db = client.db(DB_NAME);
        const collection = db.collection("textDocuments");
        const allDocuments = [AbschiedsredeAlsBundeskanzlerin, IHaveADream, IchBinEinBerliner];
        const result = await collection.insertMany(allDocuments);
        
        console.info(`${result.insertedCount} documents inserted`);
    }
    catch (error) {
        console.error("Error when inserting documents:", error);
    }
    finally {
        await client.close();
    }
}

seedDatabase();