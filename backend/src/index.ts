/**
 * index.ts — Express Application Entry Point
 *
 * This file:
 * 1. Loads environment variables
 * 2. Creates and configures the Express app
 * 3. Sets up middleware (CORS, JSON parsing)
 * 4. Mounts the API routes
 * 5. Starts the HTTP server
 */

import dotenv from 'dotenv';
// Load .env file FIRST before anything else reads process.env
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import applicationRoutes from './routes/applicationRoutes';
import * as controller from './controllers/applicationController';

const app = express();
const PORT = process.env.PORT ?? 5000;

// ─── Middleware ───────────────────────────────────────────────────────────────

// CORS — Allow requests from our frontend only
app.use(cors({
  origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Parse incoming JSON request bodies
app.use(express.json());

// Parse URL-encoded form data (if needed in the future)
app.use(express.urlencoded({ extended: true }));

// ─── Routes ──────────────────────────────────────────────────────────────────

// Health check — useful to verify the server is running
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Internship Tracker API is running',
    timestamp: new Date().toISOString(),
  });
});

// Mount application CRUD routes at /api/applications
app.use('/api/applications', applicationRoutes);

// Also expose /api/stats as a top-level route (more intuitive URL)
app.get('/api/stats', controller.getStats);

// ─── 404 Handler ─────────────────────────────────────────────────────────────

// Catch-all for routes that don't exist
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────

// Express 4 catches errors thrown in route handlers if you call next(error)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`✅ Backend server running at http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/health`);
  console.log(`   API base:     http://localhost:${PORT}/api/applications`);
});

export default app;
