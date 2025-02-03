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

/**
 * Initializes and starts an Express + Apollo Server.
 * @param port The server port (default: 4000).
 * @returns Promise<http.Server> Resolves with the running HTTP server.
 */
export async function startServer(port = 4000): Promise<http.Server> {
  const app = express();
  const httpServer = http.createServer(app);

  // Initialize Apollo Server with schema and resolvers
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

  app.get('/health', (req, res) => {
    res.status(200).send('OK');  // Health check response
  });  

  // Apply Express middleware for GraphQL
  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({ token: req.headers.token }),
    })
  );

  // Global Express error-handling middleware
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Express Error:', err.stack || err.message);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  });

  // Start HTTP server and return the instance
  return new Promise<http.Server>((resolve) => {
    httpServer.listen(port, () => {
      console.log(`Server ready at http://localhost:${port}/graphql`);
      resolve(httpServer);
    });
  });
}

/**
 * Starts the server only in standalone mode.
 * Ensures that `startServer()` is only executed when running the file directly,
 * and not when imported in a test environment.
 */
if (require.main === module) {
  startServer().catch((err) => {
    console.error('Server Startup Error:', err);
  });
}