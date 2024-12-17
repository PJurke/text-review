import { ApolloClient, InMemoryCache } from "@apollo/client";
import { env } from "process";

const createApolloClient = () => {

    if (!env.GRAPHQL_ENDPOINT)
        throw new Error("Please add the GRAPHQL_ENDPOINT variable to your environmental variables.");

    return new ApolloClient({
        uri: env.GRAPHQL_ENDPOINT,
        cache: new InMemoryCache()
    });
    
};

export default createApolloClient;