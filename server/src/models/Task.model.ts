// server/src/models/Task.model.ts

import { Schema, model, Document, Types } from 'mongoose';

export type TaskStatus = 'To-Do' | 'In Progress' | 'Done';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface ITask extends Document {
    title: string;
    description?: string;
    projectId: Types.ObjectId;
    assignee?: Types.ObjectId;
    dueDate?: Date;
    status: TaskStatus;
    priority: TaskPriority;
    createdBy: Types.ObjectId;
}

const TaskSchema = new Schema<ITask>({
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    assignee: { type: Schema.Types.ObjectId, ref: 'User' },
    dueDate: { type: Date },
    status: { type: String, enum: ['To-Do', 'In Progress', 'Done'], default: 'To-Do' },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export const Task = model<ITask>('Task', TaskSchema);