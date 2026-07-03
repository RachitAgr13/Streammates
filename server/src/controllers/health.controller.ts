import type { Request, Response } from 'express';
import mongoose from 'mongoose';

export function getHealth(_req: Request, res: Response): void {
  const dbStatus = mongoose.connection.readyState;
  const dbStates: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  res.status(200).json({
    success: true,
    message: 'StreamMates API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: dbStates[dbStatus] ?? 'unknown',
  });
}
