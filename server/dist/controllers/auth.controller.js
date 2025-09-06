"use strict";
// server/src/controllers/auth.controller.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.logout = exports.refreshToken = exports.login = exports.register = void 0;
const http_status_codes_1 = require("http-status-codes");
const asyncHandler_1 = require("../utils/asyncHandler");
const User_model_1 = require("../models/User.model");
const AppError_1 = require("../utils/AppError");
const token_service_1 = require("../services/token.service");
const RefreshToken_model_1 = require("../models/RefreshToken.model");
exports.register = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { name, email, password } = req.body;
    const userExists = await User_model_1.User.findOne({ email });
    if (userExists) {
        throw new AppError_1.AppError(http_status_codes_1.StatusCodes.CONFLICT, 'User with this email already exists.');
    }
    const user = new User_model_1.User({ name, email, password });
    await user.save();
    // By this point, `user._id` is guaranteed to be a Types.ObjectId
    const { accessToken, refreshToken } = await (0, token_service_1.generateTokens)(user._id);
    res.status(http_status_codes_1.StatusCodes.CREATED).json({
        message: 'User registered successfully.',
        user: user.toJSON(),
        accessToken,
        refreshToken,
    });
});
exports.login = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { email, password } = req.body;
    const user = await User_model_1.User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
        throw new AppError_1.AppError(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Invalid email or password.');
    }
    const { accessToken, refreshToken } = await (0, token_service_1.generateTokens)(user._id);
    res.status(http_status_codes_1.StatusCodes.OK).json({
        message: 'Login successful.',
        user: user.toJSON(),
        accessToken,
        refreshToken,
    });
});
exports.refreshToken = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { token } = req.body;
    if (!token) {
        throw new AppError_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Refresh token is required.');
    }
    const refreshTokenDoc = await (0, token_service_1.verifyRefreshToken)(token);
    if (!refreshTokenDoc) {
        throw new AppError_1.AppError(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Invalid or expired refresh token.');
    }
    // **TYPE GUARD**: Check if user is populated and is an instance of the User model.
    // This is crucial for satisfying TypeScript that refreshTokenDoc.user is not just an ObjectId.
    if (!refreshTokenDoc.user || !(refreshTokenDoc.user instanceof User_model_1.User)) {
        throw new AppError_1.AppError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'User could not be verified from token.');
    }
    // Now, TypeScript knows refreshTokenDoc.user is a full IUser document
    const user = refreshTokenDoc.user;
    const { accessToken, refreshToken: newRefreshToken } = await (0, token_service_1.generateTokens)(user._id);
    res.status(http_status_codes_1.StatusCodes.OK).json({ accessToken, refreshToken: newRefreshToken });
});
exports.logout = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { token } = req.body;
    if (token) {
        await RefreshToken_model_1.RefreshToken.deleteOne({ token: token });
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({ message: 'Logged out successfully.' });
});
exports.getMe = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    // req.user is attached by the `protect` middleware
    const user = await User_model_1.User.findById(req.user?.id);
    if (!user) {
        throw new AppError_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found.');
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({ user });
});
