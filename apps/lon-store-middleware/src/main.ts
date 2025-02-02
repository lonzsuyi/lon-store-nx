import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import cors from 'cors';
import { typeDefs, resolvers } from '../src/schema';

interface MyContext {
  token?: string;
}

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);

  // Apollo Server setup
  const server = new ApolloServer<MyContext>({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    formatError: (error) => {
      console.error('GraphQL Error:', error);
      return {
        message: error.message,
        path: error.path,
        locations: error.locations,
        extensions: error.extensions,
      };
    },
  });

  await server.start();

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({ token: req.headers.token }),
    })
  );

  // Express global error-handling middleware
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Express Error:', err.stack || err.message);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  });

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );

  console.log(`Server ready at http://localhost:4000/graphql`);
}

// Start server and catch any initialization errors
startServer().catch((err) => {
  console.error('Server Startup Error:', err);
});