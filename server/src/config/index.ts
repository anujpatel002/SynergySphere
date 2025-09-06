// server/src/config/index.ts

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

export const connectDB = async () => {
    if (!MONGO_URI) {
        console.error('FATAL ERROR: MONGO_URI is not defined.');
        process.exit(1);
    }
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ MongoDB connected successfully.');

        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

    } catch (error) {
        console.error('❌ Could not connect to MongoDB:', error);
        process.exit(1); // Exit process with failure
    }
};