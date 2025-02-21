import { GraphQLError, GraphQLResolveInfo } from "graphql";

import logger from "@/lib/logger";
import { DatabaseError } from "../../shared/errors/DatabaseError";
import { User } from "@/types/User";
import login from "../business-logic/login-logic";
import { WrongCredentialsError } from "@/services/shared/errors/WrongCredentialsError";

interface Credentials extends Pick<User, 'email' | 'password'> {}

export default async function listTextDocumentsResolver(_parent: unknown, args: Credentials, context: any, _info: GraphQLResolveInfo): Promise<string> {
    
    try {

        return await login(args);        

    } catch(error) {
        
        if (error instanceof DatabaseError)
            throw new GraphQLError(error.message, { extensions: { code: 'INTERNAL_SERVER_ERROR', details: error.message } });
        else if (error instanceof WrongCredentialsError)
            throw new GraphQLError(error.message, { extensions: { code: 'BAD_USER_INPUT', details: error.message } });
        else {
            logger.error('login-resolver.ts: ', error);
            throw new GraphQLError('An unexpected error occurred', { extensions: { code: 'INTERNAL_SERVER_ERROR' } });
        }
        
    }

}