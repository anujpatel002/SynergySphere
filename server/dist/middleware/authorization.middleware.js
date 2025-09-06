"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOwnerOrAdmin = void 0;
const http_status_codes_1 = require("http-status-codes");
const Project_model_1 = require("../models/Project.model");
const AppError_1 = require("../utils/AppError");
const asyncHandler_1 = require("../utils/asyncHandler");
const mongoose_1 = require("mongoose");
exports.isOwnerOrAdmin = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    const projectId = req.params.projectId || req.body.projectId;
    const userId = req.user?.id;
    if (!userId || !projectId || !mongoose_1.Types.ObjectId.isValid(projectId)) {
        return next(new AppError_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Valid User ID and Project ID are required.'));
    }
    const project = await Project_model_1.Project.findById(projectId).select('members');
    if (!project) {
        return next(new AppError_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, 'Project not found.'));
    }
    const member = project.members.find(m => m.userId.equals(userId));
    if (!member || (member.role !== 'owner' && member.role !== 'admin')) {
        return next(new AppError_1.AppError(http_status_codes_1.StatusCodes.FORBIDDEN, 'Elevated privileges required for this action.'));
    }
    next();
});
