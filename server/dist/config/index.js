"use strict";
// server/src/config/index.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MONGO_URI = process.env.MONGO_URI;
const connectDB = async () => {
    if (!MONGO_URI) {
        console.error('FATAL ERROR: MONGO_URI is not defined.');
        process.exit(1);
    }
    try {
        await mongoose_1.default.connect(MONGO_URI);
        console.log('✅ MongoDB connected successfully.');
        mongoose_1.default.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });
    }
    catch (error) {
        console.error('❌ Could not connect to MongoDB:', error);
        process.exit(1); // Exit process with failure
    }
};
exports.connectDB = connectDB;
