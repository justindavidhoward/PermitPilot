import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';
import paymentRoutes from './routes/payments';
import webhookRoutes from './routes/webhooks';
import path from 'path';
import { runMigrations } from './migrate';

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT || '3000');

// Run migrations if DATABASE_URL is set
if (process.env.DATABASE_URL) {
  runMigrations().catch(err => {
    console.error('Failed to run migrations:', err);
  });
}

// Middleware
app.use(cors());

// Special middleware for Stripe webhooks to get raw body
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());

// Logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/stripe/webhook', webhookRoutes);

// Serve static files from the React frontend app
const frontendDistPath = '/home/team/shared/frontend/dist';
app.use(express.static(frontendDistPath));

// All other GET requests not handled before will return the React app
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.method !== 'GET') {
    return next();
  }
  if (req.path.startsWith('/api') || req.path.startsWith('/health')) {
    return next();
  }
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`PermitPilot API server listening on http://0.0.0.0:${port}`);
});
