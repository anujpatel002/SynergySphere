// server/src/server.ts

import express, { Express, Request, Response, NextFunction } from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';

import { connectDB } from './config';
import apiRoutes from './routes';
import { errorHandler } from './middleware/error.middleware';
import { AppError } from './utils/AppError';
import { StatusCodes } from 'http-status-codes';
import { initializeSocketIO } from './socket';
import { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

// Load environment variables
dotenv.config();

// Initialize DB Connection
connectDB();

const app: Express = express();
const server: HttpServer = http.createServer(app);

// --- Middleware ---
// Enable CORS
app.use(cors({ origin: process.env.CORS_ORIGIN }));
// Secure HTTP headers
app.use(helmet());
// Parse JSON bodies
app.use(express.json());
// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));
// Logger for HTTP requests (only in development)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// --- API Routes ---
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({ message: 'SynergySphere API is running!' });
});

app.use('/api', apiRoutes);

// --- Socket.IO Initialization ---
// FIX: Pass the http server instance ('server'), not the socket.io instance.
const io: SocketIOServer = initializeSocketIO(server);

// --- Error Handling ---
// Handle 404 Not Found
app.use((req: Request, res: Response, next: NextFunction) => {
    next(new AppError(StatusCodes.NOT_FOUND, `Route ${req.originalUrl} not found`));
});

// Global error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
    console.log(`🚀 Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});