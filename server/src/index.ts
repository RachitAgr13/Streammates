import 'dotenv/config';
import { createServer } from 'http';
import { createApp } from './app.js';
import { env } from './config/env.js';
import { connectDatabase, disconnectDatabase } from './config/db.js';

async function bootstrap() {
  await connectDatabase();

  const app = createApp();
  const httpServer = createServer(app);

  httpServer.listen(env.PORT, () => {
    console.log(`Server running on http://localhost:${env.PORT}`);
    console.log(`Environment: ${env.NODE_ENV}`);
  });

  const shutdown = async (signal: string) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    httpServer.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

bootstrap().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
