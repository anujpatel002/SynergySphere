// server/src/models/User.model.ts

import { Schema, model, Document, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password?: string; // Optional because it will be removed on toJSON
    avatarUrl?: string;
    projects: Types.ObjectId[];
    comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false }, // `select: false` prevents password from being returned by default
    avatarUrl: { type: String, default: '' },
    projects: [{ type: Schema.Types.ObjectId, ref: 'Project' }]
}, { timestamps: true });

// Pre-save hook to hash the password before saving
UserSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password') || !this.password) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error: any) {
        next(error);
    }
});

// Method to compare candidate password with the stored hash
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from the returned user object
UserSchema.methods.toJSON = function () {
    const userObject = this.toObject();
    delete userObject.password;
    return userObject;
};

export const User = model<IUser>('User', UserSchema);