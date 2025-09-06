// server/src/models/Project.model.ts

import { Schema, model, Document, Types } from 'mongoose';

export interface IProjectMember {
    userId: Types.ObjectId;
    role: 'owner' | 'admin' | 'member';
}

export interface IProject extends Document {
    name: string;
    description?: string;
    owner: Types.ObjectId;
    members: IProjectMember[];
    tasks: Types.ObjectId[];
}

const ProjectSchema = new Schema<IProject>({
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        role: { type: String, enum: ['owner', 'admin', 'member'], default: 'member' }
    }],
    tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }]
}, { timestamps: true });

export const Project = model<IProject>('Project', ProjectSchema);