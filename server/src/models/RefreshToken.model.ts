// server/src/models/RefreshToken.model.ts

import { Schema, model, Document, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IRefreshToken extends Document {
    token: string;
    user: Types.ObjectId;
    expiresAt: Date;
}

const RefreshTokenSchema = new Schema<IRefreshToken>({
    token: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    expiresAt: { type: Date, required: true },
});

// Optional: Create a TTL index to automatically delete expired tokens from MongoDB
RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Static method to create a refresh token
RefreshTokenSchema.statics.createToken = async function (user: { _id: Types.ObjectId }): Promise<string> {
    const expires = new Date();
    expires.setDate(expires.getDate() + 7); // 7-day validity

    const token = uuidv4();

    const refreshToken = new this({
        token: token,
        user: user._id,
        expiresAt: expires
    });

    await refreshToken.save();
    return refreshToken.token;
};

export const RefreshToken = model<IRefreshToken>('RefreshToken', RefreshTokenSchema);