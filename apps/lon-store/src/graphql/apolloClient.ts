import { ApolloClient, InMemoryCache, HttpLink, NormalizedCacheObject } from "@apollo/client";

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:4000/graphql";

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
            // 进行类型检查并打印错误信息
            if (error instanceof Error) {
              console.error("GraphQL API Unavailable:", error.message);
            } else {
              console.error("GraphQL API Unavailable: Unknown error", error);
            }

            // 返回合法的 Response 对象，防止 Apollo Client 崩溃
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
    // 进行错误类型检查
    if (error instanceof Error) {
      console.error("Failed to initialize Apollo Client:", error.message);
    } else {
      console.error("Failed to initialize Apollo Client: Unknown error", error);
    }

    return new ApolloClient({
      ssrMode: true,
      link: new HttpLink({ uri: "about:blank" }), // 设一个无害的空链接，防止构建崩溃
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