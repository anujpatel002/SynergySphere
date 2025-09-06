// /server/src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../utils/asyncHandler';
import { Types } from 'mongoose';

const { JWT_ACCESS_SECRET } = process.env;

export const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError(StatusCodes.UNAUTHORIZED, 'Not authorized, no token provided.'));
    }

    if (!JWT_ACCESS_SECRET) {
        throw new Error('JWT_ACCESS_SECRET is not defined in environment variables.');
    }

    try {
        const decoded = jwt.verify(token, JWT_ACCESS_SECRET as Secret) as { id: string };
        
        // This line is crucial to attach the user ID to the request
        req.user = { id: new Types.ObjectId(decoded.id) };
        
        next();
    } catch (error) {
        return next(new AppError(StatusCodes.UNAUTHORIZED, 'Not authorized, token failed.'));
    }
});