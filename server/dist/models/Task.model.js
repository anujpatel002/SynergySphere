"use strict";
// server/src/models/Task.model.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
const mongoose_1 = require("mongoose");
const TaskSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    projectId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    assignee: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    dueDate: { type: Date },
    status: { type: String, enum: ['To-Do', 'In Progress', 'Done'], default: 'To-Do' },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });
exports.Task = (0, mongoose_1.model)('Task', TaskSchema);
