import { ApolloClient, InMemoryCache } from "@apollo/client";

const createApolloClient = () => {

    if (!process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT)
        throw new Error("Please add the NEXT_PUBLIC_GRAPHQL_ENDPOINT variable to your environmental variables.");

    return new ApolloClient({
        uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
        cache: new InMemoryCache()
    });
    
};

export default createApolloClient;