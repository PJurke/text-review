'use client';

import { ApolloClient, ApolloProvider, NormalizedCacheObject } from "@apollo/client";
import createApolloClient from "./apollo-client";
import { ReactNode } from "react";

let client: ApolloClient<NormalizedCacheObject> | undefined;

function getClient() {

    // Create every time a new client for server-side
    if (typeof window === 'undefined')
      return createApolloClient();

    // Create the client only once on the client
    if (!client)
      client = createApolloClient();

    return client;
    
  }

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <ApolloProvider client={getClient()}>
            {children}
        </ApolloProvider>
    );
}