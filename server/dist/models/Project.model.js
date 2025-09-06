"use strict";
// server/src/models/Project.model.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
const mongoose_1 = require("mongoose");
const ProjectSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    owner: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{
            userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
            role: { type: String, enum: ['owner', 'admin', 'member'], default: 'member' }
        }],
    tasks: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Task' }]
}, { timestamps: true });
exports.Project = (0, mongoose_1.model)('Project', ProjectSchema);
