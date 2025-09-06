// server/src/models/Notification.model.ts

import { Schema, model, Document, Types } from 'mongoose';

export type NotificationType = 'task_assigned' | 'new_message' | 'project_invite';

export interface INotification extends Document {
    user: Types.ObjectId; // The user who receives the notification
    type: NotificationType;
    message: string;
    related: {
        projectId?: Types.ObjectId;
        taskId?: Types.ObjectId;
        messageId?: Types.ObjectId;
    };
    read: boolean;
}

const NotificationSchema = new Schema<INotification>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: ['task_assigned', 'new_message', 'project_invite'], required: true },
    message: { type: String, required: true },
    related: {
        projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
        taskId: { type: Schema.Types.ObjectId, ref: 'Task' },
        messageId: { type: Schema.Types.ObjectId, ref: 'Message' },
    },
    read: { type: Boolean, default: false },
}, { timestamps: true });

export const Notification = model<INotification>('Notification', NotificationSchema);