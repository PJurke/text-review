import { getDocument } from "@/app/lib/data/document-dto";

export const resolvers = {
    Query: {
        TextDocument: async (_: any, args: any) => {

            const { id } = args
            return getDocument(id);

        }
    }
}