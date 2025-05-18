import fs from "fs";
import { MongoClient } from "mongodb";
import dotenv from 'dotenv';

import AbschiedsredeAlsBundeskanzlerin from "./text-documents/abschiedsrede-als-bundeskanzlerin.js";
import IchBinEinBerliner from "./text-documents/ich-bin-ein-berliner.js";
import IHaveADream from "./text-documents/i-have-a-dream.js";

import IHaveADreamAnalysis from "./text-analyses/i-have-a-dream-analysis.js";

// Differentiate by environment
if (fs.existsSync('.env.local')) {
    dotenv.config({ path: '.env.local' });
} else {
    dotenv.config();
}

async function seedDatabase() {

    const MONGODB_URI = process.env.MONGODB_URI;
    const MONGODB_DATABASE_NAME = process.env.MONGODB_DATABASE_NAME;

    if (!MONGODB_URI || !MONGODB_DATABASE_NAME) {
        console.error('MONGODB_URI and MONGODB_DATABASE_NAME environment variables is not set');
        return;
    }

    const client = new MongoClient(MONGODB_URI);

    try {
        await client.connect();
        
        const db = client.db(MONGODB_DATABASE_NAME);

        const documentCollection = db.collection("textDocuments");
        const textAnalysesCollection = db.collection("textAnalyses");

        const documentResult = await documentCollection.insertMany([
            AbschiedsredeAlsBundeskanzlerin,
            IHaveADream,
            IchBinEinBerliner
        ]);
        console.info(`${documentResult.insertedCount} documents inserted`);

        const analysisResult = await textAnalysesCollection.insertOne(IHaveADreamAnalysis);
        const analysesInsertedCount = analysisResult.insertedId ? 1 : 0;
        console.info(`${analysesInsertedCount} analyses inserted`);

    }
    catch (error) {
        console.error("Error when inserting documents:", error);
    }
    finally {
        await client.close();
    }
}

seedDatabase();