"use client";

import { ApolloProvider } from "@apollo/client";
import { useMemo } from "react";
import { createApolloClient } from "./apolloClient";

export default function ApolloClientProvider({ children }: { children: React.ReactNode }) {
  const client = useMemo(() => createApolloClient(), []);
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}