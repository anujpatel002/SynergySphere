"use strict";
// server/src/server.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const config_1 = require("./config");
const routes_1 = __importDefault(require("./routes"));
const error_middleware_1 = require("./middleware/error.middleware");
const AppError_1 = require("./utils/AppError");
const http_status_codes_1 = require("http-status-codes");
const socket_1 = require("./socket");
// Load environment variables
dotenv_1.default.config();
// Initialize DB Connection
(0, config_1.connectDB)();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
// --- Middleware ---
// Enable CORS
app.use((0, cors_1.default)({ origin: process.env.CORS_ORIGIN }));
// Secure HTTP headers
app.use((0, helmet_1.default)());
// Parse JSON bodies
app.use(express_1.default.json());
// Parse URL-encoded bodies
app.use(express_1.default.urlencoded({ extended: true }));
// Logger for HTTP requests (only in development)
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
// --- API Routes ---
app.get('/', (req, res) => {
    res.status(200).json({ message: 'SynergySphere API is running!' });
});
app.use('/api', routes_1.default);
// --- Socket.IO Initialization ---
// FIX: Pass the http server instance ('server'), not the socket.io instance.
const io = (0, socket_1.initializeSocketIO)(server);
// --- Error Handling ---
// Handle 404 Not Found
app.use((req, res, next) => {
    next(new AppError_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, `Route ${req.originalUrl} not found`));
});
// Global error handler middleware
app.use(error_middleware_1.errorHandler);
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
    console.log(`🚀 Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
