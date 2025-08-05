import pkg from '@prisma/client';
const { Prisma, TextDocumentType } = pkg;
const prisma = new pkg.PrismaClient()

type TextDocument = pkg.TextDocument;
type DocumentToUpdate = Pick<TextDocument, 'id'>

async function main() {

    console.log(`Start migration: Set “type” and “meta” for existing TextDocuments...`);

    const documentsToUpdate: DocumentToUpdate[] = await prisma.textDocument.findMany({
        where: {
            type: {
                // @ts-ignore-next-line
                exists: false,
            },
        },
        select: {
            id: true,
        },
    });

    if (documentsToUpdate.length === 0) {
        console.log('No documents found to update. Everything is already up to date.');
        return;
    }

    console.log(`Found: ${documentsToUpdate.length} documents to update.`);

    const result: pkg.Prisma.BatchPayload = await prisma.textDocument.updateMany({
        where: {
            id: {
                in: documentsToUpdate.map((doc) => doc.id),
            },
        },
        data: {
            type: TextDocumentType.UNKNOWN,
            meta: null,
        },
    });

    console.log(`Migration successful! ${result.count} documents have been updated.`);

}

main()
    .catch((e) => {
        console.error('Error during migration:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });