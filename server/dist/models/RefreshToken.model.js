"use strict";
// server/src/models/RefreshToken.model.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshToken = void 0;
const mongoose_1 = require("mongoose");
const uuid_1 = require("uuid");
const RefreshTokenSchema = new mongoose_1.Schema({
    token: { type: String, required: true, unique: true },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    expiresAt: { type: Date, required: true },
});
// Optional: Create a TTL index to automatically delete expired tokens from MongoDB
RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
// Static method to create a refresh token
RefreshTokenSchema.statics.createToken = async function (user) {
    const expires = new Date();
    expires.setDate(expires.getDate() + 7); // 7-day validity
    const token = (0, uuid_1.v4)();
    const refreshToken = new this({
        token: token,
        user: user._id,
        expiresAt: expires
    });
    await refreshToken.save();
    return refreshToken.token;
};
exports.RefreshToken = (0, mongoose_1.model)('RefreshToken', RefreshTokenSchema);
