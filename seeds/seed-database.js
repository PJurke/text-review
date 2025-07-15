import dotenv from 'dotenv';
import fs from 'fs';

import AbschiedsredeAlsBundeskanzlerin from "./text-documents/abschiedsrede-als-bundeskanzlerin.js";
import IchBinEinBerliner from "./text-documents/ich-bin-ein-berliner.js";
import IHaveADream from "./text-documents/i-have-a-dream.js";

const textDocuments = [
    AbschiedsredeAlsBundeskanzlerin,
    IchBinEinBerliner,
    IHaveADream,
];

if (fs.existsSync('.env.local')) {
    dotenv.config({ path: '.env.local' });
    console.log("Loaded environment variables from .env.local");
} else {
    dotenv.config();
    console.log("Loaded environment variables from .env");
}

const { PrismaClient } = await import('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding...');

    // 1. Remove existing data

    console.log('Deleting existing data...');
    await prisma.highlight.deleteMany();
    await prisma.paragraphAnalysis.deleteMany();
    await prisma.textAnalysis.deleteMany();
    await prisma.paragraph.deleteMany();
    await prisma.textDocument.deleteMany();

    // 2. Create text documents

    for (const doc of textDocuments) {
        await prisma.textDocument.create({
            data: {
                title: doc.title,
                author: doc.author,
                paragraphs: {
                    create: doc.paragraphs,
                },
            },
        });
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });