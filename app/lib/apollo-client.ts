import { ApolloClient, InMemoryCache } from "@apollo/client";

const createApolloClient = () => {

    if (!process.env.GRAPHQL_ENDPOINT)
        throw new Error("Please add the GRAPHQL_ENDPOINT variable to your environmental variables.");

    return new ApolloClient({
        uri: process.env.GRAPHQL_ENDPOINT,
        cache: new InMemoryCache()
    });
    
};

export default createApolloClient;