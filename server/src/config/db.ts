import dns from 'dns';
import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDatabase(): Promise<void> {
  // Some routers/ISPs block or mishandle SRV lookups that mongodb+srv requires.
  // Public DNS resolvers fix querySrv ECONNREFUSED on Windows home networks.
  if (env.MONGODB_URI.startsWith('mongodb+srv://')) {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  }

  try {
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log('MongoDB connected');
  } catch (error) {
    if (env.NODE_ENV === 'development') {
      console.warn('MongoDB connection failed — server starting without database.');
      console.warn('Set MONGODB_URI in server/.env or start a local MongoDB instance.');
      console.warn('Error:', error instanceof Error ? error.message : error);
      return;
    }
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected');
  });
}

export async function disconnectDatabase(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}
