import { ApolloClient, InMemoryCache, HttpLink, NormalizedCacheObject } from "@apollo/client";

export const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:4000/graphql";

// Function to create an Apollo Client instance
export const createApolloClient = () => {
  try {
    return new ApolloClient({
      ssrMode: typeof window === "undefined", // Enable SSR mode for server-side rendering
      link: new HttpLink({
        uri: GRAPHQL_ENDPOINT,
        credentials: "same-origin",
        fetch: async (uri, options) => {
          try {
            return await fetch(uri, options);
          } catch (error: unknown) {
            // Type check and log the error
            if (error instanceof Error) {
              console.error("GraphQL API Unavailable:", error.message);
            } else {
              console.error("GraphQL API Unavailable: Unknown error", error);
            }

            // Return a valid Response object to prevent Apollo Client from crashing
            return new Response(
              JSON.stringify({ errors: [{ message: "GraphQL endpoint unavailable, using fallback data." }] }),
              {
                status: 503,
                statusText: "Service Unavailable",
                headers: { "Content-Type": "application/json" },
              }
            );
          }
        },
      }),
      cache: new InMemoryCache(),
    });
  } catch (error: unknown) {
    // Type check and log the error
    if (error instanceof Error) {
      console.error("Failed to initialize Apollo Client:", error.message);
    } else {
      console.error("Failed to initialize Apollo Client: Unknown error", error);
    }

    // Return a fallback Apollo Client instance with a harmless dummy link
    return new ApolloClient({
      ssrMode: true,
      link: new HttpLink({ uri: "about:blank" }), // Use an empty link to avoid build failures
      cache: new InMemoryCache(),
    });
  }
};

// Singleton Apollo Client for caching in SSR mode
let globalApolloClient: ApolloClient<NormalizedCacheObject> | null = null;

export const getClient = (): ApolloClient<NormalizedCacheObject> => {
  if (!globalApolloClient) {
    globalApolloClient = createApolloClient();
  }
  return globalApolloClient;
};