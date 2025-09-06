// server/src/models/Message.model.ts

import { Schema, model, Document, Types } from 'mongoose';

export interface IMessage extends Document {
    projectId: Types.ObjectId;
    sender: Types.ObjectId;
    text: string;
}

const MessageSchema = new Schema<IMessage>({
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true, trim: true },
}, { timestamps: true });

export const Message = model<IMessage>('Message', MessageSchema);