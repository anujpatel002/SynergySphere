// /server/src/controllers/auth.controller.ts

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { asyncHandler } from '../utils/asyncHandler';
import { User } from '../models/User.model';
import { AppError } from '../utils/AppError';
import { generateTokens, verifyRefreshToken } from '../services/token.service';
import { RefreshToken } from '../models/RefreshToken.model';

export const register = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
        throw new AppError(StatusCodes.CONFLICT, 'User with this email already exists.');
    }

    const user = new User({ name, email, password });
    await user.save();
    
    const { accessToken, refreshToken } = await generateTokens(user._id);

    res.status(StatusCodes.CREATED).json({
        message: 'User registered successfully.',
        user: user.toJSON(),
        accessToken,
        refreshToken,
    });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'Invalid email or password.');
    }

    const { accessToken, refreshToken } = await generateTokens(user._id);
    
    res.status(StatusCodes.OK).json({
        message: 'Login successful.',
        user: user.toJSON(),
        accessToken,
        refreshToken,
    });
});

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const { token } = req.body;
    if (!token) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'Refresh token is required.');
    }

    const refreshTokenDoc = await verifyRefreshToken(token);
    if (!refreshTokenDoc) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'Invalid or expired refresh token.');
    }

    if (!refreshTokenDoc.user || !(refreshTokenDoc.user instanceof User)) {
         throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'User could not be verified from token.');
    }

    const user = refreshTokenDoc.user;
    const { accessToken, refreshToken: newRefreshToken } = await generateTokens(user._id);

    res.status(StatusCodes.OK).json({ accessToken, refreshToken: newRefreshToken });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
    const { token } = req.body;
    if (token) {
        await RefreshToken.deleteOne({ token: token });
    }
    res.status(StatusCodes.OK).json({ message: 'Logged out successfully.' });
});

// This function now correctly uses the augmented Request type
export const getMe = asyncHandler(async (req: Request, res: Response) => {
    // req.user is attached by the `protect` middleware
    const user = await User.findById(req.user?.id);
    if (!user) {
        throw new AppError(StatusCodes.NOT_FOUND, 'User not found.');
    }
    res.status(StatusCodes.OK).json({ user });
});