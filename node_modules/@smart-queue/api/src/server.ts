import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import kioskRoutes from './routes/kiosk.routes.js';
import queueRoutes from './routes/queue.routes.js';
import adminRoutes from './routes/admin.routes.js';
import departmentRoutes from './routes/department.routes.js';
import triageRoutes from './routes/triage.routes.js';
import kioskFleetRoutes from './routes/kiosk-fleet.routes.js';
import { errorHandler } from './middleware/error.middleware.js';
import { QueueSocketHandler } from './sockets/queue.socket.js';
import { logger } from './utils/logger.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

const corsOrigin = process.env.CORS_ORIGIN || '*';

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { success: false, error: 'Too many requests, please try again later.' }
});
app.use(limiter);

// Socket.io initialization
const io = new Server(server, {
  cors: {
    origin: corsOrigin,
    methods: ['GET', 'POST']
  }
});
export const socketHandler = new QueueSocketHandler(io);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/kiosk', kioskRoutes);
app.use('/api/queue', queueRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/triage', triageRoutes);
app.use('/api/kiosks', kioskFleetRoutes);

// Error Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    logger.info(`🏥 Smart Queue API Server running on port ${PORT}`);
  });
}

export { app, server };
