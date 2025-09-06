// server/src/middleware/auth.middleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../utils/asyncHandler';
import { Types } from 'mongoose';
import { Secret } from 'jsonwebtoken';

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
        throw new Error('JWT_ACCESS_SECRET is not defined.');
    }

    try {
        const decoded = jwt.verify(token, JWT_ACCESS_SECRET as Secret) as { id: string };
        
        // FIX: Cast `req` to `any` to forcefully attach the user property.
        // This tells TypeScript to ignore the type error for this specific line.
        (req as any).user = { id: new Types.ObjectId(decoded.id) };
        
        next();
    } catch (error) {
        return next(new AppError(StatusCodes.UNAUTHORIZED, 'Not authorized, token failed.'));
    }
});