"use strict";
// server/src/services/token.service.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.generateTokens = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const RefreshToken_model_1 = require("../models/RefreshToken.model");
const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, JWT_ACCESS_EXPIRATION, JWT_REFRESH_EXPIRATION } = process.env;
if (!JWT_ACCESS_SECRET || !JWT_REFRESH_SECRET || !JWT_ACCESS_EXPIRATION || !JWT_REFRESH_EXPIRATION) {
    throw new Error('JWT secret keys or expiration times are not defined in environment variables.');
}
const generateTokens = async (userId) => {
    const accessTokenOptions = {
        // FINAL FIX: Cast to 'any' to satisfy the strict 'StringValue' type.
        expiresIn: JWT_ACCESS_EXPIRATION,
    };
    const accessToken = jsonwebtoken_1.default.sign({ id: userId }, JWT_ACCESS_SECRET, accessTokenOptions);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await RefreshToken_model_1.RefreshToken.deleteMany({ user: userId });
    const refreshTokenOptions = {
        // FINAL FIX: Cast to 'any' to satisfy the strict 'StringValue' type.
        expiresIn: JWT_REFRESH_EXPIRATION,
    };
    const refreshTokenDoc = new RefreshToken_model_1.RefreshToken({
        token: jsonwebtoken_1.default.sign({ id: userId }, JWT_REFRESH_SECRET, refreshTokenOptions),
        user: userId,
        expiresAt,
    });
    await refreshTokenDoc.save();
    return { accessToken, refreshToken: refreshTokenDoc.token };
};
exports.generateTokens = generateTokens;
const verifyRefreshToken = async (token) => {
    const refreshTokenDoc = await RefreshToken_model_1.RefreshToken.findOne({ token }).populate('user');
    if (!refreshTokenDoc || refreshTokenDoc.expiresAt < new Date()) {
        return null;
    }
    try {
        jsonwebtoken_1.default.verify(token, JWT_REFRESH_SECRET);
        return refreshTokenDoc;
    }
    catch (error) {
        return null;
    }
};
exports.verifyRefreshToken = verifyRefreshToken;
