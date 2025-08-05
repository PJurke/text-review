module.exports = {

    /**
     * @param db {import('mongodb').Db}
     * @param client {import('mongodb').MongoClient}
     * @returns {Promise<void>}
     */
    async up(db, client) {

        console.log('Execute migration “up”: Add ‘type’ and “meta” to TextDocuments.');

        const documentsToUpdate = await db.collection('TextDocument').find({
            type: { $exists: false }
        }).project({ _id: 1 }).toArray();

        if (documentsToUpdate.length === 0) {
            console.log('No documents found to update. Everything is already up to date.');
            return;
        }

        const documentIds = documentsToUpdate.map(doc => doc._id);
        console.log(`Found ${documentIds.length} documents to update.`);

        const result = await db.collection('TextDocument').updateMany(
            { _id: { $in: documentIds } },
            {
                $set: {
                    type: 'UNKNOWN', // New type field is unknown by default
                    meta: null       // New meta field is null
                }
            }
        );

        console.log(`Migration successful. ${result.modifiedCount} documents were updated.`);

    },

    /**
     * @param db {import('mongodb').Db}
     * @param client {import('mongodb').MongoClient}
     * @returns {Promise<void>}
     */
    async down(db, client) {

        console.log('Execute migration “down”: Remove ‘type’ and “meta” from UNKNOWN documents.');

        const result = await db.collection('TextDocument').updateMany(
            { type: 'UNKNOWN' },
            {
                $unset: {
                    type: '',
                    meta: ''
                }
            }
        );

        console.log(`${result.modifiedCount} documents were reset.`);

    }

};
