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

// Run database migrations
runMigrations().catch(err => {
  console.error('Failed to run migrations:', err);
});

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
const frontendDistPath = path.join(__dirname, '..', '..', 'frontend', 'dist');
console.log('Frontend static path:', frontendDistPath);
app.use(express.static(frontendDistPath));

// All other GET requests not handled before will return the React app
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.method !== 'GET') {
    return next();
  }
  if (req.path.startsWith('/api') || req.path.startsWith('/health')) {
    return next();
  }
  const indexPath = path.join(frontendDistPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      // Frontend not built yet — serve a basic page
      res.status(200).send(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>PermitPilot</title><style>body{font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f8fafc;color:#1e293b}.card{text-align:center;padding:2rem;max-width:500px}h1{color:#4f46e5;font-size:2rem;margin-bottom:.5rem}p{color:#64748b;line-height:1.6}.badge{display:inline-block;background:#e0e7ff;color:#4338ca;padding:.25rem .75rem;border-radius:9999px;font-size:.875rem;font-weight:600;margin-top:1rem}</style></head><body><div class="card"><h1>🏗️ PermitPilot</h1><p>AI-powered building permit navigation. The API is running.<br>Frontend is being prepared for deployment.</p><div class="badge">✅ API Live</div></div></body></html>`);
    }
  });
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
console.log("PermitPilot v2 - SQLite edition");
