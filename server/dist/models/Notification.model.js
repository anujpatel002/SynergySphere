"use strict";
// server/src/models/Notification.model.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
const mongoose_1 = require("mongoose");
const NotificationSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: ['task_assigned', 'new_message', 'project_invite'], required: true },
    message: { type: String, required: true },
    related: {
        projectId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Project' },
        taskId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Task' },
        messageId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Message' },
    },
    read: { type: Boolean, default: false },
}, { timestamps: true });
exports.Notification = (0, mongoose_1.model)('Notification', NotificationSchema);
