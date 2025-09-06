// server/src/middleware/error.middleware.ts

import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { StatusCodes } from 'http-status-codes';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }

    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
        const errors = Object.values((err as any).errors).map((el: any) => el.message);
        const message = `Invalid input data. ${errors.join('. ')}`;
        return res.status(StatusCodes.BAD_REQUEST).json({ status: 'error', message });
    }

    // Handle Mongoose duplicate key errors
    if (err.name === 'MongoServerError' && (err as any).code === 11000) {
        const value = (err as any).errmsg.match(/(["'])(\\?.)*?\1/)[0];
        const message = `Duplicate field value: ${value}. Please use another value.`;
        return res.status(StatusCodes.CONFLICT).json({ status: 'error', message });
    }
    
    // Log unexpected errors for debugging
    console.error('UNHANDLED ERROR 💥:', err);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Something went very wrong!',
    });
};