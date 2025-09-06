// /server/src/server.ts
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

dotenv.config();
connectDB();

const app: Express = express();
const server: HttpServer = http.createServer(app);

// --- Middleware ---
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// --- API Routes ---
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({ message: 'SynergySphere API is running!' });
});
app.use('/api', apiRoutes);

// --- Socket.IO Initialization ---
const io: SocketIOServer = initializeSocketIO(server);

// --- Error Handling ---
app.use((req: Request, res: Response, next: NextFunction) => {
    next(new AppError(StatusCodes.NOT_FOUND, `Route ${req.originalUrl} not found`));
});
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
    console.log(`🚀 Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});