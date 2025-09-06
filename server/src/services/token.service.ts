// server/src/services/token.service.ts

import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { Types } from 'mongoose';
import { RefreshToken, IRefreshToken } from '../models/RefreshToken.model';

const {
    JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET,
    JWT_ACCESS_EXPIRATION,
    JWT_REFRESH_EXPIRATION
} = process.env;

if (!JWT_ACCESS_SECRET || !JWT_REFRESH_SECRET || !JWT_ACCESS_EXPIRATION || !JWT_REFRESH_EXPIRATION) {
    throw new Error('JWT secret keys or expiration times are not defined in environment variables.');
}

export const generateTokens = async (userId: Types.ObjectId): Promise<{ accessToken: string; refreshToken: string }> => {
    const accessTokenOptions: SignOptions = {
        // FINAL FIX: Cast to 'any' to satisfy the strict 'StringValue' type.
        expiresIn: JWT_ACCESS_EXPIRATION as any,
    };

    const accessToken = jwt.sign(
        { id: userId },
        JWT_ACCESS_SECRET as Secret,
        accessTokenOptions
    );

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await RefreshToken.deleteMany({ user: userId });
    
    const refreshTokenOptions: SignOptions = {
        // FINAL FIX: Cast to 'any' to satisfy the strict 'StringValue' type.
        expiresIn: JWT_REFRESH_EXPIRATION as any,
    };

    const refreshTokenDoc = new RefreshToken({
        token: jwt.sign(
            { id: userId },
            JWT_REFRESH_SECRET as Secret,
            refreshTokenOptions
        ),
        user: userId,
        expiresAt,
    });
    await refreshTokenDoc.save();

    return { accessToken, refreshToken: refreshTokenDoc.token };
};

export const verifyRefreshToken = async (token: string): Promise<IRefreshToken | null> => {
    const refreshTokenDoc = await RefreshToken.findOne({ token }).populate('user');
    
    if (!refreshTokenDoc || refreshTokenDoc.expiresAt < new Date()) {
        return null;
    }
    
    try {
        jwt.verify(token, JWT_REFRESH_SECRET as Secret);
        return refreshTokenDoc;
    } catch (error) {
        return null;
    }
};