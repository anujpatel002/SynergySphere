"use strict";
// server/src/middleware/auth.middleware.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = require("../utils/AppError");
const asyncHandler_1 = require("../utils/asyncHandler");
const mongoose_1 = require("mongoose");
const { JWT_ACCESS_SECRET } = process.env;
exports.protect = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new AppError_1.AppError(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Not authorized, no token provided.'));
    }
    if (!JWT_ACCESS_SECRET) {
        throw new Error('JWT_ACCESS_SECRET is not defined.');
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_ACCESS_SECRET);
        req.user = { id: new mongoose_1.Types.ObjectId(decoded.id) };
        next();
    }
    catch (error) {
        return next(new AppError_1.AppError(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Not authorized, token failed.'));
    }
});
