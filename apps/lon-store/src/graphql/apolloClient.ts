import { ApolloClient, InMemoryCache, HttpLink, NormalizedCacheObject } from "@apollo/client";

// Function to create an Apollo Client instance
export const createApolloClient = () =>
  new ApolloClient({
    ssrMode: typeof window === "undefined", // Enable SSR mode for server-side rendering
    link: new HttpLink({
      uri: "http://localhost:4000/graphql", 
      credentials: "same-origin",
    }),
    cache: new InMemoryCache(),
  });

// Singleton Apollo Client for caching in SSR mode
let globalApolloClient: ApolloClient<NormalizedCacheObject> | null = null;

export const getClient = (): ApolloClient<NormalizedCacheObject> => {
  if (!globalApolloClient) {
    globalApolloClient = createApolloClient();
  }
  return globalApolloClient;
};