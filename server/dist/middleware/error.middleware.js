"use strict";
// server/src/middleware/error.middleware.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const AppError_1 = require("../utils/AppError");
const http_status_codes_1 = require("http-status-codes");
const errorHandler = (err, req, res, next) => {
    if (err instanceof AppError_1.AppError) {
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }
    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map((el) => el.message);
        const message = `Invalid input data. ${errors.join('. ')}`;
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ status: 'error', message });
    }
    // Handle Mongoose duplicate key errors
    if (err.name === 'MongoServerError' && err.code === 11000) {
        const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
        const message = `Duplicate field value: ${value}. Please use another value.`;
        return res.status(http_status_codes_1.StatusCodes.CONFLICT).json({ status: 'error', message });
    }
    // Log unexpected errors for debugging
    console.error('UNHANDLED ERROR 💥:', err);
    return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Something went very wrong!',
    });
};
exports.errorHandler = errorHandler;
